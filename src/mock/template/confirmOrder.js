export const ConfirmOrderAPIResultTemplate = {
  submitBizOrder: {
    code: 200,
    message: '成功',
    'data': {
      'id': 1,
      'orderId': 1,
    }
  },
  queryOrder: {
    code: 200,
    message: '成功',
    'data': {
      shopOrderNo: 'H01',
      orderId: '123456789',
      payTime: '2021-01-01 12:00:00',
      totalAmount: 100,
      waitTime: 10,
      shopId: 1,
      'orderStatus|1-2': 1,
      shopName: 'Hurry Restaurant',
      shopAddress: '123 Main St, Anytown, USA',
      payType: '微信支付',
      payCode: '5500',
      frontOrderCount: 1,
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
  }
}