export const getUppercase = (s: string): string => {
  const uppercases = [...s] // spread string into array of chars
    .filter(c => c >= 'A' && c <= 'Z') // keep only A–Z
    .join('') // join back into string

  return uppercases.length > 0 ? uppercases : s[0].toUpperCase()
}
