<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="内容管理" to="/plat/content" />
      <q-breadcrumbs-el label="文档管理" :to="'/plat/content/articles?contentId='+$route.query.contentId" />
      <q-breadcrumbs-el :label="addShow?'添加文档':'编辑文档'" />
    </q-breadcrumbs>
    <q-form @submit="onSubmit">
      <!-- 标题 -->
      <q-input v-model="form.title" label="标题" :rules="[val=>!!val|'不可为空']" />
      <!-- 子标题 -->
      <q-input v-model="form.subtitle" label="子标题" :rules="[val=>!!val|'不可为空']" />
      <!-- 作者 -->
      <q-input v-model="form.author" label="作者" :rules="[val=>!!val|'不可为空']" />
      <!-- 图片 -->
      <q-field label="图片" stack-label borderless v-model="form.picurl" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Avatar v-model="form.picurl" :preview="form.preview" class="q-mt-xs"></Avatar>
        </template>
      </q-field>
      <!-- 内容 -->
      <q-field label="内容" stack-label borderless v-model="form.content" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Edit v-model="form.content" class="q-mt-xs" />
        </template>
      </q-field>
      <!-- 提交 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'editArticle',
  data () {
    return {
      addShow: true,
      form: {
        title: '',
        subtitle: '',
        preview: '',
        picurl: '',
        author: '',
        content: '1'
      }
    }
  },
  mounted () {
    if (this.$route.query.articleId) {
      this.addShow = false
      this.getInfo()
    }
  },
  methods: {
    //  获取信息
    getInfo () {
      this.$axios.get('/v1/activity/getArticle/' + this.$route.query.articleId)
        .then(res => {
          this.form = res.data.data
        })
    },
    // 点击提交
    onSubmit () {
      if (this.addShow) {
        this.$axios.post('/v1/activity/newArticle', this.form)
          .then(this.formComplete)
      } else {
        this.$axios.post('/v1/activity/updArticle/' + this.$route.query.articleId, this.form)
          .then(this.formComplete)
      }
    }
  },
  components: {
    Avatar: () => import('components/avatar'),
    Edit: () => import('components/editor')
  }
}
</script>
