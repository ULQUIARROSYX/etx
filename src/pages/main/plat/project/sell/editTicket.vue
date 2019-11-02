<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票服务项目" to="/plat/project/sell" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/sell/proInfo?proId='+$route.query.proId" />
      <q-breadcrumbs-el label="票品信息" v-if="!addShow" :to="'/plat/project/sell/ticket?proId='+$route.query.proId+'&ticketId='+$route.query.ticketId" />
      <q-breadcrumbs-el label="新增票品" v-if="addShow" />
      <q-breadcrumbs-el v-if="!addShow" label="编辑票品" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit">
      <!-- 票品id -->
      <q-input v-model="$route.query.ticketId" type="number" label="票品id（ 只读 ）" readonly v-if="!addShow" hint></q-input>

      <!-- 票品名称 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.name" label="票品名称"></q-input>

      <!-- 状态 -->
      <div class="text-grey-7 text-caption q-mt-sm">项目状态</div>
      <div class="q-gutter-md">
        <q-radio v-model="form.status" :val="0" label="准备" color="red" class="q-mr-md" />
        <q-radio v-model="form.status" :val="1" label="上架" color="teal" class="q-mr-md" />
        <q-radio v-model="form.status" :val="2" label="下架" color="cyan" class="q-mr-md" />
      </div>

      <!-- 图片 -->
      <q-field label="图片" stack-label v-model="form.picurl" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Avatar v-model="form.picurl" :preview="form.preview" class="q-mt-xs"></Avatar>
        </template>
      </q-field>

      <!-- 描述 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.description" label="描述"></q-input>

      <!-- 属性 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.props" label="属性"></q-input>

      <!-- 选择场次 -->
      <q-input label="场次" :rules="[ val => !!val || '不可为空']" v-model="form.stage" />

      <!-- 票档 -->
      <q-field v-model="gradeList" :rules="[ val => val.length>0 || '不可为空']" label="票档">
        <template v-slot:control>
          <div class="q-gutter-xs q-mt-xs">
            <q-chip v-for="(grade,gradeI) in gradeList" :key="gradeI" removable @remove="delGrade(grade.gradeName,grade.gradeId)" color="secondary"
              text-color="white">{{grade.gradeName}}</q-chip>
          </div>
        </template>
        <template v-slot:append>
          <q-btn icon="add_box" color="secondary" round flat @click="addGrade" />
        </template>
      </q-field>

      <!-- 电子票 -->
      <q-input label="电子票Id" v-model="form.eticketId" />

      <!-- 提交表单 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />

      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>
  </div>
</template>
<script>
export default {
  name: 'editSellKind',
  data () {
    return {
      addShow: true,
      form: {
        ticketId: '',
        eticketId: '',
        name: '',
        status: 0,
        description: '',
        picurl: '',
        preview: '',
        props: '', // 属性
        stage: '', // 场次
        grade: [], // 票档
        stockctrl: 0 // 库存控制
      },
      proInfo: {},
      gradeList: []
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      if (this.$route.query.ticketId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getSellticket/' + this.$route.query.ticketId).then(res => {
          this.form = res.data.data
          let gradeVal = JSON.parse(JSON.stringify(res.data.data.grade))
          this.gradeList = gradeVal
        })
      }
    },
    // 添加票档
    addGrade () {
      this.$q
        .dialog({
          title: '票档',
          message: '请输入新增的票档名称',
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk(newName => {
          this.$q
            .dialog({
              title: '票档：' + newName,
              message: '请输入此票档的票面价值',
              prompt: {
                model: '',
                type: 'number' // optional
              },
              cancel: true,
              persistent: true
            })
            .onOk(parVal => {
              if (this.addShow) {
                this.gradeList.push({ gradeName: newName, parValue: parVal })
                this.form.grade.push({ gradeName: newName, parValue: parVal })
              } else {
                this.gradeList.push({ gradeName: newName, parValue: parVal, ticketId: this.$route.query.ticketId })
                this.form.grade.push({ gradeName: newName, parValue: parVal, ticketId: this.$route.query.ticketId })
              }
            })
        })
    },
    // 删除票档
    delGrade (gradeName, gradeId) {
      this.$q
        .dialog({
          title: '删除票档',
          message: `是否删除票档"${gradeName}"`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          if (!gradeId) {
            this.gradeList = this.gradeList.filter(e => e.gradeName !== gradeName)
            this.form.grade = this.gradeList.filter(e => e.gradeName !== gradeName)
          } else {
            this.gradeList = this.gradeList.filter(e => e.gradeName !== gradeName)
            this.form.grade.forEach((e, i) => {
              if (e.gradeId === gradeId) {
                delete e.gradeName
              }
            })
          }
        })
    },
    // 提交表单
    onSubmit () {
      if (this.addShow) {
        this.$axios.post('/v1/plat/newSellticket', this.addForm).then(this.formComplete)
      } else {
        this.$axios.post('/v1/plat/updSellticket/' + this.$route.query.ticketId, this.editFrom).then(this.formComplete)
      }
    }
  },
  components: {
    Avatar: () => import('components/avatar')
  },
  computed: {
    addForm () {
      return {
        projectId: this.$route.query.proId,
        name: this.form.name,
        status: this.form.status,
        description: this.form.description,
        picurl: this.form.picurl,
        props: this.form.props,
        stage: this.form.stage,
        grade: this.form.grade,
        stockctrl: this.form.stockctrl,
        eticket: this.form.eticket,
        pticket: this.form.pticket,
        delitmpl: this.form.delitmpl
      }
    },
    editFrom () {
      return {
        projectId: this.$route.query.proId,
        name: this.form.name,
        status: this.form.status,
        description: this.form.description,
        picurl: this.form.picurl,
        props: this.form.props,
        stage: this.form.stage,
        grade: this.form.grade,
        stockctrl: this.form.stockctrl,
        eticket: this.form.eticket,
        pticket: this.form.pticket,
        delitmpl: this.form.delitmpl
      }
    }
  }
}
</script>
