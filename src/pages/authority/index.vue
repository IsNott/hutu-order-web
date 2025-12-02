<template>
  <view class="page">
    <view class="img-box">
      <image class="img" src="@/static/image/coffee.png" mode="aspectFit" />
    </view>
    <view class="btn-box">
      <button class="auth-btn" size="default" :disabled="!clickRadio" open-type="getPhoneNumber" @getphonenumber="handleAuthWxInfo"
        type="primary">微信授权登录</button>
      <view class="click-radio" @click="clickRadio = !clickRadio">
        <radio :checked="clickRadio" color="#8B7355" />
        <text class="radio-text">我同意使用微信授权信息进行点单操作</text>
      </view>
      <view @click="handleNotLogin" class="not-login">
        <text>暂不登录，直接点单</text>
        <uni-icons type="right" color="#999" size="16" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { commonNavigate, storeUserInfo } from '@/utils/CommonUtils'
import { AuthAPI } from './api'
// Data
const callBack = ref(null)
const clickRadio = ref(false)
// Computed

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  
})
onLoad((options) => {
  callBack.value = options.to
  console.log('callBack', callBack.value);
  
})

// Watchers

// Methods
const handleAuthWxInfo = (info) => {
  const detail = info.detail;
  if (detail.errMsg === 'getPhoneNumber:ok') {
    AuthAPI.loginByPhone(detail).then(res => {
      storeUserInfo(res.data)
      navigateCallBack()
    })
  }
}

const navigateCallBack = () => {
  console.log(callBack.value);
  if (callBack.value) commonNavigate(callBack.value)
  else uni.navigateBack({ delta: 0, animationType: 'slide-out-right' })
}

const handleNotLogin = () => {
  const data = {
    userInfo: {
      nickName: '游客',
      avatarUrl: '@/static/image/default-avatar.png',
      isTourist: true
    },
  }
  storeUserInfo(data)
  navigateCallBack()
}
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8F4F0 100%);
  padding: 40rpx;
  box-sizing: border-box;
}

.img-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 60vh;
  
  .img {
    width: 300rpx;
    height: 300rpx;
    animation: float 3s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

.btn-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: 10vh;
  gap: 30rpx;
  
  .auth-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
    color: white;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(139, 115, 85, 0.3);
    
    &[disabled] {
      background: #E0D8CF;
      color: #B5A997;
      box-shadow: none;
    }
    
    &:not([disabled]):active {
      transform: scale(0.98);
      opacity: 0.9;
    }
  }
  
  .click-radio {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 10rpx;
    
    .radio-text {
      font-size: 26rpx;
      color: #666;
    }
    
    &:active {
      opacity: 0.8;
    }
  }
  
  .not-login {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 20rpx;
    
    text {
      font-size: 24rpx;
      color: #999;
    }
    
    &:active {
      opacity: 0.7;
    }
  }
}

:deep(.uni-radio-input) {
  width: 32rpx !important;
  height: 32rpx !important;
  border-radius: 50% !important;
  
  &.uni-radio-input-checked {
    background-color: #8B7355 !important;
    border-color: #8B7355 !important;
    
    &::before {
      font-size: 20rpx !important;
    }
  }
}
</style>