<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-销售管理" />
    </q-breadcrumbs>
    <!-- 渠道售票 -->
    <div class="row justify-between items-center">
      <div class="col infoGroupTitle">渠道售票</div>
    </div>
    <q-table class="q-mt-md q-mb-lg" :data="tableData" :columns="columns" row-key="name">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="projectId" :props="props">{{ props.row.projectId }}</q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="status" :props="props">{{ props.row.status }}</q-td>
        <q-td key="more" :props="props">
          <q-btn size="sm" rounded push color="brown-5" @click="toPath('/plat/agent/sell/statAgent',{proId:props.row.projectId})">销售统计</q-btn>
        </q-td>
      </q-tr>
    </q-table>
    <!-- 在线售票 -->
    <div class="row justify-between items-center">
      <div class="col infoGroupTitle">在线售票</div>
    </div>
    <q-table class="q-mt-md q-mb-lg" :data="tableData2" :columns="columns2" row-key="name">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="projectId" :props="props">{{ props.row.projectId }}</q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="status" :props="props">{{ props.row.status }}</q-td>
        <q-td key="more" :props="props">
          <q-btn size="sm" rounded push color="red" class="q-mr-sm" @click="toPath('/plat/agent/sell/order',{proId:props.row.projectId})">订单查询</q-btn>
          <q-btn size="sm" rounded push color="brown-5" @click="toPath('/plat/agent/sell/stat',{proId:props.row.projectId})">销售统计</q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'sell',
  data () {
    return {
      tableData: [],
      columns: [
        { name: 'projectId', label: 'id', field: 'projectId', align: 'left' },
        { name: 'name', label: '项目', field: 'name', align: 'left' },
        { name: 'status', label: '状态', field: 'status', align: 'left' },
        { name: 'more', label: '操作', align: 'left' }
      ],
      tableData2: [],
      columns2: [
        { name: 'projectId', label: 'id', field: 'projectId', align: 'left' },
        { name: 'name', label: '项目', field: 'name', align: 'left' },
        { name: 'status', label: '状态', field: 'status', align: 'left' },
        { name: 'more', label: '操作', align: 'left' }
      ]
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取项目列表
    getInfo () {
      this.$axios.get('/v1/plat/getProject?type=2')
        .then(res => {
          this.tableData = res.data.data
          this.tableData2 = res.data.data.filter(e => e.agentId !== null)
        })
    }
  }
}
</script>
