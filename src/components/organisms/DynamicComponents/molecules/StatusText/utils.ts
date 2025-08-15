export const getResult = ({
  valuesPrepared,
  criteriaSuccess,
  criteriaError,
  valueToCompareSuccess,
  valueToCompareError,
  successText,
  errorText,
  fallbackText,
}: {
  valuesPrepared: string[]
  criteriaSuccess: 'equals' | 'notEquals'
  criteriaError: 'equals' | 'notEquals'
  valueToCompareSuccess: unknown[]
  valueToCompareError: unknown[]
  successText: string
  errorText: string
  fallbackText: string
}): { type: 'success' | 'danger' | 'warning'; text: string } => {
  const success =
    criteriaSuccess === 'equals'
      ? valuesPrepared.some(v => valueToCompareSuccess.includes(v))
      : valuesPrepared.some(v => !valueToCompareSuccess.includes(v))

  if (success) {
    return { type: 'success', text: successText }
  }

  const error =
    criteriaError === 'equals'
      ? valuesPrepared.some(v => valueToCompareError.includes(v))
      : valuesPrepared.some(v => !valueToCompareError.includes(v))

  if (error) {
    return { type: 'danger', text: errorText }
  }

  return { type: 'warning', text: fallbackText }
}
