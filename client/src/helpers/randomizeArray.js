/**
 * Randomise all elements in an array
 * @param {string[]} array
 */
export default function randomizeArray(array) {
  const result = [];
  while (array.length > 0) {
    const next = Math.floor(Math.random() * array.length);
    result.push(array[next]);

    // Remove the one we just added to the result list
    array.splice(next, 1);
  }
  return result;
}
