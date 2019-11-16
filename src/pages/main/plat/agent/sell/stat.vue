<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-销售管理" to="/plat/agent/sell" />
      <q-breadcrumbs-el label="在线售票销售统计" />
    </q-breadcrumbs>

    <div class="row q-mt-md">
      <div class="infoTitle">订单总数</div>
      <div class="text-grey-7">{{sumTotal.totalOrderNum}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">销售总额</div>
      <div class="text-grey-7">{{sumTotal.totalAmount}}</div>
    </div>
    <div class="infoGroupTitle q-mt-lg q-mb-xs">按门票统计</div>
    <q-table :data="sumTickets" :columns="columnsTickets" />

  </div>
</template>

<script>
export default {
  name: 'stat',
  data () {
    return {
      sumTotal: {},
      sumTickets: [],
      columnsTickets: [
        { name: 'ticketName', label: '票品', field: 'ticketName', align: 'left' },
        { name: 'gradeName', label: '票档', field: 'gradeName', align: 'left' },
        { name: 'ticketNum', label: '销售数', field: 'ticketNum', align: 'left' },
        { name: 'amount', label: '销售额', field: 'amount', align: 'left' }
      ]
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$axios.get('/v1/plat/sumSellOrder?projectId=' + this.$route.query.proId)
        .then(res => {
          this.sumTotal = res.data.data.sumTotal
          this.sumTickets = res.data.data.sumTickets
        })
    }
  }
}
</script>
