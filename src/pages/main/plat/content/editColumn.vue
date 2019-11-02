<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="内容管理" to="/plat/content" />
      <q-breadcrumbs-el :label="addShow?'添加内容':'编辑内容'" />
    </q-breadcrumbs>
    <q-form @submit="onSubmit">
      <!-- 标题 -->
      <q-input v-model="name" label="标题" :rules="[val=>!!val|'不可为空']" />
      <!-- 描述 -->
      <q-input v-model="description" label="描述" :rules="[val=>!!val|'不可为空']" />
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
      name: '',
      description: ''
    }
  },
  mounted () {
    if (this.$route.query.contentId) {
      this.addShow = false
      this.name = this.$route.query.name
      this.description = this.$route.query.description
    }
  },
  methods: {
    // 点击提交
    onSubmit () {
      if (this.addShow) {
        this.$axios.post('/v1/activity/newContent', {
          name: this.name, description: this.description
        }).then(this.formComplete)
      } else {
        this.$axios.post('/v1/activity/updContent/' + this.$route.query.contentId, {
          name: this.name, description: this.description
        }).then(this.formComplete)
      }
    }
  }
}
</script>
