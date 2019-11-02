<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 人员管理" to="/plat/system/op" />
      <q-breadcrumbs-el label="编辑信息" v-if="!addShow" />
      <q-breadcrumbs-el label="新增人员" v-if="addShow" />
    </q-breadcrumbs>
    <q-form @submit="onSubmit">
      <!-- 人员id -->
      <q-input v-model="form.op_id" label="人员id" readonly hint="" v-if="!addShow"></q-input>
      <!-- 状态 -->
      <q-field label="状态" stack-label hint="">
        <template v-slot:control>
          <div class="q-gutter-md">
            <q-radio v-model="form.enable" :val="0" label="无效" class="q-mr-md" disable />
            <q-radio v-model="form.enable" :val="1" label="可用" color="teal" class="q-mr-md" />
            <q-radio v-model="form.enable" :val="2" label="禁用" color="red" class="q-mr-md" />
          </div>
        </template>
      </q-field>
      <!-- 登录名 -->
      <q-input v-model="form.login" label="登录名" :rules="[ val => !!val || '不可为空']"></q-input>
      <!-- 密码 -->
      <q-input v-model="form.password" label="密码" :rules="[ val => !!val || '不可为空']" v-if="addShow"></q-input>
      <!-- 人员名称 -->
      <q-input v-model="form.name" label="人员名称" :rules="[ val => !!val || '不可为空']"></q-input>
      <!-- 描述 -->
      <q-input v-model="form.description" label="描述" :rules="[ val => !!val || '不可为空']"></q-input>
      <!-- 选择公司 -->
      <q-field label="所属公司（点击选择）" v-model="form.company_id" :rules="[ val => val>0 || '不可为空']">
        <template v-slot:control>
          <Company v-model="form.company_id" :name="form.company_name" @change="selectCompany"></Company>
        </template>
      </q-field>
      <!-- 下次登录必须更改密码 -->
      <q-field label="其他选项" v-model="form.company_id" :rules="[ val => val>0 || '不可为空']">
        <template v-slot:control>
          <q-toggle v-model="form.change_pw" label="下次登录必须更改密码" left-label :true-value="1" :false-value="0" />
        </template>
      </q-field>
      <!-- 提交表单 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />

      <q-btn type="submit" color="primary" label="点击提交表单" glossy class="q-mr-sm q-mt-lg" />
      <q-btn glossy color="secondary" label="重置密码" class="q-ml-md q-mt-lg" @click="resetPw" v-if="!addShow" />
    </q-form>

  </div>
</template>

<script>
export default {
  name: 'editOp',
  data: () => ({
    form: {
      op_id: '',
      company_id: -1,
      company_name: '',
      description: '',
      enable: 1,
      login: '',
      password: '',
      name: '',
      change_pw: 1
    },
    addShow: true
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      if (this.$route.query.opId) {
        this.addShow = false
        this.$axios
          .post('/v1/auth/getOpById', { opId: this.$route.query.opId })
          .then(res => { this.form = res.data.data.op })
      }
    },
    // 提交表单
    onSubmit () {
      if (this.addShow) {
        this.add()
      } else {
        this.keep()
      }
    },
    // 保存修改
    keep () {
      let formPost = {
        opId: this.form.op_id,
        name: this.form.name,
        login: this.form.login,
        description: this.form.description,
        enable: this.form.enable,
        changePw: this.form.change_pw,
        companyId: this.form.company_id
      }
      this.$axios
        .post('/v1/auth/updOp', formPost)
        .then(this.formComplete)
    },
    // 新增人员
    add () {
      let formPost = {
        name: this.form.name,
        login: this.form.login,
        description: this.form.description,
        enable: this.form.enable,
        changePw: this.form.change_pw,
        companyId: this.form.company_id,
        password: this.form.password
      }
      this.$axios
        .post('/v1/auth/newOp', formPost)
        .then(this.formComplete)
    },
    // 重置密码
    resetPw () {
      this.$axios
        .post('/v1/auth/resetPw', { targetId: this.form.op_id })
        .then(res => {
          this.$q.dialog({
            title: '重置成功',
            message: `新密码为：${res.data.data.newPw}`
          })
        })
    },
    // 选择公司
    selectCompany (e) {
      this.form.company_name = e
    }
  },
  components: {
    Company: () => import('components/company')
  }
}
</script>
