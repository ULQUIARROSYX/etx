<template>
  <div class="lineContainer">
    <div class="colItem q-mr-lg">
      <q-select dense v-model="provinces.obj" @filter="getProvinces" :options="provinces.list" @input="selectProvince" />
    </div>
    <div class="colItem">
      <q-select dense v-model="citys.obj" @filter="getCitys" :options="citys.list" @input="selectCity" />
    </div>
    <div class="colItem q-ml-lg" v-if="!is_level2">
      <q-select dense v-model="areas.obj" @filter="getAreas" :options="areas.list" @input="selectArea" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'lazyArea',
  props: {
    areaCode: {
      type: String,
      default: '000000'
    },
    province: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    area: {
      type: String,
      default: null
    },
    is_level2: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      provinces: {
        list: [],
        obj: {
          label: this.province,
          value: null
        }
      },
      citys: {
        list: [],
        obj: {
          label: this.city,
          value: null
        }
      },
      areas: {
        list: [],
        obj: {
          label: this.area,
          value: null
        }
      },
      code: this.areaCode
    }
  },
  methods: {
    // 获取省市区列表
    getProvinces (val, update, abort) {
      if (this.provinces.list.length === 0) {
        this.$axios.get('/v1/util/getArea?areaCode=000000')
          .then(res => {
            update(() => {
              this.provinces.list = res.data.data.map(e => { return { label: e.area_name, value: e.area_code } })
            })
          })
      } else {
        update()
      }
    },
    getCitys (val, update, abort) {
      if (this.provinces.obj.value === null) {
        this.notifyError('请先选择上一级')
        update()
      } else {
        if (this.citys.list.length === 0) {
          this.$axios.get('/v1/util/getArea?areaCode=' + this.code.substr(0, 2) + '0000')
            .then(res => {
              update(() => {
                this.citys.list = res.data.data.map(e => { return { label: e.area_name, value: e.area_code } })
              })
            })
        } else {
          update()
        }
      }
    },
    getAreas (val, update, abort) {
      if (this.citys.obj.value === null) {
        this.notifyError('请先选择上一级')
        update()
      } else {
        if (this.areas.list.length === 0) {
          this.$axios.get('/v1/util/getArea?areaCode=' + this.code.substr(0, 4) + '00')
            .then(res => {
              update(() => {
                this.areas.list = res.data.data.map(e => { return { label: e.area_name, value: e.area_code } })
              })
            })
        } else {
          update()
        }
      }
    },
    // 选择省市区
    selectProvince (e) {
      this.code = e.value
      this.citys = {
        list: [],
        obj: {
          label: null,
          value: null
        }
      }
      this.areas = {
        list: [],
        obj: {
          label: null,
          value: null
        }
      }
    },
    selectCity (e) {
      this.code = e.value
      this.areas = {
        list: [],
        obj: {
          label: null,
          value: null
        }
      }
      if (this.is_level2) {
        this.emitCode()
      }
    },
    selectArea (e) {
      this.code = e.value
      this.emitCode()
    },
    emitCode () {
      const obj = {
        province: this.provinces.obj.label,
        city: this.citys.obj.label,
        area: this.areas.obj.label,
        areaCode: this.code
      }
      this.$emit('change', obj)
    },
    // 设置props属性
    setProps () {
      this.code = this.areaCode
      this.provinces.obj = {
        label: this.province,
        value: this.areaCode.substr(0, 2) + '0000'
      }
      this.citys.obj = {
        label: this.city,
        value: this.areaCode.substr(0, 4) + '00'
      }
      this.areas.obj = {
        label: this.area,
        value: this.areaCode
      }
    }
  },
  watch: {
    areaCode () {
      this.setProps()
    }
  }
}
</script>
<style scoped>
.lineContainer {
  display: flex;
  width: 100%;
}
.lineContainer .colItem {
  flex-grow: 1;
}
</style>
<style>
.lineContainer .colItem .q-select .q-field__control-container {
  padding-top: 0;
}
</style>
