<template>
  <view class="body">
    <shop-card class="shop-card box" :pickUpType="pickUpType" @changePickUpType="changePickUpType" />
    <view class="content box">
      <scroll-view class="scroll-content" scroll-y="true">
        <view class="cart-list">
          <view :key="item.id" v-for="(item, index) in itemInfo" class="cart-detail-item">
            <view class="cart-detail-item-content">
              <view class="cart-detail-item-content-left">
                <image :src="item.cover || '/static/image/default-coffee.png'" mode="aspectFill" class="item-image" />
              </view>
              <view class="cart-detail-item-content-right">
                <view class="cart-detail-item-content-right-header">
                  <view class="title">{{ item.name }}</view>
                  <view class="price">¥ {{ item.price }}</view>
                </view>
                <view class="cart-detail-item-content-right-body">
                  <view class="sku"> 
                    {{ getSkuStr(item) }}
                  </view>
                  <!-- <view class="sku-tags">
                    <view class="sku-tag" v-for="(sku, index) in item.skus" :key="index">
                      {{ sku.label }}
                      <text v-if="sku.addonalPrice">(加¥{{ sku.addonalPrice }})</text>
                    </view>
                  </view> -->
                </view>
                <view class="cart-detail-item-content-right-footer">
                  <view class="count">×{{ item.count }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="feature-section">
          <view class="feature-item" @click="toggleCoupon">
            <view class="feature-left">
              <uni-icons type="vip-filled" color="#8B7355" size="20" />
              <text class="feature-title">优惠券</text>
            </view>
            <view class="feature-right">
              <text class="feature-value" :class="{'placeholder': !selectedCopuon}">
                {{ selectedCopuon ? selectedCopuon.name : '选择优惠券' }}
              </text>
              <uni-icons type="right" color="#999" size="18" />
            </view>
          </view>
          
          <view class="feature-item" @click="toggleRemark">
            <view class="feature-left">
              <uni-icons type="chat" color="#8B7355" size="20" />
              <text class="feature-title">备注</text>
            </view>
            <view class="feature-right">
              <text class="feature-value" :class="{'placeholder': !remark}">
                {{ remark || '填写备注' }}
              </text>
              <uni-icons type="right" color="#999" size="18" />
            </view>
          </view>
          <view v-if="orderType === 'Schedule'" class="feature-item" @click="toggleExpectArrivalTime">
            <view class="feature-left">
              <uni-icons type="chat" color="#8B7355" size="20" />
              <text class="feature-title">预计到店</text>
            </view>
            <view class="feature-right">
              <text class="feature-value">
                {{ expectArrivalTime }}
              </text>
              <uni-icons type="right" color="#999" size="18" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <view class="footer">
      <view class="footer-content">
        <view class="total-info">
          <text class="total-label">合计：</text>
          <text class="total-price">¥ {{ totalPrice }}</text>
        </view>
        <view class="pay-btn" @click="handlePay">去支付</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import ShopCard from '@/component/ShopCard.vue'
// Data
const itemInfo = ref([])
const pickUpType = ref('')
const currentShop = ref({})
const orderType = ref('')
const selectedCopuon = ref('')
const remark = ref('')
const expectArrivalTime  = ref('')
// Computed
const totalPrice = computed(() => {
  let total = 0
  itemInfo.value.forEach(item => {
    total += item.price * item.count
  })
  return total
})
// Fake data
const items = [
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
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  getCurrentShop()
  // itemInfo.value = [items[0]]
  getItems()
})
onLoad((opt) => {
  pickUpType.value = opt.pickUpType
  orderType.value = opt.orderType
  // itemInfo.value = decodeURIComponent(opt.itemInfo)
})
onUnload(() => {
  uni.$off('cart-submit')
})

// Watchers

// Methods
const getCurrentShop = () => {
  currentShop.value = uni.getStorageSync('CURRENT_SHOP')
}

const getItems = () => { 
  uni.$on('cart-submit', (data) => { 
    console.log('cart-submit',data)
    itemInfo.value = data.items
  })
}

const changePickUpType = (type) => {
  pickUpType.value = type
}

const toggleCoupon = () => { 
}

const toggleRemark = () => { 
}

const toggleExpectArrivalTime = () => { 
}

const getSkuStr = (item) => {
  return item.skus.map(sku => {
    return `${sku.label}`
  }).join('/')
}
</script>

<style scoped lang="scss">
.body {
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.shop-card {
  margin: 20rpx 0;
  border-radius: 0;
}

.box {
  background-color: #ffffff;
}

.content {
  flex: 1;
  margin: 20rpx 20rpx 0;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
  box-sizing: border-box;
  .scroll-content {
    height: 100%;
  }
}

.cart-list {
  padding: 30rpx;
  
  .cart-detail-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .cart-detail-item-content {
      display: flex;
      
      .cart-detail-item-content-left {
        margin-right: 20rpx;
        
        .item-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 12rpx;
          background-color: #f8f4f0;
        }
      }
      
      .cart-detail-item-content-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        
        .cart-detail-item-content-right-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16rpx;
          
          .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            flex: 1;
            margin-right: 20rpx;
          }
          
          .price {
            font-size: 32rpx;
            font-weight: bold;
            color: #8B7355;
            white-space: nowrap;
          }
        }
        
        .cart-detail-item-content-right-body {
          margin-bottom: 20rpx;

          .sku{
            font-size: 24rpx;
            color: #666;
            line-height: 1.5;
            margin-bottom: 12rpx;
            // width: 80%;
          }
          
          .sku-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 12rpx;
            
            .sku-tag {
              font-size: 24rpx;
              color: #666;
              background: #f5f5f5;
              padding: 4rpx 12rpx;
              border-radius: 16rpx;
              
              text {
                color: #8B7355;
                font-size: 20rpx;
                margin-left: 4rpx;
              }
            }
          }
        }
        
        .cart-detail-item-content-right-footer {
          position: absolute;
          right: 0;
          bottom: 0;
          
          .count {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
            min-width: 60rpx;
            text-align: right;
          }
        }
      }
    }
  }
}

.feature-section {
  padding: 30rpx;
  // background: #fafafa;
  margin-top: 20rpx;
  border-radius: 20rpx 20rpx 0 0;
  
  .feature-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .feature-left {
      display: flex;
      align-items: center;
      
      .feature-title {
        font-size: 28rpx;
        color: #333;
        margin-left: 12rpx;
      }
    }
    
    .feature-right {
      display: flex;
      align-items: center;
      
      .feature-value {
        font-size: 28rpx;
        color: #333;
        max-width: 300rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12rpx;
        
        &.placeholder {
          color: #999;
        }
      }
    }
    
    &:active {
      opacity: 0.7;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20rpx 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .total-info {
      .total-label {
        font-size: 28rpx;
        color: #666;
      }
      
      .total-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #8B7355;
      }
    }
    
    .pay-btn {
      width: 240rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: bold;
      color: white;
      box-shadow: 0 8rpx 24rpx rgba(139, 115, 85, 0.3);
      
      &:active {
        opacity: 0.9;
        transform: scale(0.98);
      }
    }
  }
}

// 为内容区域添加底部内边距，避免被footer遮挡
.scroll-content {
  padding-bottom: 140rpx;
  box-sizing: border-box;
}
</style>