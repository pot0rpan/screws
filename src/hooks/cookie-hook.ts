export const setCookie = (
  name: string,
  value: string,
  path = '/',
  expiration?: Date
) => {
  let cookieStr = `${name}=${value}; path=${path};`;
  if (expiration) cookieStr += ` expires=${expiration.toUTCString()}`;
  document.cookie = cookieStr;
};

export const getCookie: (name: string) => string | undefined = (
  name: string
) => {
  const cookies = document.cookie.split(';');

  for (let keyVal of cookies) {
    const [key, value] = keyVal.split('=');
    if (key === name) return value;
  }

  return undefined;
};

export const removeCookie = (name: string, path = '/') => {
  document.cookie = `${name}=; path=${path}; expires=${new Date(
    0
  ).toUTCString()}`;
};
export const useCookies = () => {
  return { setCookie, getCookie, removeCookie };
};
