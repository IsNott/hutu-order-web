import { get,post } from "@/request/request";

export const myAPI = {
  getPlayImage(type) {
    return get(`/playimage/type/${type}`)
  },
  queryFeatureBtns(){
    return get('/featureBtn/query')
  }
}