import { setCookie, getCookie, removeCookie } from '../cookies';

const originalDocument = { ...window.document };

beforeEach(() => {
  delete window.document;
  window.document = { cookie: '' };
});

afterEach(() => {
  window.document = originalDocument;
});

describe('setCookie util function', () => {
  it('sets cookie with supplied data', () => {
    setCookie('name1', 'value1');
    expect(document.cookie).toBe('name1=value1; path=/;');
    document.cookie = '';

    setCookie('name2', 'value2', '/path2');
    expect(document.cookie).toBe('name2=value2; path=/path2;');
    document.cookie = '';

    const expiration = new Date(Date.now() + 1000 * 60 * 60);
    setCookie('name3', 'value3', '/path3', expiration);
    expect(document.cookie).toBe(
      `name3=value3; path=/path3; expires=${expiration.toUTCString()}`
    );
  });
});

describe('getCookie util function', () => {
  it('returns undefined if no cookie found', () => {
    expect(getCookie('name')).toBeUndefined();
  });

  it('gets cookie value if it exists', () => {
    document.cookie = 'name=value';
    expect(getCookie('name')).toBe('value');
  });
});

describe('removeCookie util function', () => {
  it('sets cookie expiration to beginning of time', () => {
    removeCookie('name');
    expect(document.cookie).toBe(
      `name=; path=/; expires=${new Date(0).toUTCString()}`
    );

    removeCookie('name', '/path');
    expect(document.cookie).toBe(
      `name=; path=/path; expires=${new Date(0).toUTCString()}`
    );
  });
});
