<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="电子票项目" />
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
        <q-btn color="secondary" icon="add_box" glossy label="添加新项目" @click="toPath('/plat/project/eticket/editPro')"></q-btn>
      </div>
    </div>
    <q-table :data="tableData" :columns="columns" :pagination.sync="pagination" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="showInfo(props.row.projectId)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
      </q-tr>
    </q-table>
  </div>
</template>
<script>
export default {
  name: 'pro',
  data: () => ({
    columns: [
      {
        name: 'projectId',
        label: '项目id',
        field: 'projectId',
        align: 'left'
      },
      {
        name: 'name',
        label: '项目名称',
        field: 'name',
        align: 'left'
      },
      {
        name: 'ownerName',
        label: '主办方',
        field: 'ownerName',
        align: 'left'
      },
      {
        name: 'status',
        label: '当前状态',
        field: 'status',
        align: 'left'
      },
      { name: 'cdate', label: '创建时间', field: 'cdate', align: 'left' }
    ],
    pagination: {
      rowsPerPage: 10
    },
    tableData: [],
    proList: [],
    searchText: ''
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 查看项目信息
    showInfo (id) {
      this.toPath('/plat/project/eticket/proInfo', { proId: id })
    },
    // 获取全部数据
    getInfo () {
      this.$axios.get('v1/plat/getProject?type=1').then(res => { this.tableData = res.data.data })
    },
    // 查询
    search () {
      this.$axios
        .get('v1/plat/getProject?type=1&keyword=' + this.searchText)
        .then(res => { this.tableData = res.data.data })
    }
  }
}
</script>

<style scoped>
</style>
