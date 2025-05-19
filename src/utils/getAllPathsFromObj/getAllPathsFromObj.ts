// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type TAnyObject = Record<string, any>

// export const getAllPathsFromObj = (obj: TAnyObject, prefix: string[] = []): string[][] =>
//   Object.entries(obj).flatMap(([key, value]) => {
//     const currentPath = [...prefix, key]
//     return typeof value === 'object' && value !== null
//       ? [currentPath, ...getAllPathsFromObj(value, currentPath)]
//       : [currentPath]
//   })

/* for strings only */

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type TAnyValue = Record<string, any> | any[]

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const getAllPathsFromObj = (obj: TAnyValue, prefix: string[] = []): string[][] => {
//   const entries = Array.isArray(obj) ? obj.map((value, index) => [index, value]) : Object.entries(obj)

//   return entries.flatMap(([key, value]) => {
//     const currentPath = [...prefix, key]
//     return typeof value === 'object' && value !== null
//       ? [currentPath, ...getAllPathsFromObj(value, currentPath)]
//       : [currentPath]
//   })
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TAnyValue = Record<string, any> | any[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllPathsFromObj = (obj: TAnyValue, prefix: (string | number)[] = []): (string | number)[][] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = Array.isArray(obj) ? obj.map((value, index) => [index, value] as [number, any]) : Object.entries(obj)

  return entries.flatMap(([key, value]) => {
    const currentPath = [...prefix, key]
    return typeof value === 'object' && value !== null
      ? [currentPath, ...getAllPathsFromObj(value, currentPath)]
      : [currentPath]
  })
}
