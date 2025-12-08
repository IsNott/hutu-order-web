import {get, post} from '@/request/request'

export const confirmOrderAPI = {
  submitBizOrder(data){
    return post('/api/order/submitBizOrder', data)
  },
  queryOrder(id){
    return get('/api/order/queryOrder/' + id)
  },

}