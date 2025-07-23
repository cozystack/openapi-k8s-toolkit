/* eslint-disable no-console */
import React, { FC, useEffect, useState, useRef } from 'react'
import { Button, Result, Spin, Progress, Typography } from 'antd'
import { Terminal as XTerm } from '@xterm/xterm'
import themes from 'xterm-theme'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { Spacer } from 'components/atoms'
import { Styled } from './styled'

type TXTerminalProps = {
  endpoint: string
  nodeName: string
  profile: string
}

export const XTerminal: FC<TXTerminalProps> = ({ endpoint, nodeName, profile }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Event>()

  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(false)

  const [warmupMessage, setWarmupMessage] = useState<string>()
  const [containerWaitingMessage, setContainerWaitingMessage] = useState<string>()

  const [progressPercent, setProgressPercent] = useState<number>(0)
  const [isWarmingUp, setIsWarmingUp] = useState<boolean>(true)

  const [terminal, setTerminal] = useState<XTerm>()
  const socketRef = useRef<WebSocket | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const fitAddon = new FitAddon()

  useEffect(() => {
    const terminal = new XTerm({
      cursorBlink: false,
      cursorStyle: 'block',
      fontFamily: 'monospace',
      fontSize: 16,
      theme: themes.MaterialDark,
    })
    terminal.loadAddon(fitAddon)
    // terminal.loadAddon(new WebLinksAddon())
    setTerminal(terminal)
    fitAddon.fit()

    return () => {
      if (terminal) {
        terminal.dispose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (terminal) {
      if (terminalRef.current) {
        terminal.open(terminalRef.current)
        setTerminal(terminal)
      }
    }

    // Initialize ResizeObserver to handle resizing
    resizeObserverRef.current = new ResizeObserver(() => {
      fitAddon.fit()
    })

    // Observe the terminal container for size changes
    if (terminalRef.current) {
      resizeObserverRef.current.observe(terminalRef.current)
    }

    return () => {
      // Clean up the ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal])

  useEffect(() => {
    if (!terminal) {
      return
    }

    const socket = new WebSocket(endpoint)
    socketRef.current = socket

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'init',
          payload: { nodeName, profile },
        }),
      )
      console.log(`[${nodeName}/${profile}]: WebSocket Client Connected`)
      setIsLoading(false)
    }

    socket.onmessage = event => {
      const data = JSON.parse(event.data)
      if (data.type === 'warmup') {
        if (data.payload) {
          if (data.payload === 'Container ready') {
            setWarmupMessage(undefined)
            setContainerWaitingMessage(undefined)
            setIsTerminalVisible(true)
            setIsWarmingUp(false)
          } else if (data.payload === 'Container never ready') {
            setError(data.payload)
            setIsTerminalVisible(false)
            setWarmupMessage(undefined)
            setContainerWaitingMessage(undefined)
          } else {
            setWarmupMessage(data.payload)
            if (data.payload === 'Namespace creating') {
              setProgressPercent(15)
            }
            if (data.payload === 'Namespace created') {
              setProgressPercent(30)
            }
            if (data.payload === 'Pod creating') {
              setProgressPercent(45)
            }
            if (data.payload === 'Pod creating') {
              setProgressPercent(60)
            }
          }
        }
      }
      if (data.type === 'containerWaiting') {
        if (data.payload) {
          if (data.payload.includes('Container is ready')) {
            setContainerWaitingMessage(undefined)
          } else {
            setContainerWaitingMessage(data.payload)
          }
        }
      }
      if (data.type === 'shutdown') {
        setIsTerminalVisible(false)
      }
      if (data.type === 'output') {
        if (data.payload.type === 'Buffer' && Array.isArray(data.payload.data)) {
          // Reconstruct bytes and decode to string
          // const bytes = new Uint8Array(data.payload)
          // const text = decoderRef.current.decode(bytes)

          const text = Buffer.from(data.payload.data)
          terminal.write(text.toString('utf8'))
        } else {
          terminal.write(String(data.payload))
        }
      }
    }

    socket.onclose = () => {
      console.log(`[${nodeName}/${profile}]: WebSocket Client Closed`)
    }

    socket.onerror = error => {
      console.error('WebSocket Error:', error)
      setError(error)
      setIsTerminalVisible(false)
    }

    terminal.onData(data => {
      if (data === '\u001bOP') {
        // const bufferToSend = Buffer.from('\u001b[11~', 'utf8')
        // socket.send(JSON.stringify({ type: 'input', payload: bufferToSend }))
        socket.send(JSON.stringify({ type: 'input', payload: '\u001b[11~' }))
        return
      }
      // const bufferToSend = Buffer.from(data, 'utf8')
      // socket.send(JSON.stringify({ type: 'input', payload: bufferToSend }))
      socket.send(JSON.stringify({ type: 'input', payload: data }))
    })

    // terminal.onResize(size => {
    //   socket.send(JSON.stringify({ type: 'resize', payload: { cols: size.cols, rows: size.rows } }))
    // })

    // eslint-disable-next-line consistent-return
    return () => {
      terminal.dispose()
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [terminal, endpoint, nodeName, profile])

  return (
    <>
      <Styled.ShutdownContainer $isVisible={isTerminalVisible}>
        <Button
          type="dashed"
          disabled={!socketRef.current}
          onClick={() =>
            socketRef.current?.send(
              JSON.stringify({
                type: 'shutdown',
              }),
            )
          }
        >
          Terminate
        </Button>
      </Styled.ShutdownContainer>
      <Spacer $space={8} $samespace />
      <Styled.CustomCard $isVisible={isTerminalVisible}>
        <Styled.FullWidthDiv>
          <div ref={terminalRef} />
        </Styled.FullWidthDiv>
      </Styled.CustomCard>

      {!isTerminalVisible && !error && isWarmingUp && (
        <Styled.ProgressContainer>
          {isLoading && <Spin />}
          {!isLoading && <Progress type="circle" percent={progressPercent} />}
          {warmupMessage && <Typography.Text>Warming Up: {warmupMessage}</Typography.Text>}
          {containerWaitingMessage && <Typography.Text>Container Waiting: {containerWaitingMessage}</Typography.Text>}
        </Styled.ProgressContainer>
      )}
      {error && <Result status="error" title="Error" subTitle={JSON.stringify(error)} />}
    </>
  )
}
