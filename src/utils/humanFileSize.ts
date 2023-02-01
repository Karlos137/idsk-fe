export const humanFileSize = (size: any) => {
  if (size === '0' || size === 0) {
    return '-'
  }
  if (!size) {
    return '-'
  }
  var i = Math.floor(Math.log(size) / Math.log(1024))
  const num = (size / Math.pow(1024, i)).toFixed(2)
  return num + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}
