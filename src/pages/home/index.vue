<template>
  <scroll-view class="body">
    <uni-swiper-dot class="uni-swiper-dot-box" :info="playImages" :current="current" mode="round" field="content"
      :dots-styles="dotStyle">
      <swiper class="swiper-box" @change="changeBanner" :current="current" :autoplay='true'>
        <swiper-item v-for="(item, index) in playImages" :key="index" @click="clickImage(item)">
          <image style="width: 100%;" :src="config.baseUrl + item.url" />
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
    <view class="top-info box">
      <view class="title" @click="handleClickShopInfo">
        <view>{{ currentShop.shopName }}</view>
        <uni-icons type="right" size="16"></uni-icons>
      </view>
      <view class="offer">
        <view class="offer-item" @click="clickOfferItem('1')">
          <view class="offer-item-desc">立即下单</view>
          <view class="offer-item-title">Order Now</view>
        </view>
        <view class="divider"></view>
        <view class="offer-item" @click="clickOfferItem('2')">
          <view class="offer-item-desc">预约点单</view>
          <view class="offer-item-title">Schedule</view>
        </view>
      </view>
    </view>
    <!-- 轮播活动卡 -->
    <view class="activity-card box">
      <uni-swiper-dot :info="playActImages" :current="actCurrent" mode="round" field="content"
        :dots-styles="actDotStyle">
        <swiper class="swiper" @change="changeActBanner" :current="actCurrent" :autoplay='true' next-margin="20rpx">
          <swiper-item class="swiper-item" v-for="(item, index) in playActImages" :key="index"
            @click="clickImage(item)">
            <image class="swiper-image" :src="config.baseUrl + item.url" mode="widthFix" />
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    </view>

    <!-- 活动列表 -->
    <view class="activity-list" v-if="activity.length > 0">
      <view class="activity-info box" :key="index" v-for="act, index in activity">
        <image class="activity-img" :src="config.baseUrl + act.url" mode="widthFix"/>
      </view>
    </view>

    <view class="footer">
      —— Hutu-order ——
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { config } from '@/config/index'
import { HomeAPI } from '@/pages/home/api'
import {commonNavigate} from '@/utils/CommonUtils'
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
  getShopInfo()
})

// Methods
const clickOfferItem = (type) => {
  commonNavigate('/pages/order/index?type=' + type)
}

const getImage = () => {
  HomeAPI.getPlayImage(0).then(res => {
    playImages.value = res.data
  })
}

const getAct = () => {
  HomeAPI.getPlayImage(1).then(res => {
    playActImages.value = res.data
  })
  HomeAPI.getPlayImage(2).then(res => {
    activity.value = res.data
  })  
}

const getShopInfo = () => {
  const val = uni.getStorageSync('current_shop')
  if (val) {
    currentShop.value = val
    return
  }
  let local = {}
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
  HomeAPI.queryShopInfo({}).then(res=> {
    if(res.data.length > 0){
      currentShop.value = res.data[0]
      uni.setStorageSync('current_shop', currentShop.value)
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
  if (img.navigation) {
    commonNavigate(img.navigation)
  }
}
// Watchers

</script>

<style scoped lang="scss">
.body{
}

.box {
  margin: 20rpx 30rpx;
  border-radius: 10rpx;
}

.top-info {
  padding: 6rpx;
  background-color: white;
  border-radius: 10rpx;
  z-index: 1;
  position: relative;
  top: -40rpx;
  margin-top: 0rpx;
}

.divider {
 border: 1px solid rgb(216, 216, 216);
 height: 80rpx;
}

.title {
  font-size: 20rpx;
  text-align: right;
  margin: 10rpx 0rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.activity-card {
  overflow: hidden;
  height: 25%;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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

.offer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .offer-item {
    margin: 10rpx;
    // background-color: #3C2A21 ;
    padding: 20rpx 40rpx;
    // border-radius: 4rpx;
    font-size: 30rpx;
    text-align: center;
  }

  .offer-item-title {
    margin-bottom: 6rpx;
  }

  .offer-item-desc {
    font-weight: bold;
    font-size: 38rpx;
    margin-bottom: 4rpx;
  }
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

.footer {
  padding: 6rpx;
  margin: 0rpx 0rpx;
  text-align: center;
  font-size: 22rpx;
  color: gray;
}
</style>