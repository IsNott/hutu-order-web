<template>
  <view class="body">
    <view class="header box">
      <view class="left-info">
        <view class="title" @click="handleClickShopInfo">
          <view class="shop-name">{{ currentShop.shopName }}</view>
          <uni-icons type="right" size="14"></uni-icons>
        </view>
        <view class="address">{{ currentShop.address }}</view>
        <view class="distance" v-if="currentShop.distance">距离{{ formatDistance(currentShop.distance) }}</view>
      </view>
      <view class="right-info">
        <view class="btn-group">
          <view 
            class="btn" 
            :class="{ 'active' : pickUpType === 0 }"
            @click="pickUpType = 0"
          >堂食</view>
          <view 
            class="btn" 
            :class="{ 'active' : pickUpType === 1 }"
            @click="pickUpType = 1"
          >外带</view>
        </view>
      </view>
    </view>
    <view class="content box">
      <scroll-view class="catalog-list" scroll-y>
        <view 
          v-for="catalog in sideCatalogs" 
          class="catalog-item" 
          :class="{ 'active' : activeCatalog === catalog.id }" 
          :key="catalog.id" 
          @click="handleClickCatalog(catalog)"
        >
          {{ catalog.name }}
        </view>
      </scroll-view>
      <scroll-view 
        class="menu-list" 
        scroll-y 
        @scroll="handleMenuScroll"
        :scroll-top="menuScrollTop"
        scroll-with-animation
        :scroll-into-view="scrollIntoView"
      >
        <view 
          v-for="catalog in allCatalogs" 
          :key="catalog.id" 
          class="menu-catalog-section"
          :id="'catalog-' + catalog.id"
        >
          <view class="catalog-title">{{ catalog.name }}</view>
          <view 
            v-for="menu in getMenusByCatalog(catalog.id)" 
            :key="menu.id" 
            class="menu-item"
          > 
            <image class="menu-image" :src="menu.cover" mode="aspectFill"></image>
            <view class="menu-item-info">
              <view class="menu-item-name">{{ menu.name }}</view>
              <view class="menu-item-desc">{{ menu.description }}</view>
              <view class="menu-item-price">¥{{ menu.price }}</view>
            </view>
            <view class="menu-item-action">
              <button class="add-btn" @click="addToCart(menu)">
                <uni-icons type="plusempty" size="18" color="white"></uni-icons>
              </button>
            </view>
          </view>
        </view>
        <no-more />
      </scroll-view>
    </view>
    <view v-if="cart.length > 0" class="cart box">

    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, nextTick, computed } from 'vue'
import { commonNavigate, formatDistance } from '@/utils/CommonUtils'
import { orderAPI } from './api'
import noMore from '@/component/NoMore.vue'
// Data
const currentShop = ref(null)
const pickUpType = ref(0)
const catalogs = ref([])
const menus = ref([])
const activeCatalog = ref(1)
const menuScrollTop = ref(0)
const scrollIntoView = ref('')
const sectionPositions = ref([])
const isScrolling = ref(false)
const cart = ref([])
// Computed
const sideCatalogs = computed(() => {
  return catalogs.value.filter(catalog => catalog.showSide)
})

const allCatalogs = computed(() => {
  return catalogs.value
})

// Emits
const emit = defineEmits([])

// fake data
const shop = {
  shopName: 'Hutu Coffee',
  address: '香港特别行政区 油尖旺区',
  phone: '123456789',
  logo: '/static/logo.png',
  banner: '/static/banner.png',
  description: 'Hutu Coffee is a coffee shop in Hong Kong.',
  latitude: 22.306583887776,
  longitude: 114.17854456,
  openTime: '08:00',
  closeTime: '22:00',
  tag: '新店优惠',
  distance: 500
}

// Props
const props = defineProps({})

// Lifecycle hooks
onMounted(() => {
  getCurrentShop()
})

// Methods
const getCurrentShop = () => {
  currentShop.value = uni.getStorageSync('CURRENT_SHOP')
}

const handleClickShopInfo = () => {
  commonNavigate('/pages/shop/index')
}

const getCatalog = () => {
  orderAPI.getCatalogByShop(currentShop.value.id).then(res => { 
    catalogs.value = res.data
  })
}

