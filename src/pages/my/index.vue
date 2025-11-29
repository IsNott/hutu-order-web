<template>
  <view class="body">
    <view class="top-info box">
      <view class="info-box box">
        <view class="avatar">
          <image src="@/static/image/avatar/default.jpg" mode="widthFix" class="avatar-img" />
        </view>
        <view class="user-name">
          {{ userInfo ? userInfo.name : '点击登录' }}
        </view>
      </view>
    </view>
    
    <!-- 积分卡片 -->
    <view class="integral-card box"> 
      <view class="card-content">
        <view class="integral-info">
          <view class="integral-label">
            <uni-icons type="vip" color="white" size="24"></uni-icons>
            {{userInfo ? userInfo.level : '登录查看积分' }}
            </view>
          <view class="integral-value">{{ userInfo ? userInfo.ponit : 0 }}</view>
        </view>
        <view class="progress-section">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: progressPercentage + '%' }"></view>
          </view>
          <view class="progress-text">
            <!-- <text>还需{{ userInfo.nextLevelNeed }}积分升级</text> -->
          </view>
        </view>
      </view>
    </view>
    
    <!-- 功能按钮 -->
    <view class="feature-list box"> 
      <view class="feature-item" v-for="(item, index) in visibleFeatures" :key="index">
        <view class="feature-icon">
          <uni-icons :type="item.icon" :color="item.color" size="30"></uni-icons>
        </view>
        <view class="feature-title">{{ item.title }}</view>
      </view>
      <view class="feature-expand-btn" @click="toggleExpand">
        <uni-icons
          :type="isExpanded ? 'up' : 'down' "
          color=""
          size="20"
        />
      </view>
    </view>

    <!-- 活动卡 -->
    <view class="activity-list" v-if="activity.length > 0">
      <view class="activity-info box" :key="index" v-for="act, index in activity">
        <image class="activity-img" :src="config.baseUrl + act.url" mode="widthFix" />
      </view>
    </view>
    <no-more text="Hutu-order"/>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import NoMore from '@/component/NoMore.vue'
import { config } from '@/config/index'

// Data
const userInfo = ref(null)
const featureBtns = ref([])
const activity = ref([])
const isExpanded = ref(false)


// 积分相关数据
const nextLevelNeed = ref(420) // 还需多少积分升级
const progressPercentage = computed(() => {
  if(userInfo.value){
    return Math.round(userInfo.value.ponit / (userInfo.value.ponit + nextLevelNeed.value) * 100)
  }else{
    return 0
  }
})

const visibleFeatures = computed(() => {
  if (isExpanded.value) {
    return featureBtns.value
  } else {
    return featureBtns.value.slice(0, 4)
  }
})

// Fake data
const myInfo = {
  name: 'Hutu-Order',
  phone: '12345678901',
  email: '<EMAIL>',
  address: '中国香港',
  ponit: 1580,
  level: '黄铜会员',
  nextLevelNeed: 420
}

const feature = [
  {
    title: '我的订单',
    icon: 'chatbubble',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '我的收藏',
    icon: 'heart',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '我的会员',
    icon: 'vip',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '我的钱包',
    icon: 'wallet',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '赞赏作者',
    icon: 'hand-up',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '关于我们',
    icon: 'info',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '购买版权',
    icon: 'checkmarkempty',
    navigation: '/pages/order/index',
    color: '#007AFF'
  },
  {
    title: '收藏项目',
    icon: 'star',
    navigation: '/pages/order/index',
    color: '#007AFF'
  }
]

const fakeActivity = [
  {
    url: '/static/vip-act.png',
    title: '会员充值',
    navigation: ''
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
  getUserInfo()
  getActivity()
  getFeature()
})

// Methods
const getUserInfo = () => {
  userInfo.value = myInfo
}

const getActivity = () => {
  activity.value = fakeActivity
}

const getFeature = () => {
  featureBtns.value = feature
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
// Watchers

</script>

<style scoped lang="scss">
.body {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  position: relative;
}

.box{
  padding: 20rpx;
  box-sizing: border-box;
}

.top-info{
  background-image: url('http://localhost:10220/static/back.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 10rpx;
  height: 30vh; /* 占据父容器高度的30% */
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 积分卡片样式 */
.integral-card {
  position: relative;
  z-index: 10;
  margin-top: -8vh; /* 向上移动，实现重叠效果 */
  // padding: 0 30rpx;
  
  .card-content {
    background: linear-gradient(135deg, #1c308b 0%, #764ba2 100%);
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
    height: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .integral-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .integral-label {
      font-size: 34rpx;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
    }
    
    .integral-value {
      font-size: 30rpx;
      color: white;
      font-weight: bold;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
    }
  }
  
  .progress-section {
    .progress-bar {
      width: 100%;
      height: 16rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10rpx;
      overflow: hidden;
      margin-bottom: 15rpx;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffffff, #c7c0f0);
        border-radius: 10rpx;
        transition: width 0.5s ease;
        box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.5);
      }
    }
    
    .progress-text {
      text-align: left;
      
      text {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.feature-expand-btn{
  width: 100%;
  text-align: center;
  padding: 10rpx;
}

.info-box{
  display: flex;
  align-items: center;
  
  .avatar{
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border: 4rpx solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .avatar-img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  
  .user-name{
    font-size: 36rpx;
    font-weight: bold;
    margin-left: 30rpx;
    color: white;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
  }
}

.feature-list {
  width: 100%;
  background-color: white;
  border-radius: 20rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-wrap: wrap;
  
  .feature-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx 0;
    
    .feature-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background-color: #f8f8f8;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15rpx;
      
      icon {
        color: #ff6b35;
      }
    }
    
    .feature-title {
      font-size: 24rpx;
      color: #333;
      text-align: center;
    }
  }
}

.activity-info {
  background-color: rgba(0, 0, 0, 0);
}

.activity-img {
  width: 100%;
  border-radius: 10px;
  // max-height: 200rpx;
}
</style>