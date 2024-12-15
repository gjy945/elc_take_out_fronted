<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},

		created() {
			// 这里可以在应用启动时就调用Vuex的action来预加载数据
			this.$store.dispatch('fetchDataAddress')
		},
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";

	.container {
		width: 100%;
		height: 100%;
		background-color: rgb(245, 245, 246);
		position: absolute;
	}
</style>