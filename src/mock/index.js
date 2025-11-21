import Mock from 'better-mock/dist/mock.mp.js'

const baseUrl = 'http://localhost:9999/hutu-api'

export const staticLatAndLongitude = [22.306583887776,114.17854456]
export function mockAPI() {
  Mock.setup({
    timeout: 400
  });
  Mock.Random.extend({
    image: () => {
      let images = [
        '/static/1905083114506674177.png', '/static/1941046464679747586.png',
        '/static/20251117170448.png', '/static/20251117170524.png', '/static/20251118105516.png'
      ]
      return images[Math.floor(Math.random() * images.length)]
    },
    shopName: () => {
      const perfix = ['店', '分店', '二分店', '三分店', '四分店', '五分店', '六分店', '七分店', '八分店', '九分店', '总店']
      const nameSuffix = '糊涂咖啡'
      return nameSuffix + perfix[Math.floor(Math.random() * perfix.length)] + '（' + Mock.Random.city() + Mock.Random.county() + '）'
      
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
  Mock.mock(`${baseUrl}/playimage/type/0`, {
    code: 200,
    message: '成功',
    'data|1-10': [{
      'id|+1': 1,
      url: '@image',
      type: '0',
      navigation: '/pages/roder/index',
      toType: 'bar'
    }]
  });
   Mock.mock(`${baseUrl}/playimage/type/1`, {
    code: 200,
    message: '成功',
    'data|1-10': [{
      'id|+1': 1,
      url: '@image',
      type: '1',
      navigation: '/pages/roder/index',
      toType: 'bar'
    }]
  });
  Mock.mock(`${baseUrl}/playimage/type/2`, {
    code: 200,
    message: '成功',
    'data|1-10': [{
      'id|+1': 1,
      url: '@image',
      type: '2',
      navigation: '/pages/roder/index',
      toType: 'bar'
    }]
  });
  Mock.mock(`${baseUrl}/shop/info`, {
    code: 200,
    message: '成功',
    'data|1-10': [{
      'id|+1': 1,
      shopName: '@shopName',
      address: '@county(true)',
      phone: '@phone',
      logo: '@image',
      banner: '@image',
      description: '@cparagraph(1, 5)',
      latitude: '@lat',
      longitude: '@longitude',
      openTime: '08:00',
      closeTime: '22:00',
      distance: '@float(0, 100, 2, 2)',
    }]
  });
}