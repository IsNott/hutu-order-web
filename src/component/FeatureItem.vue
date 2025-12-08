<template>
  <view class="feature-item" @click="handleToggle">
    <view class="feature-left">
      <uni-icons :type="leftIcon" :color="leftIconColor || '#8B7355'" :size="leftIconSize" />
      <text class="feature-title">{{ title }}</text>
    </view>
    <view class="feature-right">
      <text class="feature-value" :class="{ 'placeholder': !active }">
        {{ placeholder }}
      </text>
      <uni-icons :type="rightIcon" :color="rightIconColor || '#999'" :size="rightIconSize" />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
// Data

// Computed

// Emits
const emit = defineEmits([
  'toggle'
])

// Props
const props = defineProps({
  leftIcon: {
    type: String,
    default: ''
  },
  leftIconColor: {
    type: String,
    default: ''
  },
  leftIconSize: {
    type: Number,
    default: 20
  },
  placeholder: {
    type: String,
    default: ''
  },
  activePlaceholder: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  },
  rightIcon: {
    type: String,
    default: 'right'
  },
  rightIconColor: {
    type: String,
    default: ''
  },
  rightIconSize: {
    type: Number,
    default: 20
  },
  title: {
    type: String,
    default: ''
  }
})

// Lifecycle hooks
onMounted(() => {

})

// Watchers

// Methods
const handleToggle = () => {
  emit('toggle')
}

</script>

<style scoped lang="scss">
.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .feature-left {
    display: flex;
    align-items: center;

    .feature-title {
      font-size: 28rpx;
      color: #333;
      margin-left: 12rpx;
    }
  }

  .feature-right {
    display: flex;
    align-items: center;

    .feature-value {
      font-size: 28rpx;
      color: #333;
      max-width: 300rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 12rpx;

      &.placeholder {
        color: #999;
      }
    }
  }

  &:active {
    opacity: 0.7;
  }
}
</style>