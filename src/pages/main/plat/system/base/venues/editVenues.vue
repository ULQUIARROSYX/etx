<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 基础数据" to="/plat/system/base" />
      <q-breadcrumbs-el label="场地管理" to="/plat/system/base/venues" />
      <q-breadcrumbs-el v-if="!addShow" label="编辑场馆信息" to="/place" />
      <q-breadcrumbs-el v-else label="新建场馆信息" to="/place" />
    </q-breadcrumbs>
    <q-form @submit="submit" class="q-mt-lg">
      <!-- 场地id -->
      <q-input v-model="form.venuesId" label="场地id（只读）" readonly v-if="!addShow"></q-input>
      <!-- 场地名 -->
      <q-input v-model="form.name" label="场地名" :rules="[ val => !!val || '不可为空']"></q-input>
      <!-- 省市区 -->
      <q-field label="省市区" stack-label borderless v-model="form.areaCode" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Area v-model="form.areaCode" @change="changePCA" :level="3" class="q-mt-xs" />
        </template>
      </q-field>
      <!-- 街道地址 -->
      <q-input v-model="form.address" label="街道地址" :rules="[ val => !!val || '不可为空']"></q-input>
      <!-- 说明 -->
      <q-field label="说明" stack-label borderless v-model="form.description" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Edit v-model="form.description" class="q-mt-xs" />
        </template>
      </q-field>

      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" glossy class="q-mt-lg" type="submit" label="点击提交表单" />
    </q-form>

  </div>

</template>

<script>
export default {
  name: 'placeChange',
  data () {
    return {
      form: {
        name: '',
        province: '',
        city: '',
        area: '',
        areaCode: '',
        address: '',
        description: '',
        venuesId: ''
      },
      addShow: true
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取公司信息
    getInfo () {
      if (this.$route.query.venuesId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getVenuesById/' + this.$route.query.venuesId)
          .then((res) => { this.form = res.data.data })
      }
    },
    // 表单验证
    submit () {
      delete this.form.venuesId
      if (!this.addShow) {
        this.keep()
      } else {
        this.add()
      }
    },
    // 保存修改
    keep () {
      this.$axios.post('/v1/plat/updVenues/' + this.$route.query.venuesId, this.form)
        .then(this.formComplete)
    },
    // 新增场馆
    add () {
      this.$axios.post('/v1/plat/newVenues', this.form)
        .then(this.formComplete)
    },
    // 修改省市区
    changePCA (val) {
      this.form.province = val[0]
      this.form.city = val[1]
      this.form.area = val[2]
    }
  },
  components: {
    Area: () => import('components/lazyArea'),
    Edit: () => import('components/editor')
  }
}
</script>
