// Check if provided string includes any query as a substring
export const stringIncludesSubstring = (
  string: string,
  queries: string | string[]
) => {
  if (typeof queries === 'string') queries = [queries];

  for (const query of queries) {
    if (string.includes(query)) return true;
  }

  return false;
};