const getMenu = () => {
  orderAPI.getMenuByShop(currentShop.value.id).then(res => { 
    menus.value = res.data
  })
  // 计算各个分类区域的位置
  nextTick(() => {
    calculateSectionPositions()
  })
}

const getMenusByCatalog = (catalogId) => {
  return menus.value.filter(menu => menu.catalogId === catalogId)
}

const handleClickCatalog = (catalog) => {
  if (isScrolling.value) return
  
  activeCatalog.value = catalog.id
  isScrolling.value = true
  
  // 滚动到对应的分类区域
  scrollIntoView.value = 'catalog-' + catalog.id
  
  // 重置 scrollIntoView 以便下次可以再次触发
  setTimeout(() => {
    scrollIntoView.value = ''
    isScrolling.value = false
  }, 300)
}

const handleMenuScroll = (e) => {
  if (isScrolling.value) return
  
  const scrollTop = e.detail.scrollTop
  
  let currentSectionId = activeCatalog.value
  
  for (let i = sectionPositions.value.length - 1; i >= 0; i--) {
    const section = sectionPositions.value[i]
    if (scrollTop >= section.top - 200) { // 减去偏移量
      currentSectionId = section.id
      break
    }
  }
  
  if (activeCatalog.value !== currentSectionId) {
    activeCatalog.value = currentSectionId
  }
}

const calculateSectionPositions = () => {
  sectionPositions.value = []
  
  const query = uni.createSelectorQuery()
  
  allCatalogs.value.forEach(catalog => {
    query.select('#catalog-' + catalog.id).boundingClientRect()
  })
  
  query.exec((res) => {
    res.forEach((rect, index) => {
      if (rect) {
        sectionPositions.value.push({
          id: allCatalogs.value[index].id,
          top: rect.top
        })
      }
    })
    
    sectionPositions.value.sort((a, b) => a.top - b.top)
  })
}

const addToCart = (menu) => {
  console.log('添加商品到购物车:', menu)
  cart.value.push(menu)
}

// Watchers
watch(() => currentShop.value, (newValue, oldValue) => {
  if (newValue) {
    getCatalog()
    getMenu()
  } 
})
</script>

<style scoped lang="scss">
.body {
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

.box {
  width: 100%;
  background-color: #ffffff;
}

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

.btn-group {
  display: flex;
  flex-direction: row;
  border-radius: 50rpx;
  border: 1px solid #007AFF;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(17, 57, 238, 0.2);
}

.btn {
  font-size: 26rpx;
  padding: 16rpx 40rpx;
  text-align: center;
  color: #007AFF;
  background-color: #fff;
  transition: all 0.3s ease;
  
  &.active {
    background-color: #007AFF;
    color: #fff;
    font-weight: bold;
  }
}

.catalog-list {
  width: 160rpx;
  background-color: #f8f8f8;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .catalog-item {
    padding: 30rpx 20rpx;
    font-size: 26rpx;
    text-align: center;
    color: #666;
    background-color: #f8f8f8;
    border-left: 4rpx solid transparent;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &.active {
      background-color: #ffffff;
      color: #007AFF;
      font-weight: bold;
      border-left-color: #007AFF;
    }
  }
}

.menu-list {
  flex: 1;
  height: 100%;
  background-color: #ffffff;
}

.menu-catalog-section {
  padding: 20rpx;
  
  .catalog-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-bottom: 10rpx;
    border-bottom: 2rpx solid #f0f0f0;
  }
}

.menu-item {
  display: flex;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fafafa;
  border-radius: 16rpx;
  
  .menu-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    background-color: #e0e0e0;
  }
  
  .menu-item-info {
    flex: 1;
    
    .menu-item-name {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .menu-item-desc {
      font-size: 22rpx;
      color: #999;
      margin-bottom: 12rpx;
      line-height: 1.4;
    }
    
    .menu-item-price {
      font-size: 26rpx;
      font-weight: bold;
      color: #e54847;
    }
  }
  
  .menu-item-action {
    display: flex;
    align-items: flex-end;
    
    .add-btn {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background-color: #007AFF;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-size: 28rpx;
      font-weight: bold;
      
      &:active {
        background-color: #0056cc;
        transform: scale(0.95);
      }
    }
  }
}
</style>