<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="账号信息" to="/account/shezhi" />
      <q-breadcrumbs-el label="编辑账号信息" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit" class="q-mt-lg">
      <!-- 用户名 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.name" label="用户名" />
      <!-- 项目图片 -->
      <q-field label="项目图片" stack-label v-model="form.avatar" hint="头像尺寸建议35*35" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Avatar v-model="form.avatar" :preview="form.preview" class="q-mt-xs"></Avatar>
        </template>
      </q-field>
      <!-- 提交 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn label="点击提交表单" type="submit" color="primary" glossy class="q-mt-lg" />
    </q-form>

  </div>
</template>
<script>
export default {
  name: 'changeInfo',
  data () {
    return {
      form: {
        name: '',
        avatar: '',
        preview: ''
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$axios
        .get('/v1/op/getOp')
        .then(res => (this.form = res.data.data.op))
    },
    onSubmit () {
      this.$axios
        .post('/v1/op/updOp', this.form)
        .then(this.formComplete)
    }
  },
  components: {
    Avatar: () => import('components/avatar')
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px !important;
  height: 178px !important;
  display: block;
}
</style>
