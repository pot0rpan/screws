// Check if provided string includes any query as a substring
export const stringIncludesSubstring = (
  string: string,
  queries: string | RegExp | (string | RegExp)[]
) => {
  const regExps: RegExp[] = [];

  // Turn all queries into RegExp
  if (!Array.isArray(queries)) {
    regExps.push(new RegExp(queries));
  } else {
    for (let q of queries) {
      regExps.push(new RegExp(q));
    }
  }

  for (const regExp of regExps) {
    if (regExp.test(string)) return true;
  }

  return false;
};
