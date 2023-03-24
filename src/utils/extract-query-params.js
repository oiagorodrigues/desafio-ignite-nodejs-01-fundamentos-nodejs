/**
 * 
 * @param {String} query 
 * @example ?search=titulo
 * @returns { queryKey: queryValue }
 */
export function extractQueryParams(query) {
  return query.substring(1).split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=')

    queryParams[key] = value

    return queryParams
  }, {})
}
