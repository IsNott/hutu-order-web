import { get,post } from "@/request/request";

export const HomeAPI = {
  getPlayImage(type) {
    return get(`/playimage/type/${type}`)
  },
}