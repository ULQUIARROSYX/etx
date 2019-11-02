<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="渠道管理" icon="dashboard" to="/host/agent" />
      <q-breadcrumbs-el label="渠道管理" icon="dashboard" to="/host/agent" />
    </q-breadcrumbs>
    <div class="fixed-center text-center">
      <p>
        <q-icon name="sentiment_very_dissatisfied" size="150px" color="info" />
      </p>
      <p class="text-info">抱歉，此页面暂无内容...<strong>(404)</strong></p>
      <q-btn color="secondary" style="width:200px;" @click="$router.push('/')">返回首页</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editAgent',
  data: () => ({
    addShow: true,
    form: {}
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取渠道信息
    getInfo () {
      if (this.$route.query.agentId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getAgent/' + this.$route.query.agentId)
          .then(res => { this.form = res.data.data })
      }
    }
  }
}
</script>
