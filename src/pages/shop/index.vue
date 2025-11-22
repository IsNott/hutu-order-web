<template>
  <div class="body">
    <div class="map-container">
      <map class="map-box" :class="{ 'map-box-expanded': isExpanded }" :longitude="longitude" :latitude="latitude"
        :markers="markers" :scale="config.scale" :theme="config.theme" @markertap="centerToShop"
        v-if="locationLoaded" />
    </div>
    <div class="location-button" :class="{ 'location-button-expanded': isExpanded }" @click="relocal()">
      <image src="@/static/icon/local.png" class="location-icon" />
    </div>
    <div class="shop-info" :class="{ 'shop-info-expanded': isExpanded }" @touchstart="handleTouchStart"
      @touchmove="handleTouchMove">
      <div class="drag-handle">
        <div class="drag-bar"></div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box">
        <div class="search-input">
          <input type="text" placeholder="搜索门店" v-model="searchParam.keyword" class="search-input-field">
          <div class="search-icon" @click="getShopInfo()">搜索</div>
        </div>
      </div>
      <div class="shop-list">
        <div class="shop-info-item" v-for="(shop, index) in shopInfos" :key="index" @click="selectShop(shop)"
          :class="{ 'shop-info-item--active': selectedShopId === shop.id }">
          <div class="shop-info-item-info">
            <div class="shop-info-item-header">
              <div class="shop-info-item-info-name">{{ shop.shopName }}</div>
              <div class="shop-confirm" @click="goToOrder(shop)">
                去下单
              </div>
            </div>
            <div class="shop-info-item-header">
              <div class="shop-info-item-info-address">{{ shop.address }}</div>
              <div class="shop-distance" v-if="shop.distance">{{ formatDistance(shop.distance) }}</div>
            </div>
          </div>
        </div>
        <div class="shop-info-footer">
          暂无更多门店
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch, onBeforeMount, computed, nextTick } from 'vue'
import { HomeAPI } from '@/pages/home/api'
import { onShow } from '@dcloudio/uni-app'
import { staticLatAndLongitude } from '@/mock'
import { commonNavigate } from '@/utils/CommonUtils'

// Data
const shopInfos = ref([])
const config = ref({
  scale: 17,
  theme: 'normal'
})
const longitude = ref(0)
const latitude = ref(0)
const locationLoaded = ref(false)
const isExpanded = ref(false)
const startY = ref(0)
const currentY = ref(0)
const markers = ref([])
const searchParam = ref({ ...emptySearchParam })
const emptySearchParam = { keyword: '' }
const selectedShopId = ref(null)

watch(isExpanded, (newValue) => {
  locationLoaded.value = false
  nextTick(() => {
    locationLoaded.value = true
  })
})

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

onBeforeMount(() => {
})

// Lifecycle hooks
onMounted(() => {

})

onShow(() => {
  getUserLocal()
})


// Methods
const getShopInfo = () => {
  HomeAPI.queryShopInfo(searchParam.value).then(res => {
    shopInfos.value = res.data
    if (shopInfos.value.length > 0) {
      shopInfos.value.forEach(shop => {
        shop.distance = calculateDistance(latitude.value, longitude.value, shop.latitude, shop.longitude)
      })
      shopInfos.value.sort((a, b) => a.distance - b.distance)
    }
    selectedShopId.value = null
    generateMarkers()
  })
}

const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    return `${(distance / 1000).toFixed(1)}km`
  }
}

const relocal = () => {
  getUserLocal(false)
}

const getUserLocal = (queryShop = true) => {
  selectedShopId.value = null
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      console.log('getLocal:' + JSON.stringify(res));
      longitude.value = res.longitude
      latitude.value = res.latitude
      if (queryShop) {
        getShopInfo()
      } else {
        generateMarkers()
      }
    },
    fail: (error) => {
      longitude.value = staticLatAndLongitude[1]
      latitude.value = staticLatAndLongitude[0]
      if (queryShop) {
        getShopInfo()
      } else {
        generateMarkers()
      }
    }
  })
}

const generateMarkers = () => {
  locationLoaded.value = false
  if (!longitude.value || !latitude.value || shopInfos.value.length === 0) {
    nextTick(() => {
      locationLoaded.value = true
    })
    return
  }

  const userMarker = {
    id: 0,
    latitude: latitude.value,
    longitude: longitude.value,
    title: selectedShopId.value === null ? '我的位置' : '选中门店',
    iconPath: selectedShopId.value === null ? '../../static/icon/my-location.png' : '../../static/icon/shop-location-selected.png',
    width: 30,
    height: 30,
    callout: {
      content: selectedShopId.value === null ? '我的位置' : '选中门店',
      color: '#ffffff',
      bgColor: '#007AFF',
      padding: 5,
      borderRadius: 3,
      display: ''
    }
  }

  const shopMarkers = shopInfos.value.map((shop, index) => {
    return {
      id: index + 1,
      latitude: shop.latitude,
      longitude: shop.longitude,
      title: shop.shopName,
      iconPath: '../../static/icon/shop-location.png',
      width: 25,
      height: 25,
      callout: {
        content: `${shop.shopName}\n${shop.address}`,
        color: '#333333',
        bgColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eeeeee'
      }
    }
  }).filter(shop => shop.latitude != latitude.value && shop.longitude != longitude.value)
  nextTick(() => {
    locationLoaded.value = true
  })
  markers.value = [userMarker, ...shopMarkers]
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000 // 地球半径，单位米
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return Math.round(distance)
}

