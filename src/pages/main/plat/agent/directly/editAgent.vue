<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-直连渠道" to="/plat/agent/directly" />
      <q-breadcrumbs-el label="渠道详情" v-if="!addShow" :to="'/plat/agent/directly/agentInfo?agentId='+$route.query.agentId" />
      <q-breadcrumbs-el :label="addShow?'新增渠道':'编辑信息'" icon="dashboard" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit">
      <!-- 渠道名称 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.name" label="渠道名称" />
      <!-- 状态 -->
      <q-field label="状态" stack-label borderless>
        <template v-slot:control>
          <q-radio v-model="form.status" :val="0" label="无效" color="red" class="q-mr-md" />
          <q-radio v-model="form.status" :val="1" label="可用" color="teal" class="q-mr-md" />
          <q-radio v-model="form.status" :val="2" label="禁用" color="cyan" class="q-mr-md" />
        </template>
      </q-field>
      <!-- 图片 -->
      <q-field label="图片" stack-label v-model="form.picurl" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Avatar v-model="form.picurl" :preview="form.preview" class="q-mt-xs"></Avatar>
        </template>
      </q-field>
      <!-- 类型 -->
      <q-input :rules="[ val => !!val || '不可为空']" readonly v-model="form.type" label="类型" />
      <!-- 标识 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.hash" label="标识" />
      <!-- 代理权限 -->
      <!-- <q-select v-model="form.roles" multiple :options="roleOptions" counter hint /> -->
      <!-- 备注 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.description" label="备注" />
      <!-- 其他设置 -->
      <q-select label="其他设置" v-model="form.openInf" multiple use-chips color="accent" :options="['售票服务','电子票']" hint>
        <template v-slot:append>
          <q-toggle v-model="form.needLogin" label="登录验证" :true-value="1" :false-value="0" />
        </template>
      </q-select>
      <!-- appid -->
      <q-input hint readonly v-model="form.appid" v-if="!addShow" label="appid（只读）" />
      <!-- secret -->
      <q-input hint readonly v-model="form.secret" v-if="!addShow" label="secret（只读）" />
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>
  </div>
</template>
<script>
export default {
  name: 'editAgent',
  data: () => ({
    addShow: true,
    form: {
      agentId: 0,
      name: '',
      description: null,
      companyId: 1,
      type: 1,
      status: 0,
      hash: '',
      roles: '',
      picurl: null,
      preview: null,
      needLogin: 0,
      appid: null,
      secret: null,
      openInf: []
    },
    roleOptions: []
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取渠道信息
    getInfo () {
      if (this.$route.query.agentId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getAgent/' + this.$route.query.agentId).then(res => {
          this.form = res.data.data
          //   this.form.openInf = JSON.parse(this.form.openInf)
          this.form.roles = JSON.parse(this.form.roles)
          console.log('成功')
          //   this.getRole()
        })
      }
    },
    // 获取roles
    getRole () {
      this.$axios.post('/v1/plat/getRoleByScope', {}).then(res => {
        console.log(res.data)
      })
    },
    // 提交表单
    onSubmit () {
      if (this.addShow) {
        this.$axios.post('/v1/plat/newAgent', this.editForm).then(this.formComplete)
      } else {
        this.$axios.post('/v1/plat/updAgent/' + this.$route.query.agentId, this.editForm).then(this.formComplete)
      }
    }
  },
  components: {
    Avatar: () => import('components/avatar')
  },
  computed: {
    editForm () {
      return {
        name: this.form.name,
        description: this.form.description,
        companyId: this.form.companyId,
        type: this.form.type,
        status: this.form.status,
        hash: this.form.hash,
        picurl: this.form.picurl,
        needLogin: this.form.needLogin,
        appid: this.form.appid,
        secret: this.form.secret,
        openInf: JSON.stringify(this.form.openInf)
      }
    }
  }
}
</script>
