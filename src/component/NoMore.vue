<template>
 <div class="no-more">
  —— {{text}} ——
 </div>
</template>

<script setup>
defineProps({
  text: {
    default: () => '暂无更多信息'
  }
})
</script>

<style scoped lang="scss">
.no-more{
  text-align: center;
  padding: 30rpx;
  font-size: 26rpx;
  color: #666;
  margin: auto;
}
</style>