<template>
  <view class="context">
    <view class="feature-section">
      <feature-item title="退出登录" @toggle="handleLogout" />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import FeatureItem from '@/component/FeatureItem.vue'
// Data

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

// Watchers

// Methods
const handleLogout = () => {
  const info = getStoreUserInfo()
  if (!info) {
    uni.showToast({
      icon: 'error',
      title: '您还未登录'
    })
    setTimeout(() => uni.hideToast(), 1500)
  } else {
    uni.showModal({
      content: '确认退出登录？',
      success(res) {
        if (res.confirm) {
          uni.removeStorageSync('USER_INFO')
          uni.removeStorageSync('CURRENT_SHOP')
          logout().then(res => {
            uni.showToast({
              icon: 'success',
              title: '退出成功'
            })
            commonNavigate('/pages/home/index')
          }).finally(uni.hideToast())
        }
      }
    })
  }
}
</script>

<style scoped lang="scss">
.feature-section {
  padding: 30rpx;
  // background: #fafafa;
  margin-top: 20rpx;
  border-radius: 20rpx 20rpx 0 0;
}
  </style>