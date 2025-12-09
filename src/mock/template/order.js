export const OrderAPIResultTemplate = {
  getCatalog: {
    code: 200,
    message: '成功',
    'data': [
      {
        id: 6,
        name: '猜你喜欢',
        logo: '/static/logo.png',
        showSide: false
      },
      {
        id: 7,
        name: '新品上架',
        logo: '/static/logo.png',
        showSide: false
      },
      {
        id: 1,
        name: '咖啡',
        logo: '/static/logo.png',
        showSide: true
      },
      {
        id: 2,
        name: '茶',
        logo: '/static/logo.png',
        showSide: true
      },
      {
        id: 3,
        name: '面包',
        logo: '/static/logo.png',
        showSide: true
      },
      {
        id: 4,
        name: '爆款咖啡',
        logo: '/static/logo.png',
        showSide: true
      },
      {
        id: 5,
        name: '精致拿铁',
        logo: '/static/logo.png',
        showSide: true
      },
    ]
  },
  getMenu: {
    code: 200,
    message: '成功',
    'data': [
      {
        id: 1,
        name: '美式咖啡',
        price: 10,
        description: '香醇美式，提神醒脑',
        cover: '/static/logo.png',
        catalogId: 1
      },
      {
        id: 2,
        name: '乌龙茶',
        price: 12,
        description: '清香乌龙，回味甘甜',
        cover: '/static/logo.png',
        catalogId: 2
      },
      {
        id: 3,
        name: '烤面包',
        price: 8,
        description: '香脆可口，早餐首选',
        cover: '/static/logo.png',
        catalogId: 3
      },
      {
        id: 4,
        name: '卡布奇诺',
        price: 15,
        description: '绵密奶泡，香浓咖啡',
        cover: '/static/logo.png',
        catalogId: 4
      },
      {
        id: 5,
        name: '拿铁咖啡',
        price: 16,
        description: '丝滑拿铁，香醇浓郁',
        cover: '/static/logo.png',
        catalogId: 5
      },
      {
        id: 6,
        name: '浓缩咖啡',
        price: 12,
        description: '浓郁香醇，咖啡经典',
        cover: '/static/logo.png',
        catalogId: 1
      },
      {
        id: 7,
        name: '绿茶',
        price: 10,
        description: '清新绿茶，健康养生',
        cover: '/static/logo.png',
        catalogId: 2
      },
      {
        id: 8,
        name: '牛角包',
        price: 9,
        description: '酥脆牛角，奶香浓郁',
        cover: '/static/logo.png',
        catalogId: 3
      },
      {
        id: 9,
        name: '提拉米苏',
        price: 18,
        description: '软糯提拉米苏，香甜滑滑',
        cover: '/static/logo.png',
        catalogId: 6
      },
      {
        id: 10,
        name: '冰淇淋',
        price: 14,
        description: '冰爽冰激凌，鲜香滑滑',
        cover: '/static/logo.png',
        catalogId: 7
      },
    ]

  },
  queryMySeachHistory: {
    code: 200,
    message: '成功',
    'data': [
      '茶', '咖啡', '面包', '牛角包', '提拉米苏', '冰淇淋'
    ]
  },
  queryRecommendMenu: {
    code: 200,
    message: '成功',
    'data': [
      '浮夸', '屋村几座', '九龙新界', '旺角卡门', '观塘一号'
    ]
  },
  queryMyOrder: {
    code: 200,
    message: '成功',
    data: [
      {
        shopOrderNo: 'H01',
        orderId: '123456789',
        payTime: '2021-01-01 12:00:00',
        totalAmount: 100,
        waitTime: 10,
        shopId: 1,
        orderStatus: 1,
        shopName: 'Hurry Restaurant',
        shopAddress: '123 Main St, Anytown, USA',
        payType: '微信支付',
        payCode: '5500',
        frontOrderCount: 1,
        pickupType: 0,
        itemInfo: [
          {
            id: 1,
            name: 'Hutu Coffee',
            cover: '',
            price: 11,
            count: 1,
            skus: [
              {
                label: '微糖',
                value: '4',
                parentId: '1'
              },
              {
                label: '去冰',
                parentId: '2'
              },
              {
                label: '超大杯',
                value: '3',
                parentId: '3'
              },
              {
                label: '一份糖浆',
                value: '3',
                parentId: '4',
                addonalPrice: 1
              }
            ]
          },
          {
            id: 77,
            name: 'Hutu Coffee',
            cover: '',
            price: 11,
            count: 1,
            skus: [
              {
                label: '微糖',
                value: '4',
                parentId: '1'
              },
              {
                label: '去冰',
                parentId: '2'
              },
              {
                label: '超大杯',
                value: '3',
                parentId: '3'
              },
              {
                label: '一份糖浆',
                value: '3',
                parentId: '4',
                addonalPrice: 1
              }
            ]
          },
          {
            id: 66,
            name: 'Hutu Coffee',
            cover: '',
            price: 11,
            count: 1,
            skus: [
              {
                label: '微糖',
                value: '4',
                parentId: '1'
              },
              {
                label: '去冰',
                parentId: '2'
              },
              {
                label: '超大杯',
                value: '3',
                parentId: '3'
              },
              {
                label: '一份糖浆',
                value: '3',
                parentId: '4',
                addonalPrice: 1
              }
            ]
          },
          {
            id: 2,
            name: 'Hutu Coffee',
            cover: '',
            price: 11,
            count: 1,
            skus: [
              {
                label: '微糖',
                value: '4',
                parentId: '1'
              },
              {
                label: '去冰',
                parentId: '2'
              },
              {
                label: '超大杯',
                value: '3',
                parentId: '3'
              },
              {
                label: '一份糖浆',
                value: '3',
                parentId: '4',
                addonalPrice: 1
              }
            ]
          },
          {
            id: 3,
            name: 'Hutu Coffee',
            cover: '',
            price: 11,
            count: 1,
            skus: [
              {
                label: '微糖',
                value: '4',
                parentId: '1'
              },
              {
                label: '去冰',
                parentId: '2'
              },
              {
                label: '超大杯',
                value: '3',
                parentId: '3'
              },
              {
                label: '一份糖浆',
                value: '3',
                parentId: '4',
                addonalPrice: 1
              }
            ]
          }
        ]
      }
    ]
  }
}