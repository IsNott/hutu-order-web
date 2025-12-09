import { get, post } from "@/request/request";

export const myOrderAPI = {
  queryMyOrder(data){
    return get('/api/order/queryMyOrder', data)
  }
}
