<template>
 <view class="body">
  <view class="remark-container">
    <view class="remark-item">
      <view class="remark-item-text">请输入备注</view>
      <input class="remark-input" type="textArea" v-model="remarks" />
    </view>
    <view class="remark-item" v-for="(item, index) in commonRemarks" :key="index">
      <view class="remark-item-text">{{item}}</view>
    </view>
  </view>
 </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed, onUnmounted  } from 'vue'

// Data
const commonRemarks = ref([])
const remarks = ref('')
// Computed

// Fake Data
const fRemarks = [
  '不加冰','多加冰','不要奶',
]

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({

})
const onUnmounted = () => { 
  if(remarks.value){
    uni.setStorageSync('CURRENT-REMARK', remarks.value)
  }
}
// Lifecycle hooks
onMounted(() => {
 queryRemark()
})

// Watchers

// Methods
const queryRemark = () => { 
  commonRemarks.value = fRemarks
}
</script>

<style scoped lang="scss">
.body{
  padding: 10px;
}
.remark-container{
  display: flex;
  flex-wrap: wrap;
}
.remark-item{
  width: 50%;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.remark-item-text{
  font-size: 14px;
}

</style>