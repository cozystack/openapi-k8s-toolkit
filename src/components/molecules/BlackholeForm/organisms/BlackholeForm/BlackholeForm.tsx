/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import React, { FC, useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { theme as antdtheme, Form, Button, Alert, Flex, Modal, Typography } from 'antd'
import { BugOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios, { isAxiosError } from 'axios'
import _ from 'lodash'
import { OpenAPIV2 } from 'openapi-types'
import { TJSON } from 'localTypes/JSON'
import { TFormName, TUrlParams } from 'localTypes/form'
import { TFormPrefill } from 'localTypes/formExtensions'
import { TRequestError } from 'localTypes/api'
import { TYamlByValuesReq, TYamlByValuesRes, TValuesByYamlReq, TValuesByYamlRes } from 'localTypes/bff/form'
import { usePermissions } from 'hooks/usePermissions'
import { createNewEntry, updateEntry } from 'api/forms'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { normalizeValuesForQuotasToNumber } from 'utils/normalizeValuesForQuotas'
import { getAllPathsFromObj } from 'utils/getAllPathsFromObj'
import { getPrefixSubarrays } from 'utils/getPrefixSubArrays'
import { deepMerge } from 'utils/deepMerge'
import { FlexGrow, Spacer } from 'components/atoms'
import { YamlEditor } from '../../molecules'
import { getObjectFormItemsDraft } from './utils'
import { pathKey, pruneAdditionalForValues, materializeAdditionalFromValues } from './helpers/casts'
import {
  TTemplate,
  toWildcardPath,
  collectArrayLengths,
  templateMatchesArray,
  buildConcretePathForNewItem,
  scrubLiteralWildcardKeys,
} from './helpers/prefills'
import { DEBUG_PREFILLS, dbg, group, end, wdbg, wgroup, wend, prettyPath } from './helpers/debugs'
import { sanitizeWildcardPath, expandWildcardTemplates, toStringPath, isPrefix } from './helpers/hiddenExpanded'
import { handleSubmitError, handleValidationError } from './utilsErrorHandler'
import { Styled } from './styled'
import {
  DesignNewLayoutProvider,
  HiddenPathsProvider,
  OnValuesChangeCallbackProvider,
  IsTouchedPersistedProvider,
} from './context'

type TBlackholeFormCreateProps = {
  cluster: string
  theme: 'light' | 'dark'
  urlParams: TUrlParams
  urlParamsForPermissions: {
    apiGroup?: string
    typeName?: string
  }
  formsPrefills?: TFormPrefill
  staticProperties: OpenAPIV2.SchemaObject['properties']
  required: string[]
  hiddenPaths?: string[][]
  expandedPaths: string[][]
  persistedPaths: string[][]
  prefillValuesSchema?: TJSON
  prefillValueNamespaceOnly?: string
  isNameSpaced?: false | string[]
  isCreate?: boolean
  type: 'builtin' | 'apis'
  apiGroupApiVersion: string
  kindName: string
  typeName: string
  backlink?: string | null
  designNewLayout?: boolean
  designNewLayoutHeight?: number
}

const Editor = React.lazy(() => import('@monaco-editor/react'))

export const BlackholeForm: FC<TBlackholeFormCreateProps> = ({
  cluster,
  theme,
  urlParams,
  urlParamsForPermissions,
  formsPrefills,
  staticProperties,
  required,
  hiddenPaths,
  expandedPaths,
  persistedPaths,
  prefillValuesSchema,
  prefillValueNamespaceOnly,
  isNameSpaced,
  isCreate,
  type,
  apiGroupApiVersion,
  kindName,
  typeName,
  backlink,
  designNewLayout,
  designNewLayoutHeight,
}) => {
  const { token } = antdtheme.useToken()
  const navigate = useNavigate()

  const [form] = Form.useForm()

  // onValuesChange do not work properly
  const allValues = Form.useWatch([], form)
  const namespaceFromFormData = Form.useWatch<string>(['metadata', 'namespace'], form)

  const [properties, setProperties] = useState<OpenAPIV2.SchemaObject['properties']>(staticProperties)
  const [yamlValues, setYamlValues] = useState<Record<string, unknown>>()
  const debouncedSetYamlValues = useDebounceCallback(setYamlValues, 500)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<TRequestError>()

  const [isDebugModalOpen, setIsDebugModalOpen] = useState<boolean>(false)

  const [expandedKeys, setExpandedKeys] = useState<TFormName[]>(expandedPaths || [])
  const [persistedKeys, setPersistedKeys] = useState<TFormName[]>(persistedPaths || [])
  const [resolvedHiddenPaths, setResolvedHiddenPaths] = useState<TFormName[]>([])

  const blockedPathsRef = useRef<Set<string>>(new Set())
  const overflowRef = useRef<HTMLDivElement | null>(null)
  const valuesToYamlReqId = useRef(0)
  const yamlToValuesReqId = useRef(0)
  // const skipFirstPersistedKeysEffect = useRef(true)
  const valuesToYamlAbortRef = useRef<AbortController | null>(null)
  const yamlToValuesAbortRef = useRef<AbortController | null>(null)
  const isAnyFieldFocusedRef = useRef<boolean>(false)

  // --- Feature: clear editor after resource change ---
  // A unique identifier for the YAML model of the currently selected resource
  const editorUri = useMemo(
    () =>
      `inmemory://openapi-ui/${cluster}/${apiGroupApiVersion}/${type}/${typeName}/${kindName}${
        isCreate ? '/create' : '/edit'
      }.yaml`,
    [cluster, apiGroupApiVersion, type, typeName, kindName, isCreate],
  )

  // When the resource changes, cancel any in-flight requests and clear YAML to avoid bleed-through
  useEffect(() => {
    // bump req ids so late responses are ignored
    valuesToYamlReqId.current++
    yamlToValuesReqId.current++

    // cancel in-flight calls
    try {
      valuesToYamlAbortRef.current?.abort()
    } catch (err) {
      console.error(err)
    }
    try {
      yamlToValuesAbortRef.current?.abort()
    } catch (err) {
      console.error(err)
    }

    // clear current YAML shown in the editor; it will be repopulated by onValuesChangeCallback
    setYamlValues(undefined)
    // also clear any pending external update flags inside the YAML editor by forcing a remount
    // (done by passing key={editorUri} below)
  }, [editorUri])

  // --- Feature: permissions ---
  const createPermission = usePermissions({
    group: type === 'builtin' ? undefined : urlParamsForPermissions.apiGroup ? urlParamsForPermissions.apiGroup : '',
    resource: urlParamsForPermissions.typeName || '',
    namespace: isNameSpaced ? namespaceFromFormData : undefined,
    clusterName: cluster,
    verb: 'create',
    refetchInterval: false,
    enabler: isCreate === true,
  })

  const updatePermission = usePermissions({
    group: type === 'builtin' ? undefined : urlParamsForPermissions.apiGroup ? urlParamsForPermissions.apiGroup : '',
    resource: urlParamsForPermissions.typeName || '',
    namespace: isNameSpaced ? namespaceFromFormData : undefined,
    clusterName: cluster,
    verb: 'update',
    refetchInterval: false,
    enabler: isCreate !== true,
  })

  // --- Feature: submit handler ---
  const onSubmit = () => {
    if (overflowRef.current) {
      const { scrollHeight, clientHeight } = overflowRef.current
      overflowRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      })
    }
    form
      .validateFields()
      .then(() => {
        setIsLoading(true)
        setError(undefined)
        const name = form.getFieldValue(['metadata', 'name'])
        const namespace = form.getFieldValue(['metadata', 'namespace'])

        const valuesRaw = form.getFieldsValue()
        const values = scrubLiteralWildcardKeys(valuesRaw)
        const payload: TYamlByValuesReq = {
          values,
          persistedKeys,
          properties,
        }

        axios
          .post<TYamlByValuesRes>(
            `/api/clusters/${cluster}/openapi-bff/forms/formSync/getYamlValuesByFromValues`,
            payload,
          )
          .then(({ data }) => {
            const body = data
            const endpoint = `/api/clusters/${cluster}/k8s/${type === 'builtin' ? '' : 'apis/'}${apiGroupApiVersion}${
              isNameSpaced ? `/namespaces/${namespace}` : ''
            }/${typeName}/${isCreate ? '' : name}`

            if (isCreate) {
              createNewEntry({ endpoint, body })
                .then(res => {
                  console.log(res)
                  if (backlink) {
                    navigate(backlink)
                  }
                })
                .catch(error => {
                  console.log('Form submit error', error)
                  setIsLoading(false)
                  if (isAxiosError(error) && error.response?.data.message.includes('Required value')) {
                    const keys = handleSubmitError({ error, expandedKeys })
                    setExpandedKeys([...keys])
                  }
                  setError(error)
                })
            } else {
              updateEntry({ endpoint, body })
                .then(res => {
                  console.log(res)
                  if (backlink) {
                    navigate(backlink)
                  }
                })
                .catch(error => {
                  console.log('Form submit error', error)
                  setIsLoading(false)
                  if (isAxiosError(error) && error.response?.data.message.includes('Required value')) {
                    const keys = handleSubmitError({ error, expandedKeys })
                    setExpandedKeys([...keys])
                  }
                  setError(error)
                })
            }
          })
          .catch(error => {
            console.log('BFF Transform Error', error)
            setIsLoading(false)
            if (overflowRef.current) {
              const { scrollHeight, clientHeight } = overflowRef.current
              overflowRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth',
              })
            }
            setError(error)
          })
      })
      .catch((error: { errorFields: { name: TFormName; errors: string[]; warnings: string[] }[] } & unknown) => {
        console.log('Validating error', error)
        const keys = handleValidationError({ error, expandedKeys })
        setExpandedKeys([...keys])
      })
  }

  // --- Feature: initial values ---
  /*
   Compute the initial form values once per relevant dependency change.
   This gathers defaults from multiple sources (create-mode defaults, form-specific
   prefills, namespace-only prefill, and a schema-driven prefill), merges them into
   a single nested object, and returns a shallowly sorted object for stable key order.

   + FIX: decouple from `properties`. We precompute a normalized prefill using `staticProperties`,
   then keep `initialValues` independent of `properties` to avoid feedback loops.
  */

  // Precompute normalized prefill once based on staticProperties (stable), not on `properties`
  const normalizedPrefill = useMemo(() => {
    if (!prefillValuesSchema) return undefined
    return normalizeValuesForQuotasToNumber(prefillValuesSchema, staticProperties)
  }, [prefillValuesSchema, staticProperties])

  const initialValues = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allValues: Record<string, any> = {}

    if (isCreate) {
      _.set(allValues, ['apiVersion'], apiGroupApiVersion === 'api/v1' ? 'v1' : apiGroupApiVersion)
      _.set(allValues, ['kind'], kindName)
    }

    if (formsPrefills) {
      formsPrefills.spec.values.forEach(({ path, value }) => {
        const hasWildcard = path.some(seg => seg === '*')
        if (!hasWildcard) {
          _.set(allValues, path, value)
        }
        // Wildcard templates are handled later by prefillTemplates/applyPrefillForNewArrayItem
      })
    }

    if (prefillValueNamespaceOnly) {
      _.set(allValues, ['metadata', 'namespace'], prefillValueNamespaceOnly)
    }

    if (normalizedPrefill) {
      Object.entries(normalizedPrefill).forEach(([flatKey, v]) => {
        _.set(allValues, flatKey.split('.'), v)
      })
    }

    const sorted = Object.fromEntries(Object.entries(allValues).sort(([a], [b]) => a.localeCompare(b)))
    return sorted
  }, [formsPrefills, prefillValueNamespaceOnly, isCreate, apiGroupApiVersion, kindName, normalizedPrefill])

  // --- Feature: wild card prefills ---
  // Build wildcard-based prefill templates from both formsPrefills and normalizedPrefill
  const prefillTemplates = useMemo<TTemplate[]>(() => {
    const templates: TTemplate[] = []

    // From formsPrefills (authoritative, uses path arrays already)
    if (formsPrefills?.spec?.values?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const { path, value } of formsPrefills.spec.values) {
        templates.push({ wildcardPath: toWildcardPath(path), value })
      }
    }

    // From normalizedPrefill (flat dot-keys)
    if (normalizedPrefill) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [flatKey, v] of Object.entries(normalizedPrefill)) {
        const parts = flatKey.split('.').map(seg => (/^\d+$/.test(seg) ? Number(seg) : seg))
        templates.push({ wildcardPath: toWildcardPath(parts), value: v })
      }
    }

    // stable order: longer (more specific) templates first
    return templates.sort((a, b) => b.wildcardPath.length - a.wildcardPath.length)
  }, [formsPrefills, normalizedPrefill])

  useEffect(() => {
    if (!DEBUG_PREFILLS) return
    dbg('templates (wildcards, ordered specific→generic):')
    prefillTemplates.forEach((t, i) => dbg(`#${i}`, t.wildcardPath.join('.'), '=>', t.value))
  }, [prefillTemplates])

  // track previous array lengths (just under your other useRefs)
  const prevArrayLengthsRef = useRef<Map<string, number>>(new Map())

  const applyPrefillForNewArrayItem = useCallback(
    (arrayPath: (string | number)[], newIndex: number) => {
      group(`apply for ${JSON.stringify(arrayPath)}[${newIndex}]`)
      // eslint-disable-next-line no-restricted-syntax
      for (const tpl of prefillTemplates) {
        const matches = templateMatchesArray(tpl, arrayPath)
        dbg(matches ? '✅ match' : '❌ no match', tpl.wildcardPath.join('.'))
        // eslint-disable-next-line no-continue
        if (!matches) continue

        const concretePath = buildConcretePathForNewItem(tpl, arrayPath, newIndex)
        const current = form.getFieldValue(concretePath as any)
        dbg('current value at path', concretePath, ':', current)

        if (typeof current === 'undefined') {
          const toSet = _.cloneDeep(tpl.value)
          dbg('setting value', { path: concretePath, value: toSet })
          form.setFieldValue(concretePath as any, toSet)
        } else {
          dbg('skipping set (already has value)')
        }
      }
      end() // apply group
    },
    [form, prefillTemplates],
  )

  // --- Feature: wildcard hidden/expanded items ---
  // Raw props: hiddenPaths?: string[][], expandedPaths: string[][]
  // Normalize: strings/nums/objects → allow '*' wildcards
  const hiddenWildcardTemplates = useMemo<(string | number)[][]>(() => {
    const raw = hiddenPaths ?? []
    wgroup('hidden raw templates')
    raw.forEach((p, i) => wdbg(`#${i}`, p))
    wend()
    const sanitized = raw.map(p => sanitizeWildcardPath(p as (string | number | unknown)[]))
    wgroup('hidden sanitized templates')
    sanitized.forEach((p, i) => wdbg(`#${i}`, prettyPath(p)))
    wend()
    return sanitized
  }, [hiddenPaths])

  const expandedWildcardTemplates = useMemo<(string | number)[][]>(() => {
    const raw = expandedPaths ?? []
    wgroup('expanded raw templates')
    raw.forEach((p, i) => wdbg(`#${i}`, p))
    wend()
    const sanitized = raw.map(p => sanitizeWildcardPath(p as (string | number | unknown)[]))
    wgroup('expanded sanitized templates')
    sanitized.forEach((p, i) => wdbg(`#${i}`, prettyPath(p)))
    wend()
    return sanitized
  }, [expandedPaths])

  useEffect(() => {
    if (!initialValues) return
    wgroup('initial resolve')

    const hiddenResolved = expandWildcardTemplates(hiddenWildcardTemplates, initialValues as any, {
      includeMissingExact: true,
      includeMissingFinalForWildcard: true,
    })
    wdbg('hidden resolved', hiddenResolved.map(prettyPath))
    setResolvedHiddenPaths(hiddenResolved as TFormName[])

    const expandedResolved = expandWildcardTemplates(expandedWildcardTemplates, initialValues as any)
    wdbg('expanded resolved', expandedResolved.map(prettyPath))
    setExpandedKeys(prev => {
      const seen = new Set(prev.map(x => JSON.stringify(x)))
      const merged = [...prev]
      // eslint-disable-next-line no-restricted-syntax
      for (const p of expandedResolved) {
        const k = JSON.stringify(p as any)
        if (!seen.has(k)) {
          seen.add(k)
          merged.push(p as any)
        }
      }
      return merged
    })

    wend()
  }, [initialValues, hiddenWildcardTemplates, expandedWildcardTemplates])

  const resolvedHiddenStringPaths = useMemo<string[][]>(
    () => resolvedHiddenPaths.map(toStringPath),
    [resolvedHiddenPaths],
  )

  // --- Feature: form and yaml editor syncs ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevInitialValues = useRef<Record<string, any>>()

  /**
   * Debounced function that synchronizes form values to YAML using a backend API.
   * It cancels previous requests when new ones are triggered, ensuring only the latest state is processed.
   *
   * @param payload - Data to send to the API (form values + metadata)
   * @param myId - Unique identifier for this particular request (to ignore stale responses)
   */
  const debouncedPostValuesToYaml = useDebounceCallback((payload: TYamlByValuesReq, myId: number) => {
    try {
      // Abort previous in-flight request
      valuesToYamlAbortRef.current?.abort()
    } catch (err) {
      console.error(err)
    }

    // Create a new AbortController for this request
    const controller = new AbortController()
    valuesToYamlAbortRef.current = controller
    axios
      .post<TYamlByValuesRes>(
        `/api/clusters/${cluster}/openapi-bff/forms/formSync/getYamlValuesByFromValues`,
        payload,
        { signal: controller.signal },
      )
      .then(({ data }) => {
        // Ignore the response if it's from an outdated request
        if (myId !== valuesToYamlReqId.current) return
        debouncedSetYamlValues(data)
      })
      // Silent catch to ignore abort errors or user-triggered cancels
      .catch(() => {})
  }, 300)

  /**
   * Callback triggered whenever the form values change.
   * Builds the payload and triggers the debounced sync-to-YAML call.
   */
  const onValuesChangeCallback = useCallback(
    (values?: any, flag?: string) => {
      console.log('fired', flag)
      // Get the most recent form values (or use the provided ones)
      const vRaw = values ?? form.getFieldsValue(true)
      const v = scrubLiteralWildcardKeys(vRaw)

      // resolve wildcard templates for hidden & expanded against current values ---
      wgroup('values→resolve wildcards')

      const hiddenResolved = expandWildcardTemplates(
        hiddenWildcardTemplates,
        v,
        { includeMissingExact: true, includeMissingFinalForWildcard: true }, // only hidden opts in
      )
      wdbg('hidden resolved', hiddenResolved.map(prettyPath))

      setResolvedHiddenPaths(hiddenResolved as TFormName[])

      const expandedResolved = expandWildcardTemplates(expandedWildcardTemplates, v)
      wdbg('expanded resolved', expandedResolved.map(prettyPath))

      // Merge auto-expanded with current expandedKeys (preserve user choices)
      if (expandedResolved.length) {
        setExpandedKeys(prev => {
          const seen = new Set(prev.map(x => JSON.stringify(x)))
          const merged = [...prev]
          // eslint-disable-next-line no-restricted-syntax
          for (const p of expandedResolved) {
            const k = JSON.stringify(p as any)
            if (!seen.has(k)) {
              seen.add(k)
              merged.push(p as any)
            }
          }
          return merged
        })
      }
      wend()

      // show a snapshot of current values at a shallow level
      group('values change')
      dbg('values snapshot keys', Object.keys(v || {}))

      const newLengths = collectArrayLengths(v)
      const prevLengths = prevArrayLengthsRef.current

      // If you delete arr el and then add it again. There is no purge
      // Adding purge:
      // --- handle SHRINK: indices removed ---
      for (const [k, prevLen] of prevLengths.entries()) {
        const newLen = newLengths.get(k) ?? 0
        if (newLen < prevLen) {
          const arrayPath = JSON.parse(k) as (string | number)[]
          for (let i = newLen; i < prevLen; i++) {
            // purge UI state + tombstones under removed index
            const removedPrefix = [...arrayPath, i]

            // drop expansions/persisted under this subtree
            setExpandedKeys(prev =>
              prev.filter(p => {
                const full = Array.isArray(p) ? p : [p]
                return !isPrefix(full, removedPrefix)
              }),
            )
            setPersistedKeys(prev =>
              prev.filter(p => {
                const full = Array.isArray(p) ? p : [p]
                return !isPrefix(full, removedPrefix)
              }),
            )

            // clear any blocks (tombstones) beneath removed index
            for (const k of [...blockedPathsRef.current]) {
              const path = JSON.parse(k) as (string | number)[]
              if (isPrefix(path, removedPrefix)) blockedPathsRef.current.delete(k)
            }
          }
        }
      }

      // --- handle GROW: indices added ---
      for (const [k, newLen] of newLengths.entries()) {
        const prevLen = prevLengths.get(k) ?? 0
        if (newLen > prevLen) {
          const arrayPath = JSON.parse(k) as (string | number)[]
          for (let i = prevLen; i < newLen; i++) {
            const itemPath = [...arrayPath, i]

            // ensure the node exists to stabilize render/hidden resolution
            const itemVal = form.getFieldValue(itemPath as any)
            if (typeof itemVal === 'undefined') {
              form.setFieldValue(itemPath as any, {}) // for object arrays; harmless for others
            }

            // guarantee no stale tombstone blocks this subtree
            blockedPathsRef.current.delete(JSON.stringify(itemPath))

            // your existing prefills (wildcards etc.)
            applyPrefillForNewArrayItem(arrayPath, i)
          }
        }
      }

      // keep tracker in sync
      prevArrayLengthsRef.current = newLengths

      // dump lengths (readable)
      dbg('array lengths (prev → new)')
      const allKeys = new Set([...prevLengths.keys(), ...newLengths.keys()])
      ;[...allKeys].forEach(k => dbg(k, ' : ', prevLengths.get(k), '→', newLengths.get(k)))

      // eslint-disable-next-line no-restricted-syntax
      for (const [k, newLen] of newLengths.entries()) {
        const prevLen = prevLengths.get(k) ?? 0
        if (newLen > prevLen) {
          const arrayPath = JSON.parse(k) as (string | number)[]
          dbg('🟢 detected growth', { pathKey: k, arrayPath, prevLen, newLen })

          for (let i = prevLen; i < newLen; i++) {
            dbg('…prefilling new index', i, 'under', arrayPath)
            applyPrefillForNewArrayItem(arrayPath, i)
          }
        }
      }
      prevArrayLengthsRef.current = newLengths

      end() // values change

      const payload: TYamlByValuesReq = {
        values: v,
        persistedKeys,
        properties,
      }

      // Increment the request ID to track the most recent sync call
      const myId = ++valuesToYamlReqId.current
      debouncedPostValuesToYaml(payload, myId)
    },
    [
      form,
      properties,
      persistedKeys,
      debouncedPostValuesToYaml,
      applyPrefillForNewArrayItem,
      hiddenWildcardTemplates,
      expandedWildcardTemplates,
    ],
  )

  useEffect(() => {
    onValuesChangeCallback(undefined, 'fuck me')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValues])

  /**
   * Debounced function that converts YAML → form values via the backend and
   * carefully merges the result into the current form & schema state.
   *
   * - Cancels in-flight requests when new ones start.
   * - Ignores stale responses using a monotonically increasing request id.
   * - Diffs previous form paths vs. next data paths to clear removed fields and block them.
   * - Updates the schema by pruning & materializing additionalProperties according to new data.
   *
   * @param payload - YAML payload and schema context for the API
   * @param myId - A request-sequencing id to guard against stale responses
   */
  const debouncedPostYamlToValues = useDebounceCallback((payload: TValuesByYamlReq, myId: number) => {
    try {
      // Abort any previous YAML→values request still in flight
      yamlToValuesAbortRef.current?.abort()
    } catch (err) {
      console.error(err)
    }

    // Create a fresh controller for this request
    const controller = new AbortController()
    yamlToValuesAbortRef.current = controller

    axios
      .post<TValuesByYamlRes>(`/api/clusters/${cluster}/openapi-bff/forms/formSync/getFormValuesByYaml`, payload, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        // Discard if this is not the latest request
        if (myId !== yamlToValuesReqId.current) return
        // No data, nothing to merge
        if (!data) return

        // --- Compute paths present in previous form state vs. incoming data ---

        // Get full snapshot of current form values (all fields)
        const prevAll = form.getFieldsValue(true)
        // Extract path arrays (e.g., ['spec','env',0,'name']) from objects
        const prevPaths = getAllPathsFromObj(prevAll)
        const nextPaths = getAllPathsFromObj(data as Record<string, unknown>)
        const nextSet = new Set(nextPaths.map(p => pathKey(p)))

        // For any path that existed before but not in new YAML data:
        // - Clear the form value
        // - Block the path so it won't be re-added by schema materialization
        prevPaths.forEach(p => {
          const k = pathKey(p)
          if (!nextSet.has(k)) {
            form.setFieldValue(p as any, undefined)
            // Prevent re-creation of removed paths on the next materialization pass
            blockedPathsRef.current.add(k)
          }
        })

        // Merge the new YAML-derived values into the form
        form.setFieldsValue(data)

        // Unblock paths that reappeared in the new YAML-derived data
        const dataPathSet = new Set(getAllPathsFromObj(data as Record<string, unknown>).map(p => pathKey(p)))
        blockedPathsRef.current.forEach(k => {
          if (dataPathSet.has(k)) blockedPathsRef.current.delete(k)
        })

        // --- Bring schema in sync: prune missing additional props, then materialize new ones ---
        setProperties(prevProps => {
          // Remove additionalProperties entries that are now absent or blocked
          const pruned = pruneAdditionalForValues(prevProps, data as Record<string, unknown>, blockedPathsRef)

          // Add schema nodes for any new values allowed by additionalProperties
          const { props: materialized, toPersist } = materializeAdditionalFromValues(
            pruned,
            data as Record<string, unknown>,
            blockedPathsRef,
          )

          // ✅ Guard against no-op updates to break feedback loops
          if (_.isEqual(prevProps, materialized)) {
            return prevProps
          }

          // Ensure new/empty fields discovered during materialization are tracked for persistence
          if (toPersist.length) {
            setPersistedKeys(prev => {
              const seen = new Set(prev.map(x => JSON.stringify(x)))
              const merged = [...prev]
              toPersist.forEach(p => {
                const k = JSON.stringify(p)
                if (!seen.has(k)) {
                  seen.add(k)
                  merged.push(p)
                }
              })
              return merged
            })
          }
          return materialized
        })
      })
      // Silent catch: ignore abort/cancel or transient errors here
      .catch(() => {})
  }, 300)

  /**
   * Handler for when the YAML editor changes.
   * Skips applying YAML-driven updates while the user is actively typing in a form field
   * (prevents clobbering in-progress input), then triggers the debounced YAML→values sync.
   */
  const onYamlChangeCallback = useCallback(
    (values: Record<string, unknown>) => {
      // If a form field is focused, ignore YAML-driven updates to avoid overwriting user's typing
      if (isAnyFieldFocusedRef.current) return
      const payload: TValuesByYamlReq = { values, properties }
      const myId = ++yamlToValuesReqId.current
      debouncedPostYamlToValues(payload, myId)
    },
    [properties, debouncedPostYamlToValues],
  )

  useEffect(() => {
    const root = overflowRef.current
    if (!root) return undefined
    const onFocusIn = () => {
      isAnyFieldFocusedRef.current = true
    }
    const onFocusOut = () => {
      const active = document.activeElement
      if (!active || !root.contains(active)) {
        isAnyFieldFocusedRef.current = false
        // After blur, re-sync to apply any queued YAML changes
        onValuesChangeCallback()
      }
    }

    root.addEventListener('focusin', onFocusIn)
    root.addEventListener('focusout', onFocusOut)

    return () => {
      root.removeEventListener('focusin', onFocusIn)
      root.removeEventListener('focusout', onFocusOut)
    }
  }, [onValuesChangeCallback])

  /*
    Whenever the computed `initialValues` change, trigger a form update if the new
    values differ from the previous ones. This ensures the form syncs properly with
    refreshed or recalculated defaults (e.g., after switching resource kind or schema).
  */
  useEffect(() => {
    const prev = prevInitialValues.current
    if (!_.isEqual(prev, initialValues)) {
      if (initialValues) {
        console.log('fired initial values', initialValues)
        onValuesChangeCallback(initialValues)
      }
      prevInitialValues.current = initialValues
    }
  }, [onValuesChangeCallback, initialValues])

  /* watch persisted and trigger values change callback */
  useEffect(() => {
    // if (skipFirstPersistedKeysEffect.current) {
    //   skipFirstPersistedKeysEffect.current = false
    //   return
    // }
    onValuesChangeCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistedKeys])

  // --- Feature: expanded initial ---
  useEffect(() => {
    let allPaths: (string | number)[][] = []
    if (formsPrefills) {
      allPaths = formsPrefills.spec.values.flatMap(({ path }) => getPrefixSubarrays(path))
    }
    if (prefillValuesSchema) {
      if (typeof prefillValuesSchema === 'object' && prefillValuesSchema !== null) {
        allPaths = [...allPaths, ...getAllPathsFromObj(prefillValuesSchema)]
      }
    }
    const possibleNewKeys = [...expandedKeys, ...allPaths]
    const seen = new Set<TFormName>()
    const uniqueKeys = possibleNewKeys.filter(item => {
      const key = Array.isArray(item) ? JSON.stringify(item) : item
      if (seen.has(key as TFormName)) {
        return false
      }
      seen.add(key as TFormName)
      return true
    })
    setExpandedKeys([...uniqueKeys])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiGroupApiVersion, formsPrefills, prefillValuesSchema, type, typeName])

  // --- Feature: casting properties both sides ---
  /*
   When `initialValues` become available or change, update the schema (`properties`)
   to include any fields derived from `additionalProperties` that appear in the
   initial data. This ensures that all dynamic fields are represented in the schema
   before rendering or editing begins.

   + FIX: guard against no-op updates to `properties`.
  */
  useEffect(() => {
    // Skip if there are no initial values yet
    if (!initialValues) return

    setProperties(prev => {
      // Expand the schema based on any dynamic keys in initialValues that are allowed
      // by `additionalProperties`. This process returns:
      //  - `p2`: the updated schema with new child nodes added where needed
      //  - `toPersist`: a list of new paths that should be persisted (usually empty objects)
      const { props: p2, toPersist } = materializeAdditionalFromValues(
        prev,
        initialValues as Record<string, unknown>,
        blockedPathsRef,
      )

      // ✅ Guard: do not update if nothing changed
      if (_.isEqual(prev, p2)) return prev

      // 🧠 NOTE:
      // We intentionally do *not* auto-expand paths from initial values here.
      // This preserves the user's UI collapse/expand state (e.g., in a form tree view).
      if (toPersist.length) {
        setPersistedKeys(prevPk => {
          const seen = new Set(prevPk.map(x => JSON.stringify(x)))
          const merged = [...prevPk]
          toPersist.forEach(p => {
            const k = JSON.stringify(p)
            if (!seen.has(k)) {
              seen.add(k)
              merged.push(p)
            }
          })
          return merged
        })
      }

      // Return the updated schema to be stored in state
      return p2
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  if (!properties) {
    return null
  }

  // --- Feature: disable namespace edit ---
  const namespaceData = isNameSpaced
    ? {
        filterSelectOptions,
        selectValues: isNameSpaced.map(name => ({
          label: name,
          value: name,
        })),
        // disabled: !!prefillValueNamespaceOnly,
        disabled: !isCreate,
      }
    : undefined

  // --- Feature: additional properties methods ---
  const makeValueUndefined = (path: TFormName) => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    form.setFieldValue(path as any, undefined)
    onValuesChangeCallback()
  }

  const addField = ({
    path,
    name,
    type,
    items,
    nestedProperties,
    required,
  }: {
    path: TFormName
    name: string
    type: string
    items?: { type: string }
    nestedProperties?: OpenAPIV2.SchemaObject['properties']
    required?: string
  }) => {
    const arrPath = Array.isArray(path) ? path : [path]
    const newObject = arrPath.reduceRight<Record<string, unknown>>(
      (acc, key) => {
        return { [key]: { properties: acc } } // Create a new object with the current key and the accumulator as its value
      },
      { [name]: { type, items, properties: nestedProperties, required, isAdditionalProperties: true } },
    )
    const oldProperties = _.cloneDeep(properties)
    const newProperties = deepMerge(oldProperties, newObject)
    setProperties(newProperties)

    // 1) Initialize the value under the added field
    const fullPath = [...arrPath, name] as TFormName
    const currentValue = form.getFieldValue(fullPath)
    if (currentValue === undefined) {
      if (type === 'string') {
        form.setFieldValue(fullPath as any, '')
      } else if (type === 'number' || type === 'integer') {
        form.setFieldValue(fullPath as any, 0)
      } else if (type === 'array') {
        form.setFieldValue(fullPath as any, [])
      } else {
        // object / unknown -> make it an object
        form.setFieldValue(fullPath as any, {})
      }
    }

    // 2) Auto-mark for persist
    setPersistedKeys(prev => {
      const seen = new Set(prev.map(x => JSON.stringify(x)))
      const k = JSON.stringify(fullPath)
      if (seen.has(k)) return prev
      return [...prev, fullPath]
    })

    // 3) Trigger YAML update to ensure new field is properly handled
    onValuesChangeCallback()
  }

  const removeField = ({ path }: { path: TFormName }) => {
    const arrPath = Array.isArray(path) ? path : [path]
    // const pathWithProperties = arrPath.flatMap(el => [el, 'properties']).slice(0, -1)
    const modifiedProperties = _.cloneDeep(properties)
    // /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    // const result = _.unset(modifiedProperties, pathWithProperties)

    blockedPathsRef.current.add(pathKey(arrPath))
    form.setFieldValue(arrPath as any, undefined)

    setProperties(modifiedProperties)
    onValuesChangeCallback()
  }

  // --- Feature: expand/persist methods ---
  const onExpandOpen = (value: TFormName) => {
    setExpandedKeys([...expandedKeys, value])
  }

  const onExpandClose = (value: TFormName) => {
    setExpandedKeys([...expandedKeys.filter(arr => JSON.stringify(arr) !== JSON.stringify(value))])
  }

  const onPersistMark = (value: TFormName, type?: 'str' | 'number' | 'arr' | 'obj') => {
    if (type) {
      const currentValue = form.getFieldValue(value)
      if (currentValue === undefined) {
        if (type === 'str') {
          form.setFieldValue(value, '')
        }
        if (type === 'number') {
          form.setFieldValue(value, 0)
        }
        if (type === 'arr') {
          form.setFieldValue(value, [])
        }
        if (type === 'obj') {
          form.setFieldValue(value, {})
        }
      }
    }
    setPersistedKeys(prev => {
      const keyStr = JSON.stringify(value)
      const alreadyExists = prev.some(p => JSON.stringify(p) === keyStr)
      if (alreadyExists) return prev
      return [...prev, value]
    })
  }

  const onPersistUnmark = (value: TFormName) => {
    console.log(value)
    setPersistedKeys([...persistedKeys.filter(arr => JSON.stringify(arr) !== JSON.stringify(value))])
  }

  return (
    <>
      <Styled.Container $designNewLayout={designNewLayout} $designNewLayoutHeight={designNewLayoutHeight}>
        <Styled.OverflowContainer ref={overflowRef}>
          <Form form={form} initialValues={initialValues} onValuesChange={onValuesChangeCallback}>
            <DesignNewLayoutProvider value={designNewLayout}>
              <OnValuesChangeCallbackProvider value={onValuesChangeCallback}>
                <IsTouchedPersistedProvider value={{}}>
                  <HiddenPathsProvider value={resolvedHiddenStringPaths}>
                    {getObjectFormItemsDraft({
                      properties,
                      name: [],
                      required,
                      namespaceData,
                      makeValueUndefined,
                      addField,
                      removeField,
                      isEdit: !isCreate,
                      expandedControls: { onExpandOpen, onExpandClose, expandedKeys },
                      persistedControls: { onPersistMark, onPersistUnmark, persistedKeys },
                      urlParams,
                    })}
                  </HiddenPathsProvider>
                </IsTouchedPersistedProvider>
              </OnValuesChangeCallbackProvider>
            </DesignNewLayoutProvider>
            {!designNewLayout && (
              <>
                <Spacer $space={10} $samespace />
                <Alert
                  type="warning"
                  message="Only the data from the form will be sent. Empty fields will be removed recursively."
                />
              </>
            )}
            {isCreate && createPermission.data?.status.allowed === false && (
              <>
                <Spacer $space={10} $samespace />
                <Alert type="warning" message="Insufficient rights to create" />
              </>
            )}
            {!isCreate && updatePermission.data?.status.allowed === false && (
              <>
                <Spacer $space={10} $samespace />
                <Alert type="warning" message="Insufficient rights to edit" />
              </>
            )}
            {/* {error && (
              <>
                <Spacer $space={10} $samespace />
                <Alert message={`An error has occurred: ${error?.response?.data?.message} `} type="error" />
              </>
            )} */}
          </Form>
        </Styled.OverflowContainer>
        <div>
          <YamlEditor
            key={editorUri} // force a fresh editor when resource changes
            editorUri={editorUri} // tell the editor which Monaco model to use
            theme={theme}
            currentValues={yamlValues || {}}
            onChange={onYamlChangeCallback}
          />
        </div>
      </Styled.Container>
      <FlexGrow />
      <Styled.ControlsRowContainer $bgColor={token.colorPrimaryBg} $designNewLayout={designNewLayout}>
        <Flex gap={designNewLayout ? 10 : 16} align="center">
          <Button type="primary" onClick={onSubmit} loading={isLoading}>
            Submit
          </Button>
          {backlink && <Button onClick={() => navigate(backlink)}>Cancel</Button>}
          <Button onClick={() => setIsDebugModalOpen(true)} icon={<BugOutlined />} />
          {designNewLayout && (
            <div>
              <Typography.Text>
                Only the data from the form will be sent. Empty fields will be removed recursively.
              </Typography.Text>
            </div>
          )}
        </Flex>
      </Styled.ControlsRowContainer>
      {error && (
        <Modal
          open={!!error}
          onOk={() => setError(undefined)}
          // onClose={() => setError(undefined)}
          onCancel={() => setError(undefined)}
          title={
            <Typography.Text type="danger">
              <Styled.BigText>Error!</Styled.BigText>
            </Typography.Text>
          }
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          An error has occurred: {error?.response?.data?.message}
        </Modal>
      )}
      {isDebugModalOpen && (
        <Modal
          open={isDebugModalOpen}
          onOk={() => setIsDebugModalOpen(false)}
          onCancel={() => setIsDebugModalOpen(false)}
          // onClose={() => setIsDebugModalOpen(false)}
          title="Debug for properties"
          width="90vw"
        >
          <Styled.DebugContainer $designNewLayoutHeight={designNewLayoutHeight}>
            <Suspense fallback={<div>Loading...</div>}>
              <Editor
                defaultLanguage="json"
                width="100%"
                height={designNewLayoutHeight || '75vh'}
                theme="vs-dark"
                value={JSON.stringify(properties, null, 2)}
                options={{
                  theme: 'vs-dark',
                  minimap: { enabled: false },
                }}
              />
            </Suspense>
          </Styled.DebugContainer>
        </Modal>
      )}
    </>
  )
}
