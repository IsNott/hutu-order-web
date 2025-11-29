import Mock from 'better-mock/dist/mock.mp.js'
import { OrderAPIResultTemplate } from './template/order.js'
import { HomeAPIResultTemplate } from './template/home.js'
import { ShopAPIResultTemplate } from './template/shop.js'
import { ItemDetailAPIResultTemplate } from './template/itemDetail.js'
import { commonResp } from './template/'
const baseUrl = 'http://localhost:9999/hutu-api'

export const staticLatAndLongitude = [22.306583887776,114.17854456]
export function mockAPI() {
  Mock.setup({
    timeout: 400
  });
  Mock.Random.extend({
    image: () => {
      let images = [
        '/static/act.png', '/static/act1.png',
        '/static/act2.png', '/static/act3.png', '/static/act4.png'
      ]
      return images[Math.floor(Math.random() * images.length)]
    },
    shopName: () => {
      const perfix = ['店', '分店', '二分店', '三分店', '四分店', '五分店', '六分店', '七分店', '八分店', '九分店', '总店']
      const nameSuffix = '糊涂咖啡'
      const region = ['九龙', '新界', '观塘', '屯门', '荃湾', '葵青', '西贡', '沙田', '大埔', '北区', '南区', '油尖旺', '深水埗', '九龙坡', '黄大仙', '西贡', '沙田', '大埔', '北区', '南区', '油尖旺', '深水埗', '九龙坡', '黄大仙', '西贡', '沙田', '大埔', '北区', '南区']
      return nameSuffix + perfix[Math.floor(Math.random() * perfix.length)] + '（' + region[Math.floor(Math.random() * region.length)]  + '店）'
    },
    latAndLongitude() {
      const latitude = staticLatAndLongitude[0]
      const longitude = staticLatAndLongitude[1]
      const offset = 0.1 * Math.random(0, 1)
      return [latitude + offset, longitude + offset]
    },
    lat(){
      return Mock.Random.latAndLongitude()[0]
    },
    longitude(){
      return Mock.Random.latAndLongitude()[1]
    }

  })
  Mock.mock(`${baseUrl}/playimage/type/0`, HomeAPIResultTemplate.playimage0);
  Mock.mock(`${baseUrl}/playimage/type/1`, HomeAPIResultTemplate.playimage1);
  Mock.mock(`${baseUrl}/playimage/type/2`, HomeAPIResultTemplate.playimage2);
  Mock.mock(`${baseUrl}/shop/info`, ShopAPIResultTemplate.getShopList);
  Mock.mock(new RegExp(`${baseUrl}/bizMenuCatalog/listByShop/\\d+`), OrderAPIResultTemplate.getCatalog);
  Mock.mock(new RegExp(`${baseUrl}/bizMenu/listByShopCatalogId/\\d+`), OrderAPIResultTemplate.getMenu);
  Mock.mock(`${baseUrl}/bizPackage/add`, commonResp);
  Mock.mock(`${baseUrl}/bizPackage/queryMyPackage`, ItemDetailAPIResultTemplate.myPackage);
}