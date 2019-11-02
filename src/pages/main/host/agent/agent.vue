<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="渠道管理" icon="dashboard" to="/host/agent" />
    </q-breadcrumbs>

    <div class="row justify-between items-center">
      <div class="col infoGroupTitle">渠道列表</div>
      <q-btn color="secondary" icon="add_box" glossy label="新增渠道" @click="editAgent()" />
    </div>

    <q-table :data="tableData" :columns="columns" :pagination.sync="pagination" />

  </div>
</template>
<script>
export default {
  name: 'agent',
  data: () => ({
    tableData: [],
    columns: [
      { name: 'agentId', label: 'id', field: 'agentId', algin: 'left' },
      { name: 'name', label: '渠道名称', field: 'name', algin: 'left' },
      { name: 'agentId', label: '项目', field: 'agentId', algin: 'left' },
      { name: 'agentId', label: '额度', field: 'agentId', algin: 'left' },
      { name: 'agentId', label: '状态', field: 'agentId', algin: 'left' }
    ],
    pagination: {
      rowsPerPage: 10
    }
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$axios.get('/v1/plat/getAgent')
        .then(res => { this.tableData = res.data.data })
    },
    editAgent (id) {
      if (id) {
        this.toPath('/host/editAgent', { agentId: id })
      } else {
        this.toPath('/host/editAgent')
      }
    }
  }
}
</script>
