import Cookies from 'js-cookie'

const TokenKey = 'lms-create-admin'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: (1 / 24) * 24 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
