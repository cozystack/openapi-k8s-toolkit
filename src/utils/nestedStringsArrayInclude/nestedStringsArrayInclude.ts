/* eslint-disable no-restricted-syntax */

// Helper function to check if two arrays are equal
const arraysEqual = (arr1: string[], arr2: (string | number)[]): boolean => {
  // If lengths differ, they cannot be equal
  if (arr1.length !== arr2.length) {
    return false
  }

  // Compare each element in the arrays
  for (let i = 0; i < arr1.length; i++) {
    if (typeof arr2[i] === 'number') {
      if (arr1[i] !== String(arr2[i])) {
        return false
      }
    }
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

export const includesArray = (matrix: string[][] | undefined, target: (string | number)[]): boolean => {
  if (!matrix) {
    return false
  }
  // Iterate through each row in the 2D array (matrix)
  for (const row of matrix) {
    // Check if the current row is strictly equal to the target array
    if (arraysEqual(row, target)) {
      return true // Return true if a match is found
    }
  }
  return false // Return false if no match is found
}
