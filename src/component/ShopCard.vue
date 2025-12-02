<template>
  <view class="header">
    <view class="left-info">
      <view class="title" @click="handleClickShopInfo">
        <view class="shop-name">{{ currentShop?.shopName }}</view>
        <uni-icons type="right" size="14"></uni-icons>
      </view>
      <view class="address">{{ currentShop?.address }}</view>
      <view class="distance" v-if="currentShop?.distance">距离{{ formatDistance(currentShop?.distance) }}</view>
    </view>
    <view class="right-info">
      <view class="btn-group">
        <view class="btn" :class="{ 'active': pickUpType === '0' }" @click="changePickUpType('0')">堂食</view>
        <view class="btn" :class="{ 'active': pickUpType === '1' }" @click="changePickUpType('1')">外带</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { formatDistance, commonNavigate} from '@/utils/CommonUtils'
// Data
const currentShop = ref({})
// Computed

// Emits
const emit = defineEmits([
  'changePickUpType'
])

// Props
const props = defineProps({
  pickUpType: {
    type: String,
    default: '0'
  }
})

// Lifecycle hooks
onMounted(() => {
  getCurrentShop()
  console.log(props);
  
})

// Watchers

// Methods
const getCurrentShop = () => {
  currentShop.value = uni.getStorageSync('CURRENT_SHOP')
}
const handleClickShopInfo = () => {
  commonNavigate('/pages/shop/index')
}

const changePickUpType = (type) => {
  emit('changePickUpType', type)
}
</script>

<style scoped lang="scss">
.header {
  height: 200rpx;
  padding: 30rpx;
  display: flex;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

.left-info {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.right-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
}

.content {
  height: calc(100vh - 200rpx);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}

.btn-group {
  display: flex;
  flex-direction: row;
  border-radius: 50rpx;
  border: 1px solid #8B7355;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 4px #A58C6D;
}

.btn {
  font-size: 26rpx;
  padding: 16rpx 40rpx;
  text-align: center;
  color: #8B7355;
  background-color: #fff;
  transition: all 0.3s ease;

  &.active {
    background-color: #8B7355;
    color: #fff;
    font-weight: bold;
  }
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  cursor: pointer;
}

.shop-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
}

.address {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 10rpx;
  line-height: 1.4;
}

.distance {
  font-size: 22rpx;
  color: #999;
}
</style>