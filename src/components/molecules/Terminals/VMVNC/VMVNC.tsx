/* eslint-disable no-console */
import React, { FC, useEffect, useState, useRef } from 'react'
import { Result, Spin } from 'antd'
import { Styled } from './styled'

// Type definition for RFB (noVNC doesn't have TypeScript definitions)
type RFB = any

export type TVMVNCProps = {
  cluster: string
  namespace: string
  vmName: string
  substractHeight: number
}

export const VMVNC: FC<TVMVNCProps> = ({ cluster, namespace, vmName, substractHeight }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Loading VNC client...')
  const [rfbModule, setRfbModule] = useState<any>(null)

  const screenRef = useRef<HTMLDivElement>(null)
  const rfbRef = useRef<RFB | null>(null)

  // Dynamically load noVNC to avoid build issues with top-level await
  useEffect(() => {
    let isMounted = true

    const loadNoVNC = async () => {
      try {
        // Dynamic import of noVNC
        // The consuming app's Vite config will resolve this module and bundle it properly
        // @ts-ignore - noVNC doesn't have TypeScript definitions
        const RFBModule = await import('@novnc/novnc/lib/rfb.js')
        
        // Log module structure for debugging
        console.log('[VMVNC]: RFB module structure:', {
          keys: Object.keys(RFBModule),
          default: RFBModule.default,
          RFB: RFBModule.RFB,
          moduleType: typeof RFBModule,
          defaultType: typeof RFBModule.default,
          defaultConstructor: RFBModule.default?.prototype?.constructor,
        })
        
        // Extract RFB constructor - noVNC exports RFB as default export
        // RFB is defined as: var RFB = exports["default"] = function (_EventTargetMixin) { ... }
        // So it should be available as RFBModule.default
        let RFB: any = null
        
        // Try default export first (this is how noVNC exports it)
        if (RFBModule.default && typeof RFBModule.default === 'function') {
          RFB = RFBModule.default
          console.log('[VMVNC]: Using RFB from default export')
        }
        // Try named export RFB
        else if (RFBModule.RFB && typeof RFBModule.RFB === 'function') {
          RFB = RFBModule.RFB
          console.log('[VMVNC]: Using RFB from named export')
        }
        // Try if the module itself is the constructor
        else if (typeof RFBModule === 'function') {
          RFB = RFBModule
          console.log('[VMVNC]: Using RFB as module itself')
        }
        // Try nested default (in case of double wrapping)
        else if (RFBModule.default?.default && typeof RFBModule.default.default === 'function') {
          RFB = RFBModule.default.default
          console.log('[VMVNC]: Using RFB from nested default')
        }
        
        // Verify it's actually a constructor function
        if (!RFB || typeof RFB !== 'function') {
          console.error('[VMVNC]: Failed to extract RFB constructor. Module structure:', RFBModule)
          throw new Error('Failed to extract RFB constructor from module - invalid export structure')
        }
        
        // Verify it's a class constructor (has prototype)
        if (!RFB.prototype) {
          console.error('[VMVNC]: RFB does not have prototype, it may not be a class constructor')
          throw new Error('RFB is not a class constructor')
        }
        
        // IMPORTANT: Check if RFB is wrapped or if we need to extract the real constructor
        // The error "Cannot call a class as a function" suggests the class might be wrapped
        let actualRFB = RFB
        
        // Check prototype.constructor
        const prototypeConstructor = RFB.prototype?.constructor
        if (prototypeConstructor && prototypeConstructor !== RFB && typeof prototypeConstructor === 'function') {
          console.log('[VMVNC]: Found different constructor in prototype, checking it:', {
            original: RFB.name,
            prototypeConstructor: prototypeConstructor.name,
          })
          // Only use it if it has the same prototype structure
          if (prototypeConstructor.prototype && prototypeConstructor.prototype.constructor === prototypeConstructor) {
            actualRFB = prototypeConstructor
            console.log('[VMVNC]: Using prototype.constructor as RFB')
          }
        }
        
        // Final check: ensure the constructor we're using is valid
        if (!actualRFB || typeof actualRFB !== 'function' || !actualRFB.prototype) {
          throw new Error('Invalid RFB constructor extracted')
        }
        
        console.log('[VMVNC]: RFB constructor extracted successfully:', {
          name: actualRFB.name,
          prototype: actualRFB.prototype,
          isFunction: typeof actualRFB === 'function',
          prototypeConstructor: actualRFB.prototype?.constructor?.name,
          isOriginal: actualRFB === RFB,
        })
        
        // Use the actual constructor
        RFB = actualRFB
        
        // Store both the constructor and the original module reference
        // The original module reference is needed for Reflect.construct's newTarget
        // to ensure `this instanceof RFB` passes in _classCallCheck
        if (isMounted) {
          // Store both the constructor and the original module default export
          // This ensures we can use the original RFB as newTarget in Reflect.construct
          setRfbModule({
            constructor: RFB,
            original: RFBModule.default, // Keep reference to original for instanceof checks
          })
          setStatus('Connecting...')
        }
      } catch (err) {
        console.error('[VMVNC]: Failed to load noVNC library:', err)
        if (isMounted) {
          setError(`Failed to load VNC client: ${err instanceof Error ? err.message : 'Unknown error'}. Please ensure @novnc/novnc is installed.`)
          setIsLoading(false)
        }
      }
    }

    loadNoVNC()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!screenRef.current || !rfbModule) {
      return
    }

    // rfbModule can be either the constructor directly or an object with constructor and original
    const RFB = typeof rfbModule === 'function' ? rfbModule : rfbModule.constructor
    const originalRFB = typeof rfbModule === 'function' ? rfbModule : rfbModule.original || rfbModule.constructor

    // Build WebSocket URL for VNC connection
    // Format: /k8s/apis/subresources.kubevirt.io/v1/namespaces/{namespace}/virtualmachineinstances/{vmName}/vnc
    // RFB can accept either a full URL or a relative path
    // Based on the working example, we'll use relative path - RFB will use current host
    const wsPath = `/k8s/apis/subresources.kubevirt.io/v1/namespaces/${namespace}/virtualmachineinstances/${vmName}/vnc`
    // Try using relative path first - RFB will construct full URL using current host
    const wsUrl = wsPath
    
    console.log(`[VMVNC ${namespace}/${vmName}]: WebSocket path: ${wsPath}`)
    console.log(`[VMVNC ${namespace}/${vmName}]: Current host: ${window.location.host}`)
    console.log(`[VMVNC ${namespace}/${vmName}]: Current protocol: ${window.location.protocol}`)

    console.log(`[VMVNC ${namespace}/${vmName}]: Connecting to ${wsUrl}`)
    console.log(`[VMVNC ${namespace}/${vmName}]: RFB constructor details:`, {
      type: typeof RFB,
      name: RFB?.name,
      prototype: RFB?.prototype,
      isConstructor: RFB?.prototype?.constructor === RFB,
      toString: typeof RFB?.toString === 'function' ? RFB.toString().substring(0, 100) : String(RFB),
    })

    try {
      // Verify RFB is a constructor function
      if (typeof RFB !== 'function') {
        throw new Error(`RFB is not a constructor function. Type: ${typeof RFB}`)
      }
      
      // Verify RFB has prototype (it's a class/constructor)
      if (!RFB.prototype) {
        throw new Error('RFB does not have prototype - cannot be used as constructor')
      }
      
      // Try to create RFB instance
      // The error "Cannot call a class as a function" occurs inside RFB class initialization
      // This suggests that RFB might be wrapped or called incorrectly
      // Let's try to extract the real constructor and use it properly
      let rfb: any = null
      
      // Check if RFB.prototype.constructor is different (might be the real constructor)
      const actualConstructor = RFB.prototype?.constructor
      let constructorToUse = RFB
      
      // If prototype.constructor is different, use it
      if (actualConstructor && actualConstructor !== RFB && typeof actualConstructor === 'function') {
        console.log('[VMVNC]: Using prototype.constructor instead of RFB:', {
          RFB: RFB.name,
          constructor: actualConstructor.name,
        })
        constructorToUse = actualConstructor
      }
      
      console.log('[VMVNC]: Constructor details before instantiation:', {
        RFB: RFB.name,
        constructorToUse: constructorToUse.name,
        areEqual: RFB === constructorToUse,
        hasPrototype: !!constructorToUse.prototype,
        prototypeConstructor: constructorToUse.prototype?.constructor?.name,
      })
      
      // The error "Cannot call a class as a function" occurs because _classCallCheck(this, RFB) fails
      // This happens when RFB is wrapped by Vite/Rollup and `this instanceof RFB` fails
      // Solution: Use Reflect.construct with the original constructor as newTarget
      // This ensures that `this instanceof RFB` passes the check
      try {
        console.log('[VMVNC]: Creating RFB instance')
        console.log('[VMVNC]: Constructor details:', {
          name: constructorToUse.name,
          type: typeof constructorToUse,
          hasPrototype: !!constructorToUse.prototype,
          prototypeConstructor: constructorToUse.prototype?.constructor?.name,
        })
        
        // Use Reflect.construct with originalRFB as newTarget
        // This ensures that `this instanceof originalRFB` passes in _classCallCheck
        // The third parameter (newTarget) determines what `this instanceof` checks against
        // We use originalRFB (from module.default) as newTarget to ensure the instanceof check passes
        // RFB constructor: new RFB(target, urlOrChannel, options)
        // urlOrChannel can be:
        // - A string URL (full URL or relative path)
        // - A WebSocket object
        // - A WebSocket-like object
        rfb = Reflect.construct(
          constructorToUse, // target constructor (may be wrapped)
          [
            screenRef.current,
            wsUrl, // URL or path - RFB will handle WebSocket connection
            {
              credentials: {
                password: '', // VNC password if needed
              },
              // Additional options if needed
              // target: screenRef.current,
              // focusOnClick: true,
              // clipViewport: true,
              // dragViewport: true,
              // scaleViewport: true,
              // resizeSession: true,
            },
          ],
          originalRFB // newTarget - use original RFB from module for instanceof check
        )
        
        // Verify the instance was created correctly
        if (!(rfb instanceof constructorToUse)) {
          console.warn('[VMVNC]: Instance is not instanceof constructor, but continuing anyway')
        }
        
        console.log('[VMVNC]: RFB instance created successfully')
      } catch (err) {
        console.error('[VMVNC]: Failed to create RFB instance:', err)
        console.error('[VMVNC]: Error details:', {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          constructorName: constructorToUse.name,
          constructorType: typeof constructorToUse,
        })
        throw err
      }
      
      // Verify rfb instance was created correctly
      if (!rfb || typeof rfb !== 'object') {
        throw new Error('Failed to create RFB instance - result is not an object')
      }
      
      rfbRef.current = rfb

      // Set connection parameters
      rfb.scaleViewport = true
      rfb.resizeSession = true

      // Event handlers
      rfb.addEventListener('connect', () => {
        console.log(`[VMVNC ${namespace}/${vmName}]: Connected`)
        setStatus('Connected')
        setIsLoading(false)
        setError(null)
      })

      rfb.addEventListener('disconnect', (e: any) => {
        const detail = e.detail as { clean?: boolean }
        if (detail.clean) {
          console.log(`[VMVNC ${namespace}/${vmName}]: Disconnected`)
          setStatus('Disconnected')
        } else {
          console.error(`[VMVNC ${namespace}/${vmName}]: Connection closed unexpectedly`)
          setStatus('Connection closed')
          setError('Connection closed unexpectedly')
        }
        setIsLoading(false)
      })

      rfb.addEventListener('credentialsrequired', () => {
        console.log(`[VMVNC ${namespace}/${vmName}]: Credentials required`)
        setStatus('Credentials required')
        // For now, we'll try without password
        // In the future, you might want to prompt for password
      })

      rfb.addEventListener('securityfailure', (e: any) => {
        const detail = e.detail as { status?: number; reason?: string }
        console.error(`[VMVNC ${namespace}/${vmName}]: Security failure`, detail)
        setError(`Security failure: ${detail.reason || 'Unknown error'}`)
        setIsLoading(false)
      })

      rfb.addEventListener('desktopname', (e: any) => {
        const detail = e.detail as { name?: string }
        if (detail.name) {
          console.log(`[VMVNC ${namespace}/${vmName}]: Desktop name: ${detail.name}`)
          setStatus(`Connected to ${detail.name}`)
        }
      })

      // Cleanup function
      return () => {
        console.log(`[VMVNC ${namespace}/${vmName}]: Cleaning up`)
        if (rfbRef.current) {
          try {
            rfbRef.current.disconnect()
          } catch (err) {
            console.error('Error disconnecting RFB:', err)
          }
          rfbRef.current = null
        }
      }
    } catch (err) {
      console.error(`[VMVNC ${namespace}/${vmName}]: Error creating RFB connection:`, err)
      setError(`Failed to create VNC connection: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }, [cluster, namespace, vmName, rfbModule])

  return (
    <>
      <Styled.CustomCard $isVisible={!isLoading && !error} $substractHeight={substractHeight}>
        <Styled.StatusBar>{status}</Styled.StatusBar>
        <Styled.FullWidthDiv $substractHeight={substractHeight}>
          <div ref={screenRef} style={{ width: '100%', height: '100%' }} />
        </Styled.FullWidthDiv>
      </Styled.CustomCard>
      {isLoading && !error && (
        <Styled.LoadingContainer>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>{status}</div>
        </Styled.LoadingContainer>
      )}
      {error && <Result status="error" title="VNC Connection Error" subTitle={error} />}
    </>
  )
}




