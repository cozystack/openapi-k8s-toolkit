export const getResult = ({
  valuePrepared,
  criteriaSuccess,
  criteriaError,
  valueToCompareSuccess,
  valueToCompareError,
  successText,
  errorText,
  fallbackText,
}: {
  valuePrepared: string
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
      ? valueToCompareSuccess.includes(valuePrepared)
      : !valueToCompareSuccess.includes(valuePrepared)

  if (success) {
    return { type: 'success', text: successText }
  }

  const error =
    criteriaError === 'equals'
      ? valueToCompareError.includes(valuePrepared)
      : !valueToCompareError.includes(valuePrepared)

  if (error) {
    return { type: 'danger', text: errorText }
  }

  return { type: 'warning', text: fallbackText }
}
