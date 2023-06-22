import Cookies from 'js-cookie';

export const saveQueryParamsToCookie = (queryParams) => {
  Cookies.set('queryParams', JSON.stringify(queryParams));
};

export const getQueryParamsFromCookie = () => {
  const cookieValue = Cookies.get('queryParams');
  if (cookieValue) {
    return JSON.parse(cookieValue);
  }
  return {};
};
