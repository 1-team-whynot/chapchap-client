import defaultEtcFoodImageUrl from '../assets/images/default-etc-food.png'
import defaultStoreImageUrl from '../assets/images/default-truck.png'
import { resolveFileUrl } from './resolveFileUrl.js'

export const DEFAULT_STORE_IMAGE_URL = defaultStoreImageUrl
export const DEFAULT_MENU_IMAGE_URL = defaultEtcFoodImageUrl

export const getStoreImageUrl = (url) => (
  resolveFileUrl(url) || DEFAULT_STORE_IMAGE_URL
)

export const getMenuImageUrl = (url) => (
  resolveFileUrl(url) || DEFAULT_MENU_IMAGE_URL
)

export const applyImageFallback = (event, fallbackUrl) => {
  const image = event?.target
  if (!image || image.src === fallbackUrl) return

  image.onerror = null
  image.src = fallbackUrl
}
