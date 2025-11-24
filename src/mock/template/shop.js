export const ShopAPIResultTemplate = {
  getShopList:  {
    code: 200,
    message: '成功',
    'data|1-10': [{
      'id|+1': 1,
      shopName: '@shopName',
      address: '香港特别行政区 油尖旺区',
      phone: '@phone',
      logo: '@image',
      banner: '@image',
      description: '@cparagraph(1, 5)',
      latitude: '@lat',
      longitude: '@longitude',
      openTime: '08:00',
      closeTime: '22:00',
    }]
  }
}