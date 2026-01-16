import { get,post } from "@/request/request";
const prefix = '/bizSlideShowItem'
export const myAPI = {
  getPlayImage(type) {
    return get(`${prefix}/getByType/${type}`)
  },
  queryFeatureBtns(){
    return get('/featureBtn/query')
  }
}