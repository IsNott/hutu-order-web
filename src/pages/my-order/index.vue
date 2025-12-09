<template>
  <view class="page">
    <view class="header box">
      <view class="search-box">
        <view class="search-input">
          <input type="text" placeholder="请输入订单号/商品名称" v-model="searchParams.keyword" class="search-input-field"
            @confirm="queryOrder" />
          <view class="search-icon" @click="queryOrder">
            <uni-icons type="search" size="20" color="white"></uni-icons>
          </view>
        </view>
      </view>

      <view class="status-bar">
        <view class="status-bar-item" v-for="(opt, index) in options" :key="index" @click="changeStatus(index)"
          :class="{ 'active': currentIndex === index }">
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="order-list">
      <view v-for="(order, index) in orders" :key="index" class="order-card">
        <view class="order-header">
          <view class="order-title">
            {{ order.shopName }}
            <uni-icons type="right" color="#999" size="13" />
          </view>
          <view class="order-status-tag">
            {{ getOrderStatus(order.orderStatus) }}
          </view>
        </view>

        <view class="order-items-preview">
          <view class="item-preview" v-for="(item, itemIndex) in order.itemInfo.slice(0, 3)" :key="itemIndex">
            <image :src="item.cover" mode="aspectFill" class="item-image" />
          </view>
          <view class="more-items" v-if="order.itemInfo.length > 3">
            +{{ order.itemInfo.length - 3 }}
          </view>
        </view>

        <view class="order-info">
          <view class="order-info-item" v-if="order.status === 2">
            <text class="label">取餐号:</text>
            <text class="value">{{ order.shopOrderNo }}</text>
          </view>
          <view class="order-info-item">
            <text class="label">订单编号:</text>
            <text class="value">{{ order.orderId }}</text>
          </view>
          <view class="order-info-item" v-if="false">
            <text class="label">商品数量:</text>
            <text class="value">{{ order.itemInfo.length }}件</text>
          </view>
          <view class="order-info-item">
            <text class="label">实付金额:</text>
            <text class="value price">¥ {{ order.totalAmount }}</text>
          </view>
        </view>
        <view class="order-actions" v-if="false">
          <view class="detail-btn" @click="viewOrderDetail(order)">
            查看详情
          </view>
          <view class="action-btn" v-if="order.orderStatus === 0" @click="payOrder(order)">
            去支付
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="!orders || orders.length === 0">
        <!-- <image class="empty-icon" src="/static/image/order-empty.png" mode="aspectFit"></image> -->
        <view class="empty-text">暂无订单</view>
        <view class="empty-desc">去挑选喜欢的商品吧~</view>
        <view class="go-shopping-btn" @click="commonNavigate('/pages/order/index')">
          去逛逛
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { commonNavigate, getOrderStatus, getPickType } from '@/utils/CommonUtils'
import { myOrderAPI } from './api/index'
// Data
const options = [{
  label: '全部',
  val: undefined,
},
{
  label: '待付款',
  val: 0,
},
{
  label: '制作中',
  val: 2,
},
{
  label: '已退款',
  val: 5,
},
{
  label: '已完成',
  val: 6,
},
]
const currentIndex = ref(0)
const orders = ref([])
const searchParams = ref({
  status: options[currentIndex.value].val,
  keyword: '',
})
// Computed

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

// Methods
const queryOrder = () => {
  myOrderAPI.queryMyOrder(searchParams.value).then(res => {
    orders.value = res.data
  })
}

const changeStatus = (index) => {
  currentIndex.value = index
  searchParams.value.status = options[index].val
  queryOrder()
}

const getStatusClass = (status) => {
  const statusClasses = {
    0: 'status-waiting',
    1: 'status-paying',
    2: 'status-making',
    5: 'status-refunded',
    6: 'status-completed',
  }
  return statusClasses[status] || ''
}


const viewOrderDetail = (order) => {
  console.log('查看订单详情:', order)
  commonNavigate(`/pages/order-detail/index?id=${order.orderId}`)
}

const payOrder = (order) => {
  console.log('支付订单:', order)
}

