<template>
  <view class="page">
    <view class="header box">
      <view class="search-box">
        <view class="search-input">
          <input type="text" placeholder="请输入商品名称" v-model="keyWord" class="search-input-field" @confirm="query" />
          <view class="search-icon" @click="query">
            <uni-icons type="search" size="20" color="white"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view class="history-section" v-if="searchList.length > 0 && !keyWord">
        <view class="section-header">
          <view class="section-title">历史搜索</view>
          <view class="clear-btn" @click="clearHistory">清空</view>
        </view>
        <view class="tags-container">
          <view class="tag-item" v-for="(item, index) in searchList" :key="index" @click="selectHistory(item)">
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐搜索 -->
      <view class="recommend-section" v-if="recommandSearchWord.length > 0 && !keyWord">
        <view class="section-header">
          <view class="section-title">推荐搜索</view>
        </view>
        <view class="tags-container">
          <view class="tag-item" v-for="(item, index) in recommandSearchWord" :key="index" @click="selectRecommend(item)">
            <text>{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="content" v-if="itemInfo.length > 0">
      <scroll-view class="menu-list" scroll-y :show-scrollbar="false">
        <view class="result-header">
          <view class="result-title">搜索结果</view>
          <view class="result-count">共{{ itemInfo.length }}个商品</view>
        </view>
        <view class="menu-catalog-section">
          <view v-for="menu in itemInfo" :key="menu.id" class="menu-item" @click="goToDetail(menu)">
            <image class="menu-image" :src="menu.cover || '/static/image/default-coffee.png'" mode="aspectFill"></image>
            <view class="menu-item-info">
              <view class="menu-item-name">{{ menu.name }}</view>
              <view class="menu-item-desc">{{ menu.description }}</view>
              <view class="menu-item-price">¥{{ menu.price }}</view>
            </view>
            <view class="menu-item-action">
              <button class="add-btn" @click.stop="goToDetail(menu)">
                <uni-icons type="plusempty" size="18" color="white"></uni-icons>
              </button>
            </view>
          </view>
        </view>
        <no-more />
      </scroll-view>
    </view>

    <!-- 无搜索结果时的提示 -->
    <view class="empty-tips" v-if="keyWord && itemInfo.length === 0 && itemInfo.length !== undefined">
      <image class="empty-icon" src="/static/image/search-empty.png" mode="aspectFit"></image>
      <view class="empty-text">未找到相关商品</view>
      <view class="empty-desc">换个关键词试试吧</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { commonNavigate } from '@/utils/CommonUtils'
import { CacheKey, OrderType, PickUpType } from '@/enums/HutuEnums'
import { onLoad } from '@dcloudio/uni-app'
import { orderAPI } from '../api'
import  NoMore  from '@/component/NoMore'
// Data
const keyWord = ref('')
const searchList = ref([])
const recommandSearchWord = ref([])
const itemInfo = ref([])
const orderType = ref(OrderType.NOW)
const pickUpType = ref(PickUpType.SELF)
const user = ref(uni.getStorageSync(CacheKey.USER_INFO) || '')
// Computed
// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  querySearchList(),
  queryCommandSearchWord()
})
onLoad((opt) => {
  orderType.value = opt.orderType
  pickUpType.value = opt.pickUpType
})

// Watchers

// Methods
const querySearchList = () => {  
  if(user.value && !user.value.isTourist){
    orderAPI.queryMySeachHistory(user.value.id).then(res => {
      searchList.value = res.data
    })
  }
}

const queryCommandSearchWord = () => {
  const shop = uni.getStorageSync(CacheKey.CURRENT_SHOP)
  if(shop){
    orderAPI.queryRecommendMenu(shop.id).then(res => {
      recommandSearchWord.value = res.data
    })
  }
}

const query = () => {
  if (!keyWord.value.trim()) return
  // 保存搜索记录
  if (!searchList.value.includes(keyWord.value)) {
    searchList.value.unshift(keyWord.value)
      if(user.value && !user.value.isTourist){
        orderAPI.saveSearchHistory({
        userId: user.id,
        keyword: keyWord.value
      })
    }
  }
  const shop = uni.getStorageSync(CacheKey.CURRENT_SHOP)
  orderAPI.queryMenu({ keyword: keyWord.value, shopId: shop.id }).then(res => { 
    itemInfo.value = res.data
  })
}

const goToDetail = (item) => {
  commonNavigate('/pages/item-detail/index?id=' + item.id + '&orderType=' + orderType.value + '&pickUpType=' + pickUpType.value)
}

const selectHistory = (keyword) => {
  keyWord.value = keyword
  query()
}

const selectRecommend = (keyword) => {
  keyWord.value = keyword
  query()
}

const clearHistory = () => {
  searchList.value = []
  orderAPI.clearSearchHistory(user.value.id)
}
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.box {
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.header {
  padding: 30rpx;
  margin: 20rpx 20rpx 0;

  .search-box {
    margin-bottom: 30rpx;

    .search-input {
      position: relative;
      display: flex;
      align-items: center;

      .search-input-field {
        flex: 1;
        height: 80rpx;
        background: #f8f4f0;
        border-radius: 40rpx;
        padding: 0 80rpx 0 30rpx;
        font-size: 28rpx;
        border: 2rpx solid transparent;
        transition: border-color 0.3s;

        &::placeholder {
          color: #999;
        }

        &:focus {
          border-color: #8B7355;
        }
      }

      .search-icon {
        position: absolute;
        right: 30rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 60rpx;
        height: 60rpx;
        background: #8B7355;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
          opacity: 0.8;
          transform: translateY(-50%) scale(0.95);
        }
      }
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }

  .clear-btn {
    font-size: 24rpx;
    color: #999;
    padding: 8rpx 16rpx;

    &:active {
      color: #8B7355;
    }
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .tag-item {
    background: #f8f4f0;
    border-radius: 20rpx;
    padding: 10rpx 14rpx;
    font-size: 22rpx;
    color: #666;
    border: 1rpx solid #e8d5c4;

    &:active {
      background: #e8d5c4;
      color: #8B7355;
    }
  }
}

.history-section,
.recommend-section {
  margin-bottom: 30rpx;
}

.content {
  flex: 1;
  margin: 20rpx 20rpx 0;
  overflow-y: hidden;
  .menu-list {
    height: 100%;
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    box-sizing: border-box;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .result-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .result-count {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.menu-catalog-section {
  .menu-item {
    display: flex;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #fafafa;
    border-radius: 20rpx;
    border: 1rpx solid #f0f0f0;

    .menu-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 16rpx;
      margin-right: 30rpx;
      background-color: #f8f4f0;
    }

    .menu-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .menu-item-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }

      .menu-item-desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 20rpx;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .menu-item-price {
        font-size: 32rpx;
        font-weight: bold;
        color: #8B7355;
      }
    }

    .menu-item-action {
      display: flex;
      align-items: flex-end;

      .add-btn {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        font-size: 28rpx;
        font-weight: bold;
        box-shadow: 0 4rpx 12rpx rgba(139, 115, 85, 0.3);

        &:active {
          opacity: 0.8;
          transform: scale(0.95);
        }
      }
    }
  }
}

.empty-tips {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 16rpx;
  }

  .empty-desc {
    font-size: 24rpx;
    color: #ccc;
  }
}
</style>