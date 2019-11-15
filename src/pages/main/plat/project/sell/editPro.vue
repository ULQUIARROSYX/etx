<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票服务项目" to="/plat/project/sell" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/sell/proInfo?proId='+$route.query.proId" v-if="!addShow" />
      <q-breadcrumbs-el :label="addShow?'新增售票服务':'修改售票服务'" />
    </q-breadcrumbs>
    <q-form @submit="onSubmit">
      <!-- 项目id -->
      <q-input v-model="$route.query.proId" type="number" label="项目id（ 只读 ）" readonly v-if="!addShow" hint></q-input>
      <!-- 创建时间 -->
      <q-input v-model="form.cdate" label="创建时间（ 只读 ）" readonly v-if="!addShow" hint></q-input>
      <!-- 项目状态 -->
      <div class="text-grey-7 text-caption q-mt-sm" v-if="!addShow">项目状态</div>
      <div class="q-gutter-md" v-if="!addShow">
        <q-radio v-model="form.status" :val="0" label="未上线" color="red" class="q-mr-md" />
        <q-radio v-model="form.status" :val="1" label="已上线" color="teal" class="q-mr-md" />
        <q-radio v-model="form.status" :val="2" label="已结束" color="cyan" class="q-mr-md" />
      </div>
      <!-- 项目名称 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.name" label="项目名称"></q-input>
      <!-- 项目简介 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.brief" label="项目简介"></q-input>
      <!-- 主标题 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.title" label="主标题"></q-input>
      <!-- 副标题 -->
      <q-input :rules="[ val => !!val || '不可为空']" v-model="form.subtitle" label="副标题"></q-input>
      <!-- 标签选择 -->
      <q-select :rules="[ val => val.length > 0 || '不可为空']" v-model="form.tags" multiple :options="tagOption" use-chips color="accent" label="标签选择" />
      <!-- 图文描述 -->
      <q-field label="图文描述" stack-label borderless v-model="form.content" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Edit v-model="form.content" class="q-mt-xs" />
        </template>
      </q-field>
      <!-- 项目图片 -->
      <q-field label="项目图片" stack-label borderless v-model="form.picurl" :rules="[ val => !!val || '不可为空']">
        <template v-slot:control>
          <Avatar v-model="form.picurl" :preview="form.preview" class="q-mt-xs"></Avatar>
        </template>
      </q-field>
      <!-- 场地选择 -->
      <q-field borderless label="场地选择(省市二级)" stack-label v-model="form.areaCode" :rules="[val=>!!val||'必选']">
        <template v-slot:control>
          <Area is_level2 :province="form.province" :city="form.city" :areaCode="form.areaCode" @change="selectArea" />
        </template>
      </q-field>
      <!-- 场管选择 -->
      <q-field label="场馆选择" v-model="form.venuesId" :rules="[ val => val>0 || '不可为空']">
        <template v-slot:control>
          <Venues v-model="form.venuesId" :name="form.venuesName" @change="selectVenues" />
        </template>
      </q-field>
      <!-- 选择主办方公司 -->
      <q-field label="主办方公司（点击选择）" v-model="form.owner" :rules="[ val => val>0 || '不可为空']">
        <template v-slot:control>
          <Company v-model="form.owner" :name="form.ownerName" @change="selectCompany"></Company>
        </template>
      </q-field>
      <!-- 渠道选择 -->
      <q-select :rules="[ val => !!val&&val!=='' || '不可为空']" v-if="form.owner!==-1" v-model="form.agentId" emit-value map-options :options="agents" label="渠道选择"
        hint />
      <!-- 门票类型 -->
      <q-field label="门票类型" stack-label hint>
        <template v-slot:control>
          <div class="q-gutter-sm">
            <q-checkbox v-model="form.eticket" label="电子票" color="teal" :true-value="1" :false-value="0" />
            <q-checkbox v-model="form.pticket" label="实体票" color="orange" :true-value="1" :false-value="0" />
          </div>
        </template>
      </q-field>
      <!-- 配送模版 -->
      <q-input autogrow :rules="[ val => !!val || '不可为空']" v-model="form.delitmpl" label="配送模版"></q-input>
      <!-- 消息模板 -->
      <q-input autogrow :rules="[ val => !!val || '不可为空']" v-model="form.msgTmpl" label="消息模板"></q-input>
      <!-- 上演时间 -->
      <q-input v-model="form.showtime" mask="date" :rules="['date']" label="上演时间" error-message="格式错误" hint="请点击右侧图标或手动输入正确格式">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="form.showtime" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- 关于配送 -->
      <q-input autogrow hint v-model="form.deliveryInfo" label="关于配送"></q-input>
      <!-- 关于电子票 -->
      <q-input autogrow hint v-model="form.eticketInfo" label="关于电子票"></q-input>
      <!-- 关于发票 -->
      <q-input autogrow hint v-model="form.invoiceInfo" label="关于发票"></q-input>
      <!-- 其他说明 -->
      <q-input autogrow hint v-model="form.elseInfo" label="其他说明"></q-input>
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />

      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />
    </q-form>
  </div>
