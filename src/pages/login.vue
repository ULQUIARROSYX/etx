<template>
  <div class="fixed-center text-center">
    <div class="login-bg fixed-center"></div>
    <q-card class="row items-stretch bg-red-10" style="width: 800px; max-width: 100vw">
      <div class="col-6 logo row justify-center q-py-lg items-center gt-sm">
        <img src="statics/icons/icon-128x128白.png" alt="logo" style="height:4rem;margin:1rem 0" />
        <img src="statics/icons/加壹网logo白色.png" alt="标题logo" style="height:3rem;" />
      </div>
      <div class="col-md-6 col-xs-12 loginContainer q-px-md q-py-lg">
        <p class="text-h6 text-red-2 q-my-lg">登录账号</p>
        <q-input class="q-px-lg text-right q-mb-md" v-model="form.login" color="red-2" label="账号" dark>
          <template v-slot:prepend>
            <q-icon name="account_circle" color="red-2" />
          </template>
        </q-input>

        <q-input class="q-px-lg text-right q-mb-md" v-model="form.password" color="red-2" label="密码" dark :type="isPwd ? 'password' : 'text'" warning-label="密码不可为空"
          @keydown.enter="submit">
          <template v-slot:prepend>
            <q-icon name="https" color="red-2" />
          </template>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>

        <!--登录按钮-->
        <div class="row q-px-lg gutter-md q-my-lg">
          <div class="col">
            <q-btn class="fullWidth" outline color="red-2" @click="submit">
              登录
              <span slot="loading">
                <q-spinner-hourglass class="on-left" />登录中，请稍候...
              </span>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: () => ({
    form: {
      login: '',
      password: ''
    },
    isPwd: true
  }),
  methods: {
    // 表单验证
    submit () {
      if (this.form.login !== '' && this.form.password !== '') {
        this.send()
      } else {
        this.notifySuccess('请确认填写完整')
      }
    },
    // 登录
    send () {
      this.removeToken()
      this.$axios
        .post('/v1/login', {
          login: this.form.login,
          password: this.form.password
        })
        .then(res => {
          switch (res.data.code) {
            case 0:
              // 储存opId到全局
              localStorage.setItem(
                'token',
                res.data.data.accessToken
              )
              localStorage.setItem(
                'refreshToken',
                res.data.data.refreshToken
              )
              this.$router.push('/')
              break
            case 1:
              this.notifyError('登录失败，请重试')
              break
          }
        })
    },
    // 移除token本地缓存
    removeToken () {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }
}
</script>

<style scoped>
.login-bg {
  background: linear-gradient(45deg, #301737, #b45052 100%);
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: -1;
}

.logo {
  background: linear-gradient(45deg, #241333, #6e2f42 100%);
}

.loginContainer {
  background: linear-gradient(45deg, #9b4550, #dd6064 100%);
}
</style>

<style>
.loginContainer .q-if-label {
  color: #ffcdd2;
}

.loginContainer .q-if-label-inner {
  color: #ffcdd2;
}

.loginContainer .q-field-with-warning .q-if-label-inner {
  color: #f2c037;
}

.loginContainer input {
  color: #ffcdd2;
}

.loginContainer
  .q-if:not(.q-if-disabled):not(.q-if-error):not(.q-if-warning):hover:before {
  color: #ffcdd2;
}
</style>
