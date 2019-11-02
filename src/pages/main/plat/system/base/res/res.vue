<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 基础数据" to="/plat/system/base" />
      <q-breadcrumbs-el label="资源管理" />
    </q-breadcrumbs>

    <!--资源管理-->
    <div class="row items-center text-secondary justify-between q-mb-md">
      <div class="col row items-center">
        <div class="infoGroupTitle q-mr-md">资源列表</div>
        <q-select dense outlined v-model="type.value" :options="type.options" option-disable="inactive" map-options emit-value
          style="min-width: 150px; max-width: 200px" />
      </div>
      <div class="row items-center text-secondary">
        <q-btn color="secondary" icon="add_box" glossy label="新增菜单" @click="addRes(1)" class="q-mr-md" />
        <q-btn color="secondary" icon="add_box" glossy label="新增URL" @click="addRes(2)" />
      </div>
    </div>
    <q-table :data="nowResList" :columns="resData.columns" :pagination.sync="pagination" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="editRes(props.row.type,props.row.resource_id)">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'resource',
  data: () => ({
    type: {
      value: 1,
      options: [
        {
          label: '全部',
          value: 0
        }, {
          label: '菜单',
          value: 1
        }, {
          label: 'URL',
          value: 2
        }
      ]
    },

    resData: {
      columns: [
        { name: 'id', label: 'id', field: 'resource_id', align: 'left', sortable: true },
        { name: 'name', label: '资源名称', field: 'name', align: 'left' },
        { name: 'type', label: '种类', field: 'type', align: 'left' },
        { name: 'enable', label: '是否有效', field: 'enable', align: 'left' },
        { name: 'path', label: '路径', field: 'path', align: 'left' },
        { name: 'description', label: '说明', field: 'description', align: 'left' }
      ],
      data: []
    },
    pagination: {
      rowsPerPage: 10
    }
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取全部信息
    getInfo () {
      this.$axios
        .post('/v1/auth/getAllResource', {})
        .then(res => {
          this.resData.data = res.data.data.resourceList.sort((a, b) => a.sort - b.sort)
        })
    },
    // 编辑资源
    editRes (type, id) {
      this.toPath('/plat/system/base/res/editRes', { type: type, resourceId: id })
    },
    // 新增资源
    addRes (type) {
      this.toPath('/plat/system/base/res/editRes', { type: type })
    }
  },
  computed: {
    nowResList () {
      switch (this.type.value) {
        case 0:
          return this.resData.data
        case 1:
          return this.resData.data.filter(e => e.type === 1)
        case 2:
          return this.resData.data.filter(e => e.type === 2)
        default:
          return this.resData.data
      }
    }
  }
}
</script>
