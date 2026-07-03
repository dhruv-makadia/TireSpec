import Cookies from 'js-cookie';

const TOKEN_KEY = 'tirespec_session';

export const setSessionToken = (jwt, expireDate) => {
  const expires = new Date(expireDate);
  Cookies.set(TOKEN_KEY, jwt, {
    expires,
    sameSite: 'Strict',
    secure: window.location.protocol === 'https:',
  });
};

export const getSessionToken = () => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const clearSession = () => {
  Cookies.remove(TOKEN_KEY);
};
