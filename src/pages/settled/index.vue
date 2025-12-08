<template>
  <view class="body">
    <view class="header box">
      <view class="order-box">
        <view class="order-no-text">
          取餐号
        </view>
        <view class="order-no">
          {{ order.shopOrderNo }}
        </view>
        <view class="order-status" v-if="order.orderStatus == 2">
          前面还有 {{ order.frontOrderCount }} 单，预计需等待 {{ leftTime }} 分钟
        </view>
        <view class="order-status" v-if="order.orderStatus == 4">
          订单已完成
        </view>
      </view>
      <uni-steps class="order-steps" :options="events" :active="2" active-color="#8B7355" />
    </view>
    <view class="content box">
      <view class="order-info-title">
        订单信息
      </view>
      <view class="order-detail">
        <view class="order-detail-item">流水号: {{ order.orderId }}</view>
        <view class="order-detail-item">实付: ¥{{ order.totalAmount }}</view>
        <view class="order-detail-item">支付时间: {{ order.payTime }}</view>
        <view class="order-detail-item">门店: {{ order.shopName }}</view>
        <view class="order-detail-item">门店地址: {{ order.shopAddress }}</view>
      </view>
      <view class="btn-group">
        <button class="btn continue-btn" @click="commonNavigate('/pages/order/index')">
          继续下单
        </button>
        <button class="btn home-btn" @click="commonNavigate('/pages/home/index')">
          返回首页
        </button>
      </view>
    </view>

    <view class="footer box">
      <view class="item-info-title">
        商品列表
      </view>
      <cart-item-card :item-info="order.itemInfo" />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { commonNavigate } from '@/utils/CommonUtils'
import CartItemCard from '@/component/CartItemCard.vue'
import { onLoad } from '@dcloudio/uni-app'
import { confirmOrderAPI } from '@/pages/confirm-order/api/index'
// Data
const events = [{
  title: '挑选商品'
}, {
  title: '支付订单'
}, {
  title: '等待取餐'
}]
const order = ref('')
const orderId = ref('')
// Computed
const leftTime = computed(() => {
  return order.waitTime
})
// Fake data
const forder = {
  shopOrderNo: 'H01',
  orderId: '123456789',
  payTime: '2021-01-01 12:00:00',
  totalAmount: 100,
  waitTime: 10,
  shopId: 1,
  orderStatus: 4,
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
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  queryOrder()
})
onLoad((opt)=> {
  orderId.value = opt.orderId
})
// Watchers

// Methods
const queryOrder = () => {
  confirmOrderAPI.queryOrder(orderId.value).then(res => {
    order.value = res.data
  })
}
</script>

<style scoped lang="scss">
.body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #F8F4F0 0%, #FFFFFF 100%);
  padding: 20rpx;
  box-sizing: border-box;
}

.box {
  width: 100%;
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.header {
  padding: 40rpx 30rpx;
  text-align: center;
  margin-top: 20rpx;
  .order-box {
    margin-bottom: 30rpx;

    .order-no-text {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 10rpx;
    }

    .order-no {
      font-size: 80rpx;
      font-weight: bold;
      color: #8B7355;
      margin-bottom: 20rpx;
      font-family: Arial, sans-serif;
    }

    .order-status {
      font-size: 26rpx;
      color: #666;
      background: #f8f4f0;
      padding: 12rpx 20rpx;
      border-radius: 20rpx;
      display: inline-block;
      border: 1rpx solid #e8d5c4;
    }
  }

  .order-steps {
    margin-top: 20rpx;
  }
}

.content {
  padding: 40rpx 30rpx;

  .order-info-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .order-detail {
    margin-bottom: 40rpx;

    .order-detail-item {
      font-size: 28rpx;
      color: #666;
      padding: 16rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      display: flex;
      justify-content: space-between;

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(2) {
        font-weight: bold;
        color: #8B7355;
      }
    }
  }

  .btn-group {
    display: flex;
    gap: 20rpx;

    .btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;

      &.continue-btn {
        background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
        color: white;
        box-shadow: 0 8rpx 24rpx rgba(139, 115, 85, 0.2);

        &:active {
          opacity: 0.9;
          transform: scale(0.98);
        }
      }

      &.home-btn {
        background: #f8f4f0;
        color: #8B7355;
        border: 2rpx solid #e8d5c4;

        &:active {
          background: #e8d5c4;
          transform: scale(0.98);
        }
      }
    }
  }
}

.footer {
  padding: 40rpx 30rpx;
  margin-bottom: 40rpx;

  .item-info-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

// 重写uni-steps组件样式
:deep(.uni-steps) {
  .uni-steps__items {
    justify-content: center !important;
  }

  .uni-steps__item {
    flex: 0 0 auto !important;
    margin: 0 40rpx !important;

    &.uni-steps__item--active {
      .uni-steps__item-title {
        color: #8B7355 !important;
      }

      .uni-steps__item-circle {
        background: #8B7355 !important;
      }
    }
  }

  .uni-steps__item-title {
    color: #999 !important;
    font-size: 26rpx !important;
  }

  .uni-steps__item-circle {
    width: 16rpx !important;
    height: 16rpx !important;
  }

  .uni-steps__item-line {
    background: #e0e0e0 !important;
  }
}
</style>