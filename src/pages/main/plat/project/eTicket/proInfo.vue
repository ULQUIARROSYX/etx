<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="电子票项目" to="/plat/project/eticket" />
      <q-breadcrumbs-el label="项目信息" />
    </q-breadcrumbs>
    <div class="row justify-between q-my-lg items-center">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="add_box" glossy label="编辑项目信息" @click="editInfo"></q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="infoTitle">项目名称</div>
      <div class="text-grey-7">{{formData.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">主办方</div>
      <div class="text-grey-7">{{formData.ownerName}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">项目简介</div>
      <div class="text-grey-7">{{formData.brief}}</div>
    </div>
    <!-- 票品信息 -->
    <div class="row justify-between q-mb-lg items-end q-mt-lg">
      <div class="col infoGroupTitle">票品信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="add_box" rounded glossy label="新增票品信息" @click="addTicket"></q-btn>
      </div>
    </div>
    <q-table :data="tableData" :columns="columns" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props" @click.native="kindInfo(props.row.ticketId)">{{ col.value }}</q-td>
      </q-tr>
    </q-table>

    <!-- 入库记录 -->
    <div class="row justify-between q-mb-lg items-end q-mt-lg">
      <div class="col infoGroupTitle">入库记录</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="add_box" rounded glossy label="生产/导入数据" @click="toProduce"></q-btn>
      </div>
    </div>
    <q-table :data="tableData2" :columns="columns2" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
        <q-td key="cdate" :props="props">{{ props.row.cdate }}</q-td>
        <q-td key="ticketName" :props="props">{{ props.row.ticketName }}</q-td>
        <q-td key="genNum" :props="props">{{ props.row.genNum }}</q-td>
        <q-td key="inNum" :props="props">{{ props.row.inNum }}</q-td>
        <q-td key="num" :props="props">{{ props.row.startNo+' - '+props.row.endNo }}</q-td>
        <q-td key="opName" :props="props">{{ props.row.opName }}</q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'proInfo',
  data () {
    return {
      columns: [
        {
          name: 'ticketId',
          label: '票品id',
          field: 'ticketId',
          align: 'left'
        },
        {
          name: 'name',
          label: '票品名称',
          field: 'name',
          align: 'left'
        },
        {
          name: 'totalnum',
          label: '剩余库存',
          field: 'totalnum',
          align: 'left'
        }
      ],
      tableData: [],
      columns2: [
        { name: 'cdate', label: '日期', field: 'cdate', align: 'left' },
        { name: 'ticketName', label: '票品', field: 'ticketName', align: 'left' },
        { name: 'genNum', label: '计划数', field: 'genNum', align: 'left' },
        { name: 'inNum', label: '实际数', field: 'inNum', align: 'left' },
        { name: 'num', label: '票号', field: 'num', align: 'left' },
        { name: 'opName', label: '操作员', field: 'opName', align: 'left' }
      ],
      tableData2: [],
      formData: {}
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 编辑项目信息
    editInfo () {
      this.toPath('/plat/project/eticket/editPro', { proId: this.$route.query.proId })
    },
    // 增加票品
    addTicket () {
      this.toPath('/plat/project/eticket/editTicket', { proId: this.$route.query.proId })
    },
    // 查看票品
    kindInfo (id) {
      this.toPath('/plat/project/eticket/ticket', { proId: this.$route.query.proId, ticketId: id })
    },
    // 获取数据
    getInfo () {
      this.$axios.get('v1/plat/getProject/' + this.$route.query.proId).then(res => {
        this.formData = res.data.data
        // 获取票品
        this.$axios.get('v1/plat/getEticket?projectId=' + this.$route.query.proId).then(res2 => {
          this.tableData = res2.data.data
        })
        // 获取入库记录
        this.$axios.get('v1/plat/getEtIn?projectId=' + this.$route.query.proId).then(res2 => {
          this.tableData2 = res2.data.data
        })
      })
    },
    // 生产数据
    toProduce () {
      let endNo = 0
      if (this.tableData2.length > 0) {
        endNo = this.tableData2[this.tableData2.length - 1].endNo
      }
      this.toPath('/plat/project/eticket/produce', {
        proId: this.formData.projectId,
        proName: this.formData.name,
        endNo: endNo
      })
    }
  }
}
</script>