const selectShop = (shop) => {
  // 设置选中状态
  selectedShopId.value = shop.id
  console.log('selectShop:', selectedShopId.value);

  centerToShop(shop)
}

// 点击门店
const centerToShop = (shop) => {
  if (shop && shop.latitude && shop.longitude) {
    longitude.value = shop.longitude
    latitude.value = shop.latitude
    generateMarkers()
  }
}

// 拖拽相关方法
const handleTouchStart = (e) => {
  startY.value = e.touches[0].clientY
  currentY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  e.preventDefault()
  currentY.value = e.touches[0].clientY
  const deltaY = startY.value - currentY.value

  // 向上滑动（展开）
  if (deltaY > 50) {
    isExpanded.value = true
  }
  // 向下滑动（收起）
  else if (deltaY < -50) {
    isExpanded.value = false
  }
}

const goToOrder = (shop) => {
  uni.setStorageSync('current_shop', shop)
  commonNavigate('/pages/order/index')
}
// Watchers

</script>

<style scoped lang="scss">
.body {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-box {
  width: 100%;
  height: 60%;

  .map-box-expanded {
    height: 30%;
  }
}

.shop-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20rpx 20rpx 0 0;
  z-index: 2;
  height: 40%;
  min-height: 40%;
  max-height: 60%;
  transition: height 0.3s ease;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  &.shop-info-expanded {
    height: 60%;
  }
}

.drag-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  touch-action: none;
}

.drag-bar {
  width: 60rpx;
  height: 6rpx;
  background: #e0e0e0;
  border-radius: 3rpx;
}

.shop-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 20rpx 20rpx 20rpx;

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 4rpx;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2rpx;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2rpx;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
}

.shop-info-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  border-radius: 16rpx;
  margin: 10rpx 0;
  transition: all 0.2s ease;
  border: 2rpx solid transparent;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f8f8f8;
  }

  &.shop-info-item--active {
    background-color: #e6f3ff;
    border-color: #007AFF;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.15);

    .shop-info-item-info-name {
      color: #007AFF;
    }

    .shop-info-item-info-address {
      color: #666;
    }

    .shop-distance {
      background: #007AFF;
      color: white;
    }
  }
}

.shop-confirm{
  font-size: 13px;
    padding: 0 16rpx;
    font-weight: 600;
}

.shop-info-item-info {
  flex: 1;

  .shop-info-item-info-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    flex: 1;
    transition: color 0.2s ease;
  }

  .shop-info-item-info-address {
    font-size: 26rpx;
    color: #666;
    line-height: 1.4;
    transition: color 0.2s ease;
  }
}

.search-box {
  padding: 0 20rpx 20rpx 20rpx;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;

  .search-input-field {
    flex: 1;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 40rpx;
    padding: 0 80rpx 0 30rpx;
    font-size: 28rpx;
    border: none;
    outline: none;

    &::placeholder {
      color: #999;
    }
  }

  .search-icon {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 32rpx;
    color: #666;
  }
}

.shop-info-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10rpx;
}

.shop-distance {
  font-size: 24rpx;
  color: #007AFF;
  background: #e6f3ff;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  white-space: nowrap;
  margin-left: 20rpx;
  font-weight: 500;
  transition: all 0.2s ease;
}

// 适配不同屏幕
@media screen and (min-height: 1000px) {
  .shop-info {
    min-height: 25%;
    max-height: 50%;

    &.shop-info-expanded {
      height: 50%;
    }
  }

  .location-button {
    top: 52%;

    &.location-button-expanded {
      top: 40%
    }
  }
}

@media screen and (max-height: 600px) {
  .shop-info {
    min-height: 35%;
    max-height: 65%;

    &.shop-info-expanded {
      height: 65%;
    }
  }

  .location-button {
    top: 54%;

    &.location-button-expanded {
      top: 28%
    }
  }
}

.location-button {
  position: absolute;
  top: 54%;
  right: 4%;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: all 0.2s ease;

  &:active {
    background: #e0e0e0;
    transform: scale(0.95);
  }

  &.location-button-expanded {
    top: 34%
  }
}

.location-icon {
  width: 32rpx;
  height: 32rpx;
}

// 选中状态下的定位按钮样式
.shop-info-item--active .location-button {
  background: #007AFF;

  .location-icon {
    filter: brightness(0) invert(1);
  }
}

.shop-info-footer{
  text-align: center;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
}
</style>