const goShopping = () => {
  commonNavigate('/pages/order/index')
}
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.box {
  background: white;
  border-radius: 0 0 20rpx 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.header {
  padding: 20rpx 30rpx 0;

  .search-box {
    margin-bottom: 20rpx;

    .search-input {
      position: relative;
      display: flex;
      align-items: center;

      .search-input-field {
        flex: 1;
        height: 80rpx;
        background: #f8f4f0;
        border-radius: 40rpx;
        padding: 0 80rpx 0 30rpx;
        font-size: 28rpx;
        border: 2rpx solid transparent;
        transition: border-color 0.3s;

        &::placeholder {
          color: #999;
        }

        &:focus {
          border-color: #8B7355;
        }
      }

      .search-icon {
        position: absolute;
        right: 30rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 60rpx;
        height: 60rpx;
        background: #8B7355;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
          opacity: 0.8;
          transform: translateY(-50%) scale(0.95);
        }
      }
    }
  }

  .status-bar {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    .status-bar-item {
      flex: 1;
      text-align: center;
      padding: 16rpx 0;
      font-size: 26rpx;
      color: #666;
      position: relative;
      transition: all 0.3s;

      &.active {
        color: #8B7355;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: -20rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background: #8B7355;
          border-radius: 2rpx;
        }
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

.order-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;

  .order-card {
    background: white;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .order-title {
        font-size: 26rpx;
        color: #666;
        text-align: right;
      }

      .order-status-tag {
        font-size: 24rpx;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;

        &.status-waiting {
          background: #fff2e8;
          color: #fa8c16;
          border: 1rpx solid #ffd8bf;
        }

        &.status-paying {
          background: #f0f7ff;
          color: #1890ff;
          border: 1rpx solid #c6e2ff;
        }

        &.status-making {
          background: #f0f7ff;
          color: #8B7355;
          border: 1rpx solid #d1e3ff;
        }

        &.status-refunded {
          background: #f6ffed;
          color: #52c41a;
          border: 1rpx solid #b7eb8f;
        }

        &.status-completed {
          background: #f6ffed;
          color: #52c41a;
          border: 1rpx solid #b7eb8f;
        }
      }
    }

    .order-items-preview {
      display: flex;
      margin-bottom: 30rpx;

      .item-preview {
        margin-right: 20rpx;

        .item-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 12rpx;
          background: #f8f4f0;
        }
      }

      .more-items {
        width: 120rpx;
        height: 120rpx;
        background: #f8f4f0;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #8B7355;
        font-weight: bold;
      }
    }

    .order-info {
      margin-bottom: 30rpx;

      .order-info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 26rpx;
          color: #666;
        }

        .value {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;

          &.price {
            color: #8B7355;
            font-size: 32rpx;
          }
        }
      }
    }

    .order-actions {
      display: flex;
      justify-content: flex-end;
      gap: 20rpx;

      .detail-btn {
        padding: 12rpx 30rpx;
        border: 2rpx solid #e8d5c4;
        border-radius: 20rpx;
        font-size: 24rpx;
        color: #8B7355;
        background: #f8f4f0;

        &:active {
          background: #e8d5c4;
        }
      }

      .action-btn {
        padding: 12rpx 30rpx;
        background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
        border-radius: 20rpx;
        font-size: 24rpx;
        color: white;
        font-weight: bold;

        &:active {
          opacity: 0.8;
          transform: scale(0.98);
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .empty-icon {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 40rpx;
      opacity: 0.6;
    }

    .empty-text {
      font-size: 32rpx;
      color: #999;
      margin-bottom: 16rpx;
    }

    .empty-desc {
      font-size: 24rpx;
      color: #ccc;
      margin-bottom: 40rpx;
    }

    .go-shopping-btn {
      padding: 20rpx 60rpx;
      background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
      border-radius: 40rpx;
      font-size: 30rpx;
      color: white;
      font-weight: bold;

      &:active {
        opacity: 0.8;
        transform: scale(0.98);
      }
    }
  }
}
</style>