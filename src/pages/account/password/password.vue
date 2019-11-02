<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="修改密码" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit" class="q-mt-lg">
      <q-input v-model="oldPw" label="旧密码" type="password" :rules="[ val => !!val || '不可为空']"></q-input>

      <q-input v-model="newPw" label="新密码" type="password" :rules="[ val => !!val || '不可为空' , val => val !== oldPw || '与旧密码相同' ]"></q-input>

      <q-input v-model="newPw2" label="请重复新密码" type="password" :rules="[ val => !!val || '不可为空', val => val === newPw || '两次输入的密码不一致' ]"></q-input>

      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="提交表单" type="submit" />
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'password',
  data: () => ({
    oldPw: '',
    newPw: '',
    newPw2: ''
  }),
  methods: {
    onSubmit () {
      this.$axios.post('v1/auth/changePw', {
        oldPw: this.oldPw, newPw: this.newPw
      })
        .then(this.formComplete)
    }
  }
}
</script>
