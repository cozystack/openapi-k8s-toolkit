import { TVersionEntry } from 'localTypes/bff/search'

export type TKindWithVersion = {
  group: string
  kind: string
  version: TVersionEntry
  notUnique?: true
}
