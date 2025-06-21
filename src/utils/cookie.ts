export function readCookie(cookieName: string): string | undefined {
  const cookieMatches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return cookieMatches ? decodeURIComponent(cookieMatches[1]) : undefined;
}

export function writeCookie(
  cookieName: string,
  cookieValue: string,
  options: { [key: string]: string | number | Date | boolean } = {}
) {
  options = {
    path: '/',
    ...options
  };

  let expirationTime = options.expires;
  if (expirationTime && typeof expirationTime === 'number') {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + expirationTime * 1000);
    expirationTime = options.expires = currentDate;
  }

  if (expirationTime && expirationTime instanceof Date) {
    options.expires = expirationTime.toUTCString();
  }
  cookieValue = encodeURIComponent(cookieValue);
  let cookieString = cookieName + '=' + cookieValue;
  for (const optionName in options) {
    cookieString += '; ' + optionName;
    const optionValue = options[optionName];
    if (optionValue !== true) {
      cookieString += '=' + optionValue;
    }
  }
  document.cookie = cookieString;
}

export function removeCookie(cookieName: string) {
  writeCookie(cookieName, '', { expires: -1 });
}
