<template>
  <view class="body">
    <view class="header box">
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
          <view class="btn" :class="{ 'active': pickUpType === 0 }" @click="pickUpType = 0">堂食</view>
          <view class="btn" :class="{ 'active': pickUpType === 1 }" @click="pickUpType = 1">外带</view>
        </view>
      </view>
    </view>
    <view class="content box">
      <scroll-view class="catalog-list" scroll-y>
        <view v-for="catalog in sideCatalogs" class="catalog-item" :class="{ 'active': activeCatalog === catalog.id }"
          :key="catalog.id" @click="handleClickCatalog(catalog)">
          {{ catalog.name }}
        </view>
      </scroll-view>
      <scroll-view class="menu-list" scroll-y @scroll="handleMenuScroll" :scroll-top="menuScrollTop"
        scroll-with-animation :scroll-into-view="scrollIntoView" :show-scrollbar="false">
        <view v-for="catalog in allCatalogs" :key="catalog.id" class="menu-catalog-section"
          :id="'catalog-' + catalog.id">
          <view class="catalog-title">{{ catalog.name }}</view>
          <view v-for="menu in getMenusByCatalog(catalog.id)" :key="menu.id" class="menu-item" @click="goToDetail(menu)">
            <image class="menu-image" :src="menu.cover" mode="aspectFill"></image>
            <view class="menu-item-info">
              <view class="menu-item-name">{{ menu.name }}</view>
              <view class="menu-item-desc">{{ menu.description }}</view>
              <view class="menu-item-price">¥{{ menu.price }}</view>
            </view>
            <view class="menu-item-action">
              <button class="add-btn" @click="goToDetail(menu)">
                <uni-icons type="plusempty" size="18" color="white"></uni-icons>
              </button>
            </view>
          </view>
        </view>
        <no-more />
      </scroll-view>
    </view>
    <view v-if="cart.length > 0" class="cart-box" @click="toggleCartDetail">
      <view class="cart-icon">
        <uni-icons type="cart" size="24" color="#fff"></uni-icons>
        <view v-if="totalQuantity > 0" class="cart-badge">{{ totalQuantity }}</view>
      </view>
      <view class="cart-info">
        <view class="cart-total">¥{{ totalPrice }}</view>
        <view class="cart-desc">已选{{ totalQuantity }}件商品</view>
      </view>
      <view class="cart-action">
        <view class="checkout-btn">去结算</view>
      </view>
    </view>
    <view class="cart-mask" v-if="showCartDetail && cart.length > 0" @click="toggleCartDetail"></view>
    <view class="cart-detail" v-if="cart.length > 0" :class="{ 'cart-detail-show': showCartDetail }">
      <view class="cart-detail-header">
        <view class="cart-detail-title">购物袋</view>
        <!-- <view class="cart-detail-clear" @click="showSelectRadio">
          <uni-icons type="bars" size="24" color="gray"></uni-icons>
        </view> -->
        <view class="cart-detail-clear" @click="clearCart">
          <uni-icons type="trash" size="16" color="gray"></uni-icons>
          清空
        </view>
      </view>
      <scroll-view class="cart-detail-list box" scroll-y>
        <view v-for="(item, index) in cart" :key="item.id" class="cart-detail-item">
          <!-- <radio v-if="selectRadio"
            :value="item.id"
          /> -->
          <view class="cart-item-image">
            <image :src="item.cover" mode="aspectFill" style="height: 64px;width: 64px;"></image>
          </view>
          <view class="cart-item-info">
            <view class="cart-item-name">{{ item.name }}</view>
            <view class="cart-item-price">¥{{ item.price }}</view>
            <view class="cart-item-sku">
              <view v-for="(option, index) in item.skus" :key="index" class="sku-label">{{ option.label }}</view>
            </view>
          </view>
          <view class="cart-item-actions">
            <button class="cart-item-btn minus" @click.stop="decreaseQuantity(item)">
              <uni-icons type="back" size="16" color="#007AFF"></uni-icons>
            </button>
            <view class="cart-item-count">{{ item.count }}</view>
            <button class="cart-item-btn plus" @click.stop="increaseQuantity(item)">
              <uni-icons type="forward" size="16" color="#007AFF"></uni-icons>
            </button>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, nextTick, computed } from 'vue'
import { commonNavigate, formatDistance } from '@/utils/CommonUtils'
import { orderAPI } from './api'
import noMore from '@/component/NoMore.vue'
import { onLoad } from '@dcloudio/uni-app'
// Data
const orderType = ref('now')
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
const showCartDetail = ref(false)
const selectRadio = ref(false)
const cartSelected = ref([])
// Computed
const sideCatalogs = computed(() => {
  return catalogs.value.filter(catalog => catalog.showSide)
})

