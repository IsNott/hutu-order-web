import { get, post } from '@/request/request.js'

export const ItemDetailAPI = {
  addToPackage(data) {
    return post('/bizPackage/add', data)
  },
}