<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="电子票项目" to="/plat/project/eticket" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/eticket/proInfo?proId='+$route.query.proId" v-if="!addShow" />
      <q-breadcrumbs-el :label="addShow?'新增电子票项目':'修改电子票项目'" to="/editTicketPro" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit">
      <!-- 项目名称 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.name" label="项目名称"></q-input>
      <!-- 项目简介 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.brief" label="项目简介"></q-input>
      <!-- 项目状态 -->
      <div class="text-grey-7 text-caption q-mt-sm" v-if="!addShow">项目状态</div>
      <div class="q-gutter-md" v-if="!addShow">
        <q-radio v-model="form.status" :val="0" label="未上线" color="red" class="q-mr-md" />
        <q-radio v-model="form.status" :val="1" label="已上线" color="teal" class="q-mr-md" />
        <q-radio v-model="form.status" :val="2" label="已结束" color="cyan" class="q-mr-md" />
      </div>
      <!-- 选择主办方公司 -->
      <q-field label="主办方公司（点击选择）" v-model="form.owner" :rules="[ val => val>0 || '不可为空']">
        <template v-slot:control>
          <Company v-model="form.owner" :name="form.ownerName" @change="selectCompany"></Company>
        </template>
      </q-field>
      <!-- 项目id -->
      <q-input v-model="$route.query.proId" type="number" label="项目id（ 只读 ）" readonly v-if="!addShow"></q-input>
      <!-- 创建时间 -->
      <q-input v-model="form.cdate" label="创建时间（ 只读 ）" readonly v-if="!addShow"></q-input>
      <!-- 生产密钥 -->
      <q-input v-model="form.datakey" label="生产密钥（ 只读 ）" readonly v-if="!addShow"></q-input>

      <!-- 提交 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>
  </div>
</template>
<script>
export default {
  name: 'editPro',
  data () {
    return {
      addShow: true,
      form: {
        name: '',
        owner: -1,
        ownerName: '',
        status: 0,
        cdate: '',
        brief: '',
        datakey: ''
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取数据
    getInfo () {
      let self = this
      const id = this.$route.query.proId
      if (id) {
        this.addShow = false
        this.$axios
          .get('v1/plat/getProject/' + id)
          .then(res => {
            self.form = res.data.data
          })
      }
    },
    // 选择公司
    selectCompany (e) {
      this.form.ownerName = e
    },
    // 提交表单信息
    onSubmit () {
      if (this.addShow) {
        this.$axios
          .post('v1/plat/newProject', {
            type: 1,
            status: 0,
            name: this.form.name,
            brief: this.form.brief,
            owner: this.form.owner
          })
          .then(this.formComplete)
      } else {
        this.$axios
          .post('v1/plat/updProject/' + this.$route.query.proId, {
            name: this.form.name,
            brief: this.form.brief,
            status: this.form.status,
            owner: this.form.owner
          })
          .then(this.formComplete)
      }
    }
  },
  components: {
    Company: () => import('components/company')
  }
}
</script>
