import {post, get} from '@/request/request'

export const AuthAPI = {
   loginByPhone(data) {
    return post('/auth/loginByPhone', data)
  }
}