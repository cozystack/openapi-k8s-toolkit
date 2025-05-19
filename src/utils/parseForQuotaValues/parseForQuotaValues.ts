export function floorToDecimal(num: number, decimalPlaces: number): number {
  const factor = 10 ** decimalPlaces

  return Math.floor(num * factor) / factor
}

export const parseQuotaValue = (key: string, val: string): number => {
  let numericValue = parseFloat(val.replace(/[a-zA-Zа-яА-Я]/g, ''))

  if (key === 'cpu') {
    if (val.endsWith('m')) {
      numericValue /= 1_000
    }

    return floorToDecimal(numericValue, 1)
  }

  if (val.endsWith('m')) {
    numericValue /= 1_000
  } else if (val.endsWith('k')) {
    numericValue /= 1_000_000
  } else if (val.endsWith('M')) {
    numericValue /= 1_000
  } else if (val.endsWith('G')) {
    numericValue /= 1
  } else if (val.endsWith('T')) {
    numericValue *= 1_000
  } else if (val.endsWith('Ki')) {
    numericValue /= 1_024
    numericValue /= 1_000_000
  } else if (val.endsWith('Mi')) {
    numericValue /= 1_000
    numericValue /= 1_000
  } else if (/^\d+(\.\d+)?$/.test(val)) {
    numericValue /= 1_000_000_000
  } else {
    throw new Error('Invalid value')
  }

  return floorToDecimal(numericValue, 1)
}

export const parseQuotaValueCpu = (val?: string | number | null): number => {
  if (typeof val === 'string') {
    let numericValue = parseFloat(val.replace(/[a-zA-Zа-яА-Я]/g, ''))

    if (val.endsWith('m')) {
      numericValue /= 1_000
    }

    return floorToDecimal(numericValue, 1)
  }

  return 0
}

export const parseQuotaValueMemoryAndStorage = (val?: string | number | null): number => {
  if (typeof val === 'string') {
    let numericValue = parseFloat(val.replace(/[a-zA-Zа-яА-Я]/g, ''))

    if (val.endsWith('m')) {
      numericValue /= 1_000
    } else if (val.endsWith('k')) {
      numericValue /= 1_000_000
    } else if (val.endsWith('M')) {
      numericValue /= 1_000
    } else if (val.endsWith('G')) {
      numericValue /= 1
    } else if (val.endsWith('T')) {
      numericValue *= 1_000
    } else if (val.endsWith('Ki')) {
      numericValue /= 1_024
      numericValue /= 1_000_000
    } else if (val.endsWith('Mi')) {
      numericValue /= 1_000
      numericValue /= 1_000
    } else if (/^\d+(\.\d+)?$/.test(val)) {
      numericValue /= 1_000_000_000
    } else {
      throw new Error('Invalid value')
    }

    return floorToDecimal(numericValue, 1)
  }
  return 0
}
