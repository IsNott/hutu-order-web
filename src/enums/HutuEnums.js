export const OrderStatus = {
	INIT: 0,
	PROCESSING: 1,
	PAYED: 2,
	REFUND: 3,
	EXPIRE: 4,
	FAILED: 5,
	FINISH: 6
}

export const OrderType = {
	NOW: 'now',
	SCHEDULE: 'schedule'
}

export const PickUpType = {
	SELF: '0',
	TAKE_OUT: '1'
}

export const CacheKey = { 
  USER_INFO: 'USER_INFO',
  CURRENT_SHOP: 'CURRENT_SHOP',
  ORDER_TYPE: 'ORDER_TYPE',
  CART_SUBMIT: 'CART_SUBMIT'
}
