<template>
  <scroll-view class="body">
    <uni-swiper-dot class="uni-swiper-dot-box" :info="playImages" :current="current" mode="round" field="content"
      :dots-styles="dotStyle">
      <swiper class="swiper-box" @change="changeBanner" :current="current" :autoplay='true'>
        <swiper-item v-for="(item, index) in playImages" :key="index" @click="clickImage(item)">
          <image style="width: 100%;" :src="config.baseUrl + item.attachUrl" />
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
    <view class="top-info box">
    <view class="title" @click="handleClickShopInfo">
      <view class="shop-info">
        <view class="shop-name">{{ currentShop.shopName }}</view>
        <view class="shop-distance" v-if="currentShop.distance">
          距离{{ currentShop.distance }}km
        </view>
      </view>
      <uni-icons type="right" size="16" color="white"></uni-icons>
    </view>
    <view class="offer">
      <view class="offer-item" @click="clickOfferItem(OrderType.NOW)">
        <view class="offer-item-desc">立即下单</view>
        <view class="offer-item-title">Order Now</view>
      </view>
      <view class="divider"></view>
      <view class="offer-item" @click="clickOfferItem(OrderType.SCHEDULE)">
        <view class="offer-item-desc">预约点单</view>
        <view class="offer-item-title">Schedule</view>
      </view>
    </view>
  </view>
    <!-- 轮播活动卡 -->
     <view class="activity-card box">
      <view class="act-banner-container">
        <uni-swiper-dot :info="playActImages" :current="actCurrent" mode="round" field="content"
          :dots-styles="actDotStyle">
          <swiper class="swiper" @change="changeActBanner" :current="actCurrent" :autoplay='true' next-margin="20rpx">
            <swiper-item class="swiper-item" v-for="(item, index) in playActImages" :key="index"
              @click="clickImage(item)">
              <image class="act-swiper-image" :src="config.baseUrl + item.attachUrl" mode="aspectFill" />
            </swiper-item>
          </swiper>
        </uni-swiper-dot>
      </view>
    </view>

    <!-- 活动列表 -->
    <view class="activity-list" v-if="activity.length > 0">
      <view class="activity-info box" :key="index" v-for="act, index in activity">
        <image class="activity-img" :src="config.baseUrl + act.attachUrl" mode="widthFix" />
      </view>
    </view>

    <no-more text="Hutu-order"/>
  </scroll-view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { config } from '@/config/index'
import { HomeAPI } from '@/pages/home/api'
import { commonNavigate, calculateDistance } from '@/utils/CommonUtils'
import { staticLatAndLongitude } from '@/mock'
import { OrderType } from '@/enums/HutuEnums'
import noMore from '@/component/NoMore.vue'
const playImages = ref([])
const playActImages = ref([])
const current = ref(0)
const actCurrent = ref(0)
const currentShop = ref({})
const dotStyle = {
  bottom: 30,
  backgroundColor: 'white',
  selectedBackgroundColor: 'white',
  border: '',
  selectedBorder: ''
}
const actDotStyle = {
  backgroundColor: 'white',
  selectedBackgroundColor: 'white',
  border: '',
  selectedBorder: ''
}
const activity = ref([])

// TODO 获取会员卡信息
const vipCard = ref({})
const card = {
  points: 10,
  level: 1,
  nextLevelPoints: 100,
}

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})
// Lifecycle hooks
onMounted(() => {
  // requestLocationPermission()
  getImage()
  getAct()
})

onShow(() => {
  getShopInfo()
})

// Methods
const clickOfferItem = (type) => {
  uni.setStorageSync('ORDER_TYPE', type)
  commonNavigate('/pages/order/index')
}

const getImage = () => {
  HomeAPI.getPlayImage(0).then(res => {
    console.log('getImage0:' , res);
    playImages.value = res.data
  })
}

const getAct = () => {
  HomeAPI.getPlayImage(1).then(res => {
    console.log('getImage1:' , res);
    playActImages.value = res.data
  })
  HomeAPI.getPlayImage(2).then(res => {
    console.log('getImage2:' , res);
    activity.value = res.data
  })
}

const getShopInfo = () => {
  const val = uni.getStorageSync('CURRENT_SHOP')
  if (val) {
    currentShop.value = val
    return
  }
  let local = {
    latitude: staticLatAndLongitude[0],
    longitude: staticLatAndLongitude[1]
  }
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      console.log('getLocal:' + JSON.stringify(res));
      local.latitude = res.latitude
      local.longitude = res.longitude
    },
    fail: (error) => {
      console.log('getLocal failed:' + JSON.stringify(error));
    }
  })
  HomeAPI.queryShopInfo({}).then(res => {
    if (res.data.length > 0) {
      currentShop.value = res.data[0]
      currentShop.value.distance = calculateDistance(local.latitude, local.longitude, res.data[0].latitude, res.data[0].longitude)
      uni.setStorageSync('CURRENT_SHOP', currentShop.value)
    }
  })

}

const handleClickShopInfo = () => {
  commonNavigate('/pages/shop/index')
}

const changeBanner = (e) => {
  current.value = e.detail.current
}

const changeActBanner = (e) => {
  actCurrent.value = e.detail.current
}

const clickImage = (img) => {
  // TODO 判断外链
  if (img.navigateUrl) {
    commonNavigate(img.navigateUrl)
  }
}
// Watchers

</script>

<style scoped lang="scss">
.body {}

.box {
  margin: 20rpx 30rpx;
  border-radius: 10rpx;
}

.top-info {
  padding: 30rpx;
  background: linear-gradient(135deg, #6e675e 0%, #5a5b5c 100%);
  border-radius: 20rpx;
  z-index: 1;
  position: relative;
  top: -40rpx;
  margin-top: 0rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 241, 223, 0.3);
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  
  .shop-info {
    display: flex;
    flex-direction: column;
    
    .shop-name {
      font-size: 30rpx;
      font-weight: bold;
      color: white;
      margin-bottom: 8rpx;
      letter-spacing: 1rpx;
    }
    
    .shop-distance {
      font-size: 20rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 20rpx;
}

.offer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .offer-item {
    flex: 1;
    padding: 24rpx;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    text-align: center;
    backdrop-filter: blur(10rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:active {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(0.98);
    }
  }

  .offer-item-title {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 8rpx;
  }

  .offer-item-desc {
    font-weight: bold;
    font-size: 32rpx;
    color: white;
    letter-spacing: 2rpx;
  }
}

.activity-card {
  overflow: hidden;
  padding: 0;
  background: transparent;
  box-shadow: none;
  
  .act-banner-container {
    overflow: hidden;
    border-radius: 10rpx;
    
    .swiper {
      height: 200rpx;
    }
    
    .swiper-item {
      display: block;
      height: 200rpx;
      line-height: 200rpx;
      text-align: center;
    }
    
    .act-swiper-image {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    :deep(.uni-swiper__dots-box) {
      margin-left: 10rpx !important;
      justify-content: flex-start !important;
      bottom: 10rpx !important;
    }
  }
}

.swiper {
  height: 200rpx;
}

.swiper-item {
  display: block;
  height: 200rpx;
  line-height: 200rpx;
  text-align: center;
}

.activity-info {
  background-color: rgba(0, 0, 0, 0);
}

:deep(.uni-swiper__dots-box) {
  margin-left: 10rpx !important;
  justify-content: flex-start !important;
}

.vip-card-box {
  display: flex;
}

.activity-img {
  width: 100%;
  border-radius: 10px;
  // max-height: 200rpx;
}
</style>