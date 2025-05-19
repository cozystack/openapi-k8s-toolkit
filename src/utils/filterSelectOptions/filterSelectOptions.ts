import { DefaultOptionType } from 'antd/es/select'

export const filterSelectOptions = (input: string, option?: DefaultOptionType) =>
  (typeof option?.label === 'string' ? option.label : '').toLowerCase().includes(input.toLowerCase())
