<template>
  <view class="body">
    <uni-swiper-dot class="swiper" :info="item.images" :current="current" mode="round" field="content"
        :dots-styles="dotStyle">
        <swiper class="swiper-box" @change="changeBanner" :current="current" :autoplay='true'>
          <swiper-item v-for="(image, index) in item.images" :key="index">
            <image class="banner-image" :src="config.baseUrl + image.url"/>
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    <view class="content">
      <view class="content-scroll" >
        <view class="content-title">
          <view class="title-section">
            <view class="title">{{ item.itemName }}</view>
            <view class="price">¥{{ item.itemPrice }}</view>
          </view>
        </view>

        <view class="description-section" v-if="item.description">
          <view class="section-title">商品简介</view>
          <view class="description">{{ item.description }}</view>
        </view>

        <view class="sku-section" v-if="item.skuSpecs && item.skuSpecs.length > 0">
          <view class="section-title">规格选择</view>
          <view class="sku-group" v-for="(sku, skuIndex) in item.skuSpecs" :key="skuIndex">
            <view class="sku-label">{{ sku.specLabel }}
              <text v-if="sku.multi">(可多选)</text>
            </view>
            <view class="sku-options">
              <view class="sku-option" v-for="(option, optionIndex) in sku.skuOptionList" :key="optionIndex" :class="{
                'disabled': option.nowDisabled,
                'selected': isSkuOptionSelected(sku, option)
              }" @click="selectSkuOption(sku, option)">
                {{ option.optionLabel }}
                <view class="additional-price"
                  :class="{ 'disabled': option.nowDisabled, 'selected': isSkuOptionSelected(sku, option) }"
                  v-if="option.additionalPrice != null && option.additionalPrice > 0">
                  +¥{{ option.additionalPrice ? option.additionalPrice : 0 }}
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="action-section">
          <view class="selected-info">
            <view class="price-count">
              <view class="total-price">¥{{ countPrice }}</view>
              <!-- <view class="count">x{{ count }}</view> -->
              <view class="btn-group">
            <view class="count-control">
              <view class="count-btn minus" @click="count > 1 ? count-- : null">-</view>
              <view class="count-number">{{ count }}</view>
              <view class="count-btn plus" @click="count++">+</view>
            </view>
          </view>
            </view>
            <view class="selected-options">
              <view class="selected-option" v-for="(option, index) in selectedSkuOptions" :key="index">
                {{ option.optionLabel }}
              </view>
              <view class="no-options" v-if="selectedSkuOptions.length === 0">未选择商品规格</view>
            </view>
          </view>
          <view class="button-group">
            <view class="action-button add-cart" :class="{ 'disabled': !canAddToCart }" @click="handleAddToCart">
              加入购物车
            </view>
            <view class="action-button buy-now" :class="{ 'disabled': !canAddToCart }" @click="handleBuyNow">
              立即购买
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { config } from '@/config/index'
import { onLoad } from '@dcloudio/uni-app'
import { commonNavigate } from '../../utils/CommonUtils'
import { ItemDetailAPI } from './api'
import { submitOrder } from '@/utils/CommonUtils'
// Data
const id = ref()
const item = ref({})
const current = ref(0)
const dotStyle = {
  bottom: 30,
  backgroundColor: 'white',
  selectedBackgroundColor: 'white',
  border: '',
  selectedBorder: ''
}
const count = ref(1)
const selectedSkuOptions = ref([])
const pickUpType = ref('')
const orderType = ref('')
// Computed
const countPrice = computed(() => {
  return item.value.itemPrice * count.value + selectedSkuOptions.value.reduce((acc, option) => acc + (option.additionalPrice || 0), 0)
})

const canAddToCart = computed(() => {
  if (!item.value.skus || item.value.skus.length === 0) return true
  return item.value.skus.every(sku => {
    return selectedSkuOptions.value.some(option => option.parentId == sku.id)
  })
})

// Emits
const emit = defineEmits([
  'add-to-cart'
])

// Props
const props = defineProps({

})

// Lifecycle hooks
onMounted(() => {
  getItem()
})
onLoad((opt) => {
  id.value = opt.id
  pickUpType.value = opt.pickUpType
  orderType.value = opt.orderType
})
// Watchers

// Methods
const getItem = () => {
  ItemDetailAPI.details(id.value).then(res => {
    item.value = res.data
  })
}

const changeBanner = (e) => {
  current.value = e.detail.current
}

const selectSkuOption = (sku, option) => {
  if (option.disabled) return
  if (selectedSkuOptions.value.includes(option)) {
    selectedSkuOptions.value.splice(selectedSkuOptions.value.indexOf(option), 1)
    return
  }
  if (sku.multi) {
    selectedSkuOptions.value.push(option)
  } else {
    selectedSkuOptions.value = selectedSkuOptions.value.filter(item => item.specId != sku.id)
    selectedSkuOptions.value.push(option)
  }
}

