export const getPrefixSubarrays = (arr: (string | number)[]): (string | number)[][] => {
  return arr.map((_, index) => arr.slice(0, index + 1))
}