</template>
<script>
export default {
  name: 'editSellPro',
  data () {
    return {
      addShow: true,
      checked: [],
      option: '',
      tagOption: [],
      form: {
        type: 2,
        name: '',
        status: 0,
        ownerName: '',
        owner: -1,
        agentId: '',
        eticket: 0,
        pticket: 0,
        delitmpl: '',
        realname: 0,
        msgTmpl: '',
        brief: '',
        picurl: '',
        preview: '',
        title: '',
        subtitle: '',
        tags: [],
        showtime: '',
        areaCode: '',
        province: '',
        city: '',
        venuesName: '',
        venuesId: -1,
        deliveryInfo: '',
        eticketInfo: '',
        invoiceInfo: '',
        elseInfo: '',
        content: ''
      },
      date: 1,
      value: '',
      proImageUrl: '',
      agents: []
    }
  },
  mounted () {
    this.getInfo()
    this.form.areaCode = '140400'
    let arr1 = [
      '2019年第十七届广州国际汽车展览会凭票入场，一人一票，一次有效',
      '观展地点：中国进出口商品交易会展馆A/B区（请从地铁琶洲站下车）',
      '请在组委会指定及授权的渠道购买，并了解清楚门票种类及有效期',
      '购票时所填写手机号码，仅用于电子凭证的接收及门票相关服务',
      '请妥善保存门票凭证，发生门票丢失、电子票凭证泄露等情况须自行承担损失',
      '门票一经售出，不接受退票，请谨慎购买；展会不设老人票、儿童票及其它优惠票',
      '如需电子票发票，请到现场服务台领取',
      '观众可拔打服务电话：400-660-2860 或访问官方网站了解相关内容'
    ]
    let arr2 = [
      {
        'question': '发票在哪里领取？是不是增值税专用发票？',
        'answer': '展馆二楼检票口进馆后即可看到服务台，可在服务台凭票领取发票；发票是普通手撕发票，不是增值税专用发票，且固定面额，例如您购买2张50元门票便可领取2张50元的对应发票'
      }, {
        'question': '购买完成后如何查看/使用？',
        'answer': '可在pc端-我的订单、微信小程序-我的门票页面查看已购电子票；入场检票时对工作人员出示二维码扫码即可使用'
      }, {
        'question': '专业日和公众日门票有何区别，购买专业日门票有没有门槛？',
        'answer': '两种门票只有价格和参展时间的不同，可参展地区是相同的；门票的购买没有门槛限制，只要您买了票就可以在对应时间内去观展'
      }, {
        'question': '门票几次有效次数是多少？对老幼病残有没有优惠？',
        'answer': '门票是一人一票一次有效，即验票后出馆再进馆便需要重新买票；120cm以下的儿童可以由大人免票带入场内；暂不设老人票和残疾人票'
      }
    ]
    console.log(JSON.stringify(arr1))
    console.log(JSON.stringify(arr2))
  },
  methods: {
    // 提交表单信息
    onSubmit () {
      let self = this
      switch (this.addShow) {
        case true:
          this.$axios
            .post('/v1/plat/newProject', {
              type: 2,
              name: self.form.name,
              status: self.form.status,
              ownerName: self.form.ownerName,
              owner: self.form.owner,
              agentId: self.form.agentId,
              eticket: self.form.eticket,
              pticket: self.form.pticket,
              delitmpl: self.form.delitmpl,
              realname: self.form.realname,
              msgTmpl: self.form.msgTmpl,
              brief: self.form.brief,
              picurl: self.form.picurl,
              title: self.form.title,
              subtitle: self.form.subtitle,
              tags: JSON.stringify(self.form.tags),
              showtime: self.form.showtime,
              areaCode: self.form.areaCode,
              province: self.form.province,
              city: self.form.city,
              venuesName: self.form.venuesName,
              venuesId: self.form.venuesId,
              deliveryInfo: self.form.deliveryInfo,
              eticketInfo: self.form.eticketInfo,
              invoiceInfo: self.form.invoiceInfo,
              elseInfo: self.form.elseInfo,
              content: self.form.content
            })
            .then(this.formComplete)
          break
        case false:
          this.$axios
            .post('/v1/plat/updProject/' + this.$route.query.proId, {
              name: self.form.name,
              status: self.form.status,
              ownerName: self.form.ownerName,
              owner: self.form.owner,
              agentId: self.form.agentId,
              eticket: self.form.eticket,
              pticket: self.form.pticket,
              delitmpl: self.form.delitmpl,
              realname: self.form.realname,
              msgTmpl: self.form.msgTmpl,
              brief: self.form.brief,
              picurl: self.form.picurl,
              title: self.form.title,
              subtitle: self.form.subtitle,
              tags: JSON.stringify(self.form.tags),
              showtime: self.form.showtime,
              areaCode: self.form.areaCode,
              province: self.form.province,
              city: self.form.city,
              venuesName: self.form.venuesName,
              venuesId: self.form.venuesId,
              deliveryInfo: self.form.deliveryInfo,
              eticketInfo: self.form.eticketInfo,
              invoiceInfo: self.form.invoiceInfo,
              elseInfo: self.form.elseInfo,
              content: self.form.content
            })
            .then(this.formComplete)
          break
        default:
      }
    },
    // 获取标签和项目数据
    getInfo () {
      let self = this
      const id = this.$route.query.proId
      this.$axios.get('/v1/comm/getEnum?key=tk_tag').then(res => {
        this.tagOption = res.data.data.map(e => {
          return {
            label: e.txt,
            value: e.value
          }
        })
        if (id) {
          this.addShow = false
          this.$axios.get('/v1/plat/getProject/' + this.$route.query.proId).then(res => {
            let result = res.data.data
            result.tags = JSON.parse(result.tags)
            console.log(result)
            self.form = result
          })
        }
      })
    },
    // 选择公司
    selectCompany (e) {
      this.form.ownerName = e
      this.getAgent()
    },
    // 获取渠道列表
    getAgent () {
      this.$axios.get('/v1/plat/getAgent?companyId=' + this.form.owner).then(res => {
        this.agents = res.data.data.map(e => {
          return {
            label: e.name,
            value: e.agentId
          }
        })
      })
    },
    // 选择场馆
    selectVenues (e) {
      this.form.venuesName = e
    },
    // 修改省市区
    selectArea (val) {
      this.form.province = val.province
      this.form.city = val.city
      this.form.areaCode = val.areaCode
    }
  },
  components: {
    Company: () => import('components/company'),
    Avatar: () => import('components/avatar'),
    Area: () => import('components/lazyArea'),
    Edit: () => import('components/editor'),
    Venues: () => import('components/venues')
  }
}
</script>
