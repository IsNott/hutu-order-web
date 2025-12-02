export const AuthAPIResultTemplate = {
  userInfo:  {
    code: 200,
    message: '成功',
    'data': {
      'id': 1,
      userName: '@cnName',
      avatar: '@image',
      'gander|0-1': 0,
      vipInfo: {
        'level|0-5': 0,
        'point': '@integer(0, 100)',
        'nextLevelPoint': '@integer(0, 100)'
      }
    }
  }
}