<template>
  <div style="width:500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="电子票项目" icon="dashboard" to="/plat/project/eticket" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/eticket/proInfo?proId='+$route.query.proId" />
      <q-breadcrumbs-el label="票品信息" v-if="!addShow" :to="'/plat/project/eticket/ticket?proId='+$route.query.proId+'&ticketId='+$route.query.ticketId" />
      <q-breadcrumbs-el :label="addShow?'新增票品':'编辑票品'" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit" class="q-mt-lg">
      <!-- 票品ID -->
      <q-input hint readonly v-if="!addShow" v-model="form.ticketId" label="票品ID"></q-input>
      <!-- 票品名称 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.name" label="票品名称"></q-input>
      <!-- 说明 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.description" label="说明"></q-input>
      <!-- 状态 -->
      <q-field label="状态" stack-label borderless>
        <template v-slot:control>
          <div class="q-gutter-md">
            <q-radio class="q-mr-md" v-model="form.status" :val="0" label="下架" />
            <q-radio class="q-mr-md" v-model="form.status" :val="1" label="上架" />
          </div>
        </template>
      </q-field>
      <!-- 数据来源 -->
      <q-select v-model="form.source" :options="sourceOptions" label="选择数据来源" emit-value map-options :rules="[ val => val!=='' || '不可为空']" />
      <!-- 数据前缀 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.prefix" label="数据前缀"></q-input>
      <!-- 数据长度 -->
      <q-select v-model="form.datalen" :options="lenOptions" label="数据长度" :rules="[ val => val!=='' || '不可为空']" />
      <!-- 匹配模式 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.regex" label="匹配模式"></q-input>
      <!-- 有效期 -->
      <q-field label="有效期（点击图标选择）" stack-label borderless>
        <template v-slot:control>
          <div class="row">
            <!-- 起始时间 -->
            <q-input class="col-6 q-pr-sm" v-model="form.validstart" label="起始时间" :rules="[ dateRules ]">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="startDate" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.validstart" @input="() => $refs.startDate.hide()" mask="YYYY-MM-DD HH:mm:ss" />
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy ref="startTime" transition-show="scale" transition-hide="scale">
                    <q-time v-model="form.validstart" @input="() => $refs.startTime.hide()" mask="YYYY-MM-DD HH:mm:ss" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <!-- 结束时间 -->
            <q-input class="col-6 q-pl-sm" v-model="form.validend" label="结束时间" :rules="[ dateRules ]">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="endDate" transition-show="scale" transition-hide="scale">
                    <q-date @input="() => $refs.endDate.hide()" v-model="form.validend" mask="YYYY-MM-DD HH:mm:ss" />
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy ref="endTime" transition-show="scale" transition-hide="scale">
                    <q-time @input="() => $refs.endTime.hide()" v-model="form.validend" mask="YYYY-MM-DD HH:mm:ss" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </template>
      </q-field>

      <!-- 其他选项 -->
      <q-field label="其他选项" stack-label borderless>
        <template v-slot:control>
          <div class="q-gutter-md">
            <q-toggle v-model="form.checkmode" label="允许脱机" class="q-mr-md" :false-value="0" :true-value="1" />

            <q-toggle v-model="form.repeat" color="green" label="允许多次使用" class="q-mr-md" :false-value="0" :true-value="1" />
          </div>
        </template>
      </q-field>

      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>
  </div>
</template>
<script>
export default {
  name: 'editTicket',
  data () {
    return {
      addShow: true,
      form: {
        name: '',
        description: '',
        status: 0,
        source: 0,
        regex: '',
        prefix: '',
        datalen: 8,
        validstart: '',
        validend: '',
        checkmode: 0,
        repeat: 0
      },
      lenOptions: [6, 7, 8, 9, 10],
      sourceOptions: [{ label: '全部', value: 0 }, { label: '平台生产', value: 1 }, { label: '外部导入', value: 2 }]
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 提交表单
    onSubmit () {
      this.form.projectId = this.$route.query.proId
      if (!this.addShow) {
        this.$axios.post('/v1/plat/updEticket/' + this.$route.query.ticketId, this.form).then(this.formComplete)
      } else {
        this.$axios.post('/v1/plat/newEticket/', this.form).then(this.formComplete)
      }
    },
    // 获取票品信息
    getInfo () {
      if (this.$route.query.ticketId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getEticketById/' + this.$route.query.ticketId).then(res => {
          this.form = res.data.data
        })
      }
    }
  }
}
</script>
