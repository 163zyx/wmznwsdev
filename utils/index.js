export function getApiUrl(path, urlPrefix = 'api') {
  if (process.env['NODE_ENV'] === 'development') {
    return `/${urlPrefix}${path}`;
  } else {
    if (urlPrefix === 'api') {
      return `https://officechat.emic.edu.cn${path}`;
    }
  }
}


export function debounce(func, wait) {
  let timeout;

  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
