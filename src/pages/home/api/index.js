import { get,post } from "@/request/request";
const prefix = '/bizSlideShowItem'
export const HomeAPI = {
  getPlayImage(type) {
    return get(`${prefix}/getByType/${type}`)
  },
  queryShopInfo(data){
    return post('/bizShopInfo/query', data)
  }
}