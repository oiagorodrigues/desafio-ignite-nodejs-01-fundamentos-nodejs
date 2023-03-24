/**
 * 
 * @param {String} path 
 * @example /tasks/1?title=teste
 * @returns 
 */
export function buildRoutePath(path) {
  const pathRegex = new RegExp(`(?<query>\\?(.*))?$`)

  return pathRegex
}
