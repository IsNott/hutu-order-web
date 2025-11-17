<template>
	<view class="divider" :style="{'background':color}"/>
</template>

<script>
	export default {
		name: 'Divide',
    props: {
      color: {
        type: String,
        default: '#000000'
      }
    },

		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.divider {
		width: 100%;
		height: 1rpx;
	}
</style>