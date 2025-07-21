// types/xterm-theme.d.ts
declare module 'xterm-theme' {
  export interface Theme {
    foreground: string
    background: string
    cursor: string
    black: string
    brightBlack: string
    red: string
    brightRed: string
    green: string
    brightGreen: string
    yellow: string
    brightYellow: string
    blue: string
    brightBlue: string
    magenta: string
    brightMagenta: string
    cyan: string
    brightCyan: string
    white: string
    brightWhite: string
    /** any other custom properties */
    [key: string]: string
  }
  const themes: Record<string, Theme>
  export default themes
}
