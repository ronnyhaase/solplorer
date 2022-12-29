export default function cloudImageLoader({ src, width, quality }) {
  let url = `https://ckaumumkea.cloudimg.io/${src}`
  url += width ? `${url.includes('?') ? '&' : '?'}w=${width}` : ''
  url += `${url.includes('?') ? '&' : '?'}q=${quality || 80}`
  return url
}
