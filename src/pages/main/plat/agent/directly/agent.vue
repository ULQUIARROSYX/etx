<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-直连渠道" />
    </q-breadcrumbs>

    <div class="row justify-between q-my-lg items-center">
      <!--搜索-->
      <div class="col">
        <q-input v-model="searchText" dense placeholder="输入名称关键字后按回车键" @keydown.enter="search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <!--新增-->
      <div class="col text-right">
        <q-btn color="secondary" icon="add_box" glossy label="新增渠道" @click="toPath('/plat/agent/directly/editAgent')"></q-btn>
      </div>
    </div>

    <q-table class="q-mt-lg" :data="tableData" :columns="columns" :pagination.sync="pagination" row-key="agentId">
      <template v-slot:body="props">
        <q-tr :props="props" @click.native="showAgent(props.row.agentId)">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

  </div>
</template>
<script>
export default {
  name: 'agent',
  data: () => ({
    searchText: '',
    tableData: [],
    columns: [
      { name: 'agentId', label: 'id', field: 'agentId', align: 'left' },
      { name: 'name', label: '渠道名称', field: 'name', align: 'left' },
      { name: 'companyId', label: '公司', field: 'companyId', align: 'left' },
      { name: 'status', label: '状态', field: 'status', align: 'left' }
    ],
    pagination: {
      rowsPerPage: 10
    }
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$axios.get('/v1/plat/getAgent')
        .then(res => { this.tableData = res.data.data })
    },
    // 查看单个渠道信息
    showAgent (id) {
      this.toPath('/plat/agent/directly/agentInfo', { agentId: id })
    },
    // 搜索
    search () {
      this.$axios.get('/v1/plat/getAgent?keyword=' + this.searchText)
        .then(res => { this.tableData = res.data.data })
    }
  }
}
</script>
