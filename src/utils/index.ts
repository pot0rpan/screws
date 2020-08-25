// Check if provided string includes any query as a substring
export const stringIncludesSubstring = (
  string: string,
  queries: string | RegExp | (string | RegExp)[]
) => {
  // Convert `queries` to array if only a single query
  if (!Array.isArray(queries)) {
    queries = [queries];
  }

  // Search for substring query match
  for (const query of queries) {
    if (
      (typeof query === 'string' && string.includes(query)) ||
      (typeof query === 'object' && query.test(string))
    ) {
      return true;
    }
  }

  return false;
};
