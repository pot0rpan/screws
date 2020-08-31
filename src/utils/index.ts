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

export const promiseTimeout = <T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> => {
  return new Promise<T>(async (resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Promise timed out'));
    }, timeout);
    promise.then(resolve, reject);
  });
};