const allCatalogs = computed(() => {
  return catalogs.value
})

// 购物车总数量
const totalQuantity = computed(() => {
  return cart.value.reduce((total, item) => total + (item.count || 1), 0)
})

// 购物车总价格
const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * (item.count || 1)), 0).toFixed(2)
})

// Emits
const emit = defineEmits([])

// Props
const props = defineProps({})

// Lifecycle hooks
onMounted(() => {
  getCurrentShop()
  getMyPackage()
})

onLoad((opt) => {
  orderType.value = opt.orderType
})


watch(() => currentShop.value, (newValue, oldValue) => {
  getCatalogAndMenu()
})

watch(() => cart.value, () => { 
  if(cart.value.length == 0){
    toggleCartDetail()
  }
})

// Methods
const getCurrentShop = () => {
  currentShop.value = uni.getStorageSync('CURRENT_SHOP')
}

const getMyPackage = () => {
  orderAPI.queryMyPackage().then(res => {
    console.log('getMyPackage:' , res);
    cart.value = res.data
  })
}

const handleClickShopInfo = () => {
  commonNavigate('/pages/shop/index')
}

const getCatalogAndMenu = async () => {
  try {
    const [catalogRes, menuRes] = await Promise.all([
      orderAPI.getCatalogByShop(currentShop.value.id),
      orderAPI.getMenuByShop(currentShop.value.id)
    ])

    catalogs.value = catalogRes.data
    menus.value = menuRes.data

  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    nextTick(() => {
      calculateSectionPositions()
    })
  }
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
  const existingItem = cart.value.find(item => item.id === menu.id)
  if (existingItem) {
    existingItem.count = (existingItem.count || 1) + 1
  } else {
    cart.value.push({
      ...menu,
      count: 1
    })
  }
}

const goToDetail = (item) => {
  commonNavigate('/pages/item-detail/index?id=' + item.id)
}

const showSelectRadio = () => { 
  selectRadio.value = !selectRadio.value
}

const increaseQuantity = (item) => {
  item.count = (item.count || 1) + 1
}

const decreaseQuantity = (item) => {
  if (item.count > 1) {
    item.count -= 1
  } else {
    const index = cart.value.findIndex(cartItem => cartItem.id === item.id)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const clearCart = () => {
  cart.value = []
  showCartDetail.value = false
}

const toggleCartDetail = () => {
  showCartDetail.value = !showCartDetail.value
}
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

.cart-box {
  position: fixed;
  bottom: 0rpx;
  // border-radius: 100rpx;
  left: 0rpx;
  right: 0rpx;
  height: 100rpx;
  background: #333;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  z-index: 200;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.cart-icon {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  background: #007AFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.cart-info {
  flex: 1;
  color: white;
}

.cart-total {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.cart-desc {
  font-size: 24rpx;
  color: #ccc;
}

.cart-action {
  margin-left: auto;
}

.checkout-btn {
  background: #007AFF;
  color: white;
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: bold;
}

// 购物车遮罩层
.cart-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 199;
}

// 购物车详情
.cart-detail {
  position: fixed;
  // bottom: -80vh;
  left: 0;
  right: 0;
  // height: 60vh;
  background: white;
  border-radius: 30rpx 30rpx 0 0;
  z-index: 200;
  transition: bottom 0.3s ease;
  display: flex;
  flex-direction: column;

  &.cart-detail-show {
    bottom: 100rpx;
  }
}

.cart-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.cart-detail-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.cart-detail-clear {
  font-size: 24rpx;
  color: #a7a7a7;
  padding: 10rpx 20rpx;
}

.cart-detail-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

.cart-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
}

.cart-item-info {
  flex: 1;
}

.cart-item-image{
  margin: 0 20rpx;
}

.cart-item-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.cart-item-price {
  font-size: 26rpx;
  color: #e54847;
  font-weight: bold;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.cart-item-btn {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #007AFF;
  background: white;

  &.minus,
  &.plus {
    border-color: #007AFF;
  }

  &.delete {
    border-color: #ff4444;
    margin-left: 10rpx;
  }
}

.cart-item-sku{
  font-size: 22rpx;
  color: #999;
  margin-bottom: 12rpx;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 10rpx;
  // justify-content: space-between;
  flex-wrap: wrap;
  & > span {
    display: block;
  }
}

.cart-item-count {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  min-width: 60rpx;
  text-align: center;
}
</style>