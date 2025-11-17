<template>
  <view class="header">
    <uni-swiper-dot class="uni-swiper-dot-box" :info="playImages" :current="current"
      mode="round" field="content" :dots-styles="dotStyle">
      <swiper class="swiper-box" @change="changeBanner" :current="current" :autoplay='true'>
        <swiper-item v-for="(item, index) in playImages" :key="index" @click="clickImage(item)">
          <image style="width: 100%;" :src="config.baseUrl + item.url"/>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
    <view class="top-info">
      <view class="title" @click="handleClickShopInfo">
        <view>{{currentShop.name}}</view>
        <uni-icons type="right" size="16"></uni-icons>
      </view>
      <view class="offer">
        <view class="offer-item" @click="clickOfferItem('1')">
          <view class="offer-item-desc">立即下单</view>
          <view class="offer-item-title">Order Now</view>
        </view>
        <view class="offer-item" @click="clickOfferItem('2')">
          <view class="offer-item-desc">预约点单</view>
          <view class="offer-item-title">Schedule</view>
        </view>
      </view>
    </view>
    <view class="activity-card">
      <uni-swiper-dot class="uni-swiper-dot-box" :info="playActImages" :current="actCurrent"
      mode="round" field="content" :dots-styles="actDotStyle">
      <swiper class="swiper-box" @change="changeActBanner" :current="actCurrent" :autoplay='true'>
        <swiper-item v-for="(item, index) in playActImages" :key="index" @click="clickImage(item)">
          <image style="width: 100%;" :src="config.baseUrl + item.url" />
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
    </view>

    <view style="margin-top: 20px;" v-if="activity.length > 0">
      <view class="activity-info" :key="index" v-for="act,index in activity">
        <image style="width: 100%;" :src="config.baseUrl + act.url" :style="act.style"/>
      </view>
    </view>

    <view style="padding:6px;margin: 0px 0px;text-align: center;font-size: 12px;color: gray;">
      —— Hutu-order ——
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { config } from '@/config/index'
const playImages = ref([])
const playActImages = ref([])
const current = ref(0)
const actCurrent = ref(0)
const currentShop = ref({
  name: '糊涂店（春熙路101号2铺面）',
  desc: 'hutu-order',
  address: '春熙路'
})
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
const vipCard = ref({})
// fake data
const img = [{
  url: '/static/1905083114506674177.png',
  navigation: '',
},
{
  url: '/static/1941046464679747586.png',
  navigation: '',
}
]

const playActivity = [{
  url: '/static/20251117170448.png',
  navigation: '',
  name: '优惠券'
},
{
  url: '/static/20251117170524.png',
  navigation: '',
  name: '优惠券'
}
]

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
// Data
const data = reactive({})

// Lifecycle hooks
onMounted(() => {
  getImage()
  getAct()
  getUserInfo()
})

// Methods
const clickOfferItem = (type) => {
  uni.navigateTo({
    url: '/pages/order/index?type=' + type
  })
}

const getImage = () => {
  playImages.value = img
}

const getAct = () => {
  playActImages.value = playActivity
  activity.value = playActivity
}

const getUserInfo = () => {
  vipCard.value = card
}

const handleClickShopInfo = () => {
  uni.navigateTo({
    url: '/pages/shopInfo/shopInfo'
  })
}

const changeBanner = (e) => {
  current.value = e.detail.current
}

const changeActBanner = (e) => {
  actCurrent.value = e.detail.current
}

const clickImage = (img) => {
  if(img.navigation){
    uni.navigateTo({
      url: img.navigation
    })
  }
}
// Watchers

</script>

<style scoped lang="scss">
.top-info{
  padding: 6px;
    background-color: white;
    border-radius: 10px;
    margin: 0px 20px;
    z-index: 1;
    /* margin-bottom: 200px; */
    position: relative;
    top: -26px;
}
.title{
  font-size: 12px;
  text-align: right;
  margin: 4px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.activity-card {
  margin: 0px 16px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.activity-info{
  margin: 10px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.offer{
  display: flex;
  justify-content: space-evenly;
  .offer-item{
    margin: 10px;
    background-color: #ffffff;
    padding: 20px 40px;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    // border: 1px solid #bdc3c7;
  }
  .offer-item-title{
    margin-bottom: 6px;
  }

  .offer-item-desc{
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 4px;
  }
}

:deep(.uni-swiper__dots-box){
    margin-left: 10px !important;
    justify-content: flex-start !important;
}

.vip-card-box{
  display: flex;
}

</style>