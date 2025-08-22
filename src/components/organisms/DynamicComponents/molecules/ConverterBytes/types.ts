export type TCanonicalUnit =
  | 'B'
  | 'kB'
  | 'MB'
  | 'GB'
  | 'TB'
  | 'PB'
  | 'EB'
  | 'KiB'
  | 'MiB'
  | 'GiB'
  | 'TiB'
  | 'PiB'
  | 'EiB'

export type TUnitInput =
  | TCanonicalUnit
  | 'k'
  | 'm'
  | 'g'
  | 't'
  | 'p'
  | 'e'
  | 'K'
  | 'M'
  | 'G'
  | 'T'
  | 'P'
  | 'E'
  | 'KB'
  | 'Mb'
  | 'MB'
  | 'Gb'
  | 'GB'
  | 'Tb'
  | 'TB'
  | 'Pb'
  | 'PB'
  | 'Eb'
  | 'EB'
  | 'Ki'
  | 'Mi'
  | 'Gi'
  | 'Ti'
  | 'Pi'
  | 'Ei'
  | 'KiB'
  | 'MiB'
  | 'GiB'
  | 'TiB'
  | 'PiB'
  | 'EiB'

export type TConvertOptions = {
  /** If true, returns "12.3 GiB" instead of just 12.3 */
  format?: boolean
  /** Max fraction digits when formatting (default 2) */
  precision?: number
  /** Locale for number formatting (default: undefined => user agent) */
  locale?: string
}
