<template>
  <view class="cart-list">
    <view :key="item.id" v-for="(item, index) in itemInfo" class="cart-detail-item">
      <view class="cart-detail-item-content">
        <view class="cart-detail-item-content-left">
          <image :src="item.cover || '/static/image/default-coffee.png'" mode="aspectFill" class="item-image" />
        </view>
        <view class="cart-detail-item-content-right">
          <view class="cart-detail-item-content-right-header">
            <view class="title">{{ item.name }}</view>
            <view class="price">¥ {{ item.price }}</view>
          </view>
          <view class="cart-detail-item-content-right-body">
            <view class="sku">
              {{ getSkuStr(item) }}
            </view>
          </view>
          <view class="cart-detail-item-content-right-footer">
            <view class="count">×{{ item.count }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'

// Data

// Computed

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({
  itemInfo: {
    type: Array,
    default: () => []
  }
})

// Lifecycle hooks
onMounted(() => {

})

// Watchers

// Methods
const getSkuStr = (item) => {
  return item.skus.map(sku => {
    return `${sku.label}`
  }).join('/')
}
</script>

<style scoped lang="scss">
.cart-list {
  padding: 30rpx;

  .cart-detail-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .cart-detail-item-content {
      display: flex;

      .cart-detail-item-content-left {
        margin-right: 20rpx;

        .item-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 12rpx;
          background-color: #f8f4f0;
        }
      }

      .cart-detail-item-content-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;

        .cart-detail-item-content-right-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16rpx;

          .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            flex: 1;
            margin-right: 20rpx;
          }

          .price {
            font-size: 32rpx;
            font-weight: bold;
            color: #8B7355;
            white-space: nowrap;
          }
        }

        .cart-detail-item-content-right-body {
          margin-bottom: 20rpx;

          .sku {
            font-size: 24rpx;
            color: #666;
            line-height: 1.5;
            margin-bottom: 12rpx;
            // width: 80%;
          }

          .sku-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 12rpx;

            .sku-tag {
              font-size: 24rpx;
              color: #666;
              background: #f5f5f5;
              padding: 4rpx 12rpx;
              border-radius: 16rpx;

              text {
                color: #8B7355;
                font-size: 20rpx;
                margin-left: 4rpx;
              }
            }
          }
        }

        .cart-detail-item-content-right-footer {
          position: absolute;
          right: 0;
          bottom: 0;

          .count {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
            min-width: 60rpx;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>