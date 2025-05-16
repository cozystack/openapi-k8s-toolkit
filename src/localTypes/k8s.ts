/* eslint-disable @typescript-eslint/no-explicit-any */
import { TJSON } from './JSON'

export type TSingleResource = unknown & {
  metadata: {
    name: string
    creationTimestamp: string
    namespace?: string
    managedFields?: any
  }
  spec?: TJSON
  status?: any
}

export type TApiResources = {
  kind: string
  apiVersion: string
  metadata: {
    resourceVersion: string
  }
  items: TSingleResource[]
}

export type TBuiltinResourceTypes = {
  kind: string
  groupVersion: string
  resources: {
    name: string
    singularName: string
    namespaced: boolean
    kind: string
    verbs: string[]
  }[]
}
