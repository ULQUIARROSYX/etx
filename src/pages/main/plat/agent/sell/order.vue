<template>
  <div style="width: 1000px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-销售管理" to="/plat/agent/sell" />
      <q-breadcrumbs-el label="在线售票订单查询" />
    </q-breadcrumbs>

    <!-- 订单查询 -->
    <div class="row justify-between items-center q-mb-sm">
      <div class="col infoGroupTitle">订单查询</div>
      <q-btn color="secondary" icon="search" glossy label="点击查询" @click="companyMsg($route.query.proId)" />
    </div>
    <q-table :data="orders" :columns="columns" />
  </div>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {
      orders: [],
      columns: [
        { name: 'orderNo', label: '订单号', field: 'orderNo', align: 'left' },
        { name: 'content', label: '内容', field: 'content', align: 'left' },
        { name: 'orderAmount', label: '金额', field: 'orderAmount', align: 'left' },
        { name: 'status', label: '状态', field: 'status', align: 'left' },
        { name: 'smsPhone', label: '电子票手机', field: 'smsPhone', align: 'left' },
        { name: 'cdate', label: '订单时间', field: 'cdate', align: 'left' }
      ]
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$axios.get('/v1/plat/getSellOrder?projectId=' + this.$route.query.proId)
        .then(res => {
          this.orders = res.data.data
          console.log(this.orders[0])
        })
    }
  }
}
</script>
