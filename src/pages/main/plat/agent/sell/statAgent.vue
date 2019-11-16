<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-销售管理" to="/plat/agent/sell" />
      <q-breadcrumbs-el label="渠道销售统计" />
    </q-breadcrumbs>

    <div class="row q-mt-md">
      <div class="infoTitle">订单总数</div>
      <div class="text-grey-7">{{sumTotal.totalOrderNum}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">销售总额</div>
      <div class="text-grey-7">{{sumTotal.totalAmount}}</div>
    </div>
    <div class="infoGroupTitle q-mt-lg">按门票统计</div>
    <q-table :data="sumTickets" :columns="columnsTickets" />
    <div class="infoGroupTitle q-mt-lg">按渠道统计</div>
    <q-table :data="sumAgents" :columns="columnsAgents" />
  </div>
</template>

<script>
export default {
  name: 'statAgent',
  data () {
    return {
      sumTotal: {
        totalOrderNum: 0,
        totalAmount: 0
      },
      sumTickets: [],
      columnsTickets: [
        { name: 'ticketName', label: '票品', field: 'ticketName', align: 'left' },
        { name: 'gradeName', label: '票档', field: 'gradeName', align: 'left' },
        { name: 'ticketNum', label: '销售数', field: 'ticketNum', align: 'left' },
        { name: 'amount', label: '销售额', field: 'amount', align: 'left' }
      ],
      sumAgents: [],
      columnsAgents: [
        { name: 'agentName', label: '渠道', field: 'agentName', align: 'left' },
        { name: 'orderNum', label: '订单数', field: 'orderNum', align: 'left' },
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
      this.$axios.get('/v1/plat/sumAgentOrder?projectId=' + this.$route.query.proId)
        .then(res => {
          console.log(res.data.data)
          this.sumTotal = res.data.data.sumTotal
          this.sumTickets = res.data.data.sumTickets
          this.sumAgents = res.data.data.sumAgents
        })
    }
  }
}
</script>
