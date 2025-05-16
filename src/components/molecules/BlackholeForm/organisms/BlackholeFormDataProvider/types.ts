export type TFormOverride = {
  spec: {
    overrideType: string
    strategy: string
    schema: {
      properties: Record<string, unknown>
      required?: string[]
    }
    hidden?: string[][]
    expanded?: string[][]
    persisted?: string[][]
  }
}
