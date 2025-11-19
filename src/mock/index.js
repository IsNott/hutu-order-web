import Mock from 'better-mock/dist/mock.mp.js'

const baseUrl = 'http://localhost:9999/hutu-api'
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
}