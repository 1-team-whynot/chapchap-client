export const resolveFileUrl = (url) => {
  if (!url) return ''

  const normalizedUrl = String(url).trim()
  if (!normalizedUrl) return ''

  if (/^https?:\/\//.test(normalizedUrl)) return normalizedUrl
  if (normalizedUrl.startsWith('/files/')) return normalizedUrl

  const withoutRelativePrefix = normalizedUrl.replace(/^\.?\//, '')
  if (withoutRelativePrefix.startsWith('files/')) {
    return `/${withoutRelativePrefix}`
  }

  if (normalizedUrl.startsWith('/')) return normalizedUrl

  return `/files/${withoutRelativePrefix}`
}
