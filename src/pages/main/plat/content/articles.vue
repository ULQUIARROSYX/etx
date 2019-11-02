<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="内容管理" to="/plat/content" />
      <q-breadcrumbs-el label="文档管理" />
    </q-breadcrumbs>
    <!--公司管理-->
    <div class="row justify-between items-center">
      <div class="col infoGroupTitle">文档列表</div>
      <q-btn color="secondary" icon="add_box" glossy label="添加文档" @click="addArticle" />
    </div>
    <q-table class="q-mt-md q-mb-lg" :data="tableData" :columns="columns" :pagination.sync="pagination" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
        <q-td key="articleId" :props="props">{{ props.row.contentId }}</q-td>
        <q-td key="preview" :props="props"><img style="height:4em" :src="props.row.preview" /></q-td>
        <q-td key="title" :props="props">
          <div>标题：{{ props.row.title }}</div>
          <div class="q-my-sm">副标题：{{ props.row.subtitle }}</div>
          <div>时间：{{ props.row.cdate }}</div>
        </q-td>
        <q-td key="author" :props="props">{{ props.row.author }}</q-td>
        <q-td key="more" :props="props" class="cursor-pointer">
          <q-btn size="sm" rounded push color="brown-5" class="q-mr-sm" @click="editArticle(props.row.articleId)">编辑</q-btn>
          <q-btn size="sm" rounded push color="red-5" @click="delArticle(props.row.articleId)">删除</q-btn>
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
        { name: 'articleId', label: 'id', field: 'articleId', align: 'left' },
        { name: 'preview', label: '图片', field: 'preview', align: 'left' },
        { name: 'title', label: '文档标题', align: 'left' },
        { name: 'author', label: '发布人', field: 'author', align: 'left' },
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
      this.$axios.get('/v1/activity/getArticle?contentId=' + this.$route.query.contentId)
        .then(res => {
          this.tableData = res.data.data
        })
    },
    // 新增文档
    addArticle () {
      this.toPath('/plat/content/editArticle', { contentId: this.$route.query.contentId })
    },
    // 编辑文档
    editArticle (id) {
      this.toPath('/plat/content/editArticle', { contentId: this.$route.query.contentId, articleId: id })
    },
    // 删除文档
    delArticle (id) {
      this.$q.dialog({
        title: '警告',
        message: '是否删除此文档',
        cancel: true
      }).onOk(() => {
        this.$axios.post('/v1/activity/delArticle/' + id)
          .then(res => this.getInfo())
      })
    }
  }
}
</script>
