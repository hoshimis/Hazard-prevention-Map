/**
 * @see https://blog.codecamp.jp/localstorage-web-data
 */
const set = () => {
  localStorage.setItem('test', 'aaa')
}
const get = () => {
  const getItem = localStorage.getItem('test')
  alert(getItem)
}