const isSkuOptionSelected = (sku, option) => {
  const selectedOptions = selectedSkuOptions.value.filter(item => item.specId == sku.id)
  return selectedOptions.includes(option)
}

const handleAddToCart = () => {
  if (!canAddToCart.value) return
  console.log('加入购物车')
  // 加入购物车逻辑
  const cartItem = {
    id: item.value.id,
    name: item.value.itemName,
    cover: item.value.coverUrl,
    price: countPrice.value,
    count: count.value,
    skus: selectedSkuOptions.value
  }
  console.log(JSON.stringify(cartItem));
  ItemDetailAPI.addToPackage(cartItem).then(res => {
    uni.showToast({
      icon: 'success',
      title: '加入购物车成功'
    })
    commonNavigate('/pages/order/index')
  })
}

const handleBuyNow = () => {
  if (selectedSkuOptions.value.length <= 0) {
    uni.showToast({
      title: '请选择商品规格',
      icon: 'none'
    })
    return
  }
  const cartItem = {
    id: item.value.id,
    name: item.value.itemName,
    cover: item.value.coverUrl,
    price: countPrice.value,
    count: count.value,
    skus: selectedSkuOptions.value
  }
  submitOrder(orderType.value, pickUpType.value, [cartItem])
  
}
</script>

<style scoped lang="scss">
.body {
  height: 100vh;
  display: flex;
  flex-direction: column;
}


.swiper-box {
    height: 30vh;
    width: 100%;
    z-index: 1;
    position: relative;

  }

  .banner-image {
    width: 100%;
    height: 100%;
    display: block;
  }

.content {
  width: 100%;
  height: 72vh;
  background-color: white;
  border-radius: 40rpx 40rpx 0 0;
  margin-top: -20rpx;
  position: relative;
  z-index: 100;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.content-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;

  .title-section {
    flex: 1;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }

    .price {
      font-size: 32rpx;
      font-weight: bold;
      color: #8B7355;
    }
  }
}

.btn-group {
    .count-control {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 20rpx;
      padding: 8rpx;

      .count-btn {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        font-weight: bold;
        color: #8B7355;
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

        &.minus {
          color: #999;
        }

        &.plus {
          color: #8B7355;
        }
      }

      .count-number {
        margin: 0 20rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        min-width: 60rpx;
        text-align: center;
      }
    }
  }

.description-section {
  margin-bottom: 40rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .description {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.sku-section {
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .sku-group {
    margin-bottom: 30rpx;

    .sku-label {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .sku-options {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .sku-option {
        padding: 16rpx 32rpx;
        background: #f8f8f8;
        border-radius: 20rpx;
        font-size: 26rpx;
        color: #333;
        border: 2rpx solid transparent;
        position: relative;

        &.selected {
          background: #8B7355;
          color: white;
          border-color: #8B7355;
        }

        &.disabled {
          background: #f0f0f0;
          color: #ccc;
          text-decoration: line-through;
        }

        .additional-price {
          font-size: 20rpx;
          color: #8B7355;
          margin-top: 4rpx;

          &.selected {
            color: rgba(255, 255, 255, 0.8);
          }

          &.disabled {
            color: #ccc;
          }
        }
      }
    }
  }
}

.action-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  border-top: 1rpx solid #f0f0f0;

  .selected-info {
    margin-bottom: 20rpx;

    .price-count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;

      .total-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #8B7355;
      }

      .count {
        font-size: 28rpx;
        color: #666;
      }
    }

    .selected-options {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;

      .selected-option {
        background: #f8f4f0;
        color: #8B7355;
        padding: 8rpx 16rpx;
        border-radius: 16rpx;
        font-size: 24rpx;
        border: 1rpx solid #e8d5c4;
      }

      .no-options {
        font-size: 26rpx;
        color: #999;
        font-style: italic;
      }
    }
  }

  .button-group {
    display: flex;
    gap: 20rpx;

    .action-button {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      font-weight: bold;
      transition: all 0.3s ease;

      &.add-cart {
        background: #f8f4f0;
        color: #8B7355;
        border: 2rpx solid #e8d5c4;

        &:not(.disabled):active {
          background: #e8d5c4;
          transform: scale(0.98);
        }
      }

      &.buy-now {
        background: linear-gradient(135deg, #8B7355 0%, #A58C6D 100%);
        color: white;

        &:not(.disabled):active {
          opacity: 0.9;
          transform: scale(0.98);
        }
      }

      &.disabled {
        background: #f5f5f5;
        color: #ccc;
        border: 2rpx solid #e0e0e0;
        cursor: not-allowed;
      }
    }
  }
}

.content-scroll {
  height: 100%;
  padding: 30rpx;
  padding-bottom: 240rpx;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>