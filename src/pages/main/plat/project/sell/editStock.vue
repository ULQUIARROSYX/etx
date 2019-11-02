<template>
  <div>
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票服务项目" to="/plat/project/sell" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/sell/proInfo?proId='+$route.query.proId" />
      <q-breadcrumbs-el label="库存管理" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit" class="q-mt-lg" style="width: 500px; max-width: 100%">
      <!-- 选择票档 -->
      <q-select label="选择票档" :options="grades" v-model="form.grade" @input="changeGrade" :rules="[val=>!!val&&val!==null||'必须选择票档']" />
      <!-- 选择票品 -->
      <q-input label="票品名称" v-model="ticketName" hint v-if="form.ticketId!==null" />
      <!-- 类型 -->
      <q-field label="类型" stack-label v-model="form.kind" hint>
        <template v-slot:control>
          <q-radio v-model="form.kind" :val="1" label="电子票" class="q-mr-lg" />
          <q-radio v-model="form.kind" :val="2" label="实体票" />
        </template>
      </q-field>
      <!-- 操作 -->
      <q-field label="操作" stack-label v-model="form.kind" hint>
        <template v-slot:control>
          <q-radio v-model="is_add" :val="true" label="增加" class="q-mr-lg" />
          <q-radio v-model="is_add" :val="false" label="减少" />
        </template>
      </q-field>
      <!-- 数量 -->
      <q-input label="数量" v-model="form.change" type="number" :rules="[val=>!!val&&val>0||'此处必须是正整数']" />
      <!-- 提交 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>

    <!-- 库存信息 -->
    <div class="row justify-between q-my-lg items-center">
      <div class="infoGroupTitle">库存记录</div>
    </div>
    <q-table style="width: 700px; max-width: 100%" :data="tableData" :columns="columns" />
  </div>
</template>

<script>
export default {
  name: 'editStock',
  data: () => ({
    columns: [
      { name: 'cdate', label: '日期', field: 'cdate', align: 'left' },
      { name: 'ticketName', label: '票品', field: 'ticketName', align: 'left' },
      { name: 'gradeName', label: '票档', field: 'gradeName', align: 'left' },
      { name: 'kind', label: '类型', field: 'kind', align: 'left' },
      { name: 'change', label: '操作', field: 'change', align: 'left' },
      { name: 'opName', label: '操作员', field: 'opName', align: 'left' }
    ],
    tableData: [],
    grades: [],
    form: {
      ticketId: null,
      grade: null,
      kind: 1,
      change: 0
    },
    ticketName: '',
    is_add: true
  }),
  mounted () {
    this.getStock()
    this.getGrades()
  },
  methods: {
    // 获取库存记录
    getStock () {
      this.$axios.get('/v1/plat/getStockLog?projectId=' + this.$route.query.proId).then(res => {
        this.tableData = res.data.data
      })
    },
    // 获取票档
    getGrades () {
      this.$axios.get('/v1/plat/getGradeByProject?projectId=' + this.$route.query.proId).then(res => {
        this.grades = res.data.data.map(e => {
          return {
            label: e.gradeName,
            value: e.gradeId,
            ticketId: e.ticketId,
            ticketName: e.ticketName
          }
        })
      })
    },
    // 修改票档
    changeGrade (e) {
      this.form.ticketId = e.ticketId
      this.ticketName = e.ticketName
    },
    // 提交
    onSubmit () {
      let changeNum = parseInt(this.form.change)
      if (!this.is_add) {
        changeNum = -changeNum
      }
      this.$axios
        .post('/v1/plat/setStock', {
          ticketId: this.form.ticketId,
          gradeId: this.form.grade.value,
          kind: this.form.kind,
          change: changeNum
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$q
              .dialog({
                title: '完成',
                message: '表单提交成功'
              })
              .onOk(() => {
                this.getStock()
                this.getGrades()
              })
          } else {
            this.notifyError('提交失败，错误代码：code=' + res.data.code)
          }
        })
    }
  }
}
</script>
