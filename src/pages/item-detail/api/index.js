import { get, post } from '@/request/request.js'

export const ItemDetailAPI = {
  addToPackage(data) {
    return post('/bizPackage/add', data)
  },
  details(id){
    return get('/bizProduct/details/' + id)
  }
}