<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="内容管理" />
    </q-breadcrumbs>
    <!--公司管理-->
    <div class="row justify-between items-center">
      <div class="col infoGroupTitle">内容管理</div>
      <q-btn color="secondary" icon="add_box" glossy label="新增栏目" @click="addColumn" />
    </div>
    <q-table class="q-mt-md q-mb-lg" :data="tableData" :columns="columns" :pagination.sync="pagination" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="toArticles(props.row.contentId)" class="cursor-pointer">
        <q-td key="contentId" :props="props">{{ props.row.contentId }}</q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="articleNum" :props="props">{{ props.row.articleNum }}</q-td>
        <q-td key="cdate" :props="props">{{ props.row.cdate }}</q-td>
        <q-td key="more" :props="props" class="cursor-pointer">
          <q-btn size="sm" rounded push color="brown-5" class="q-mr-sm" @click.stop="editColumn(props.row)">编辑</q-btn>
          <q-btn size="sm" rounded push color="red-5" @click.stop="delColumn(props.row.contentId)">删除</q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>
<script>
export default {
  name: 'columns',
  data () {
    return {
      tableData: [],
      columns: [
        { name: 'contentId', label: 'id', field: 'contentId', align: 'left' },
        { name: 'name', label: '栏目名', field: 'name', align: 'left' },
        { name: 'articleNum', label: '文档数', field: 'articleNum', align: 'left' },
        { name: 'cdate', label: '创建时间', field: 'cdate', align: 'left' },
        { name: 'more', label: '操作', align: 'center' }
      ],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    //   获取信息
    getInfo () {
      this.$axios.get('/v1/activity/getContent')
        .then(res => {
          this.tableData = res.data.data
        })
    },
    // 新增栏目
    addColumn () {
      this.toPath('/plat/content/editColumn')
    },
    // 前往文档列表
    toArticles (id) {
      this.toPath('/plat/content/articles', { contentId: id })
    },
    // 编辑栏目
    editColumn (row) {
      this.toPath('/plat/content/editColumn', { contentId: row.contentId, name: row.name, description: row.description })
    },
    // 删除栏目
    delColumn (id) {
      this.$q.dialog({
        title: '警告',
        message: '是否删除此栏目',
        cancel: true
      }).onOk(() => {
        this.$axios.post('/v1/activity/delContent/' + id)
          .then(res => this.getInfo())
      })
    }
  }
}
</script>
