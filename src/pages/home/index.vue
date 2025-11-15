<template>
  <view class="header">
    <uni-swiper-dot class="uni-swiper-dot-box" @clickItem=clickImage :info="playImages" :current="current"
      mode="default" :dots-styles="dotStyle" field="content">
      <swiper class="swiper-box" @change="changeBanner" :current="current" :autoplay='true'>
        <swiper-item v-for="(item, index) in info" :key="index">
          <view class="swiper-item" :class="'swiper-item' + index">
            <image :src="config.baseUrl + item.url" mode="aspectFit"></image>
          </view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { config } from '@/config/index'
const playImages = ref([])
const playIndex = ref(0)
const current = ref(0)
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
})

// Methods
const getImage = () => {
  playImages.value = img
}
const clickImage = (img) => {

}
const changeBanner = (e) => {
  current.value = e.detail.current
}
// Watchers

</script>

<style scoped lang="scss"></style>