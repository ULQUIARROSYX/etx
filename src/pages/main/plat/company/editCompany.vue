<template>
    <div style="width: 500px; max-width: 100%">
        <q-breadcrumbs
            class="text-grey q-mb-lg"
            active-color="primary"
        >
            <q-breadcrumbs-el
                label="首页"
                icon="home"
                to="/"
            />
            <q-breadcrumbs-el
                label="公司列表"
                to="/plat/company"
            />
            <q-breadcrumbs-el label="公司信息" />
        </q-breadcrumbs>
        <q-form @submit="onSubmit">

            <!-- 项目id -->
            <q-input
                v-model="$route.query.companyId"
                type="number"
                label="项目id（ 只读 ）"
                readonly
                v-if="changeShow"
                hint=""
            ></q-input>

            <!-- 公司简称 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.name"
                label="公司简称"
            ></q-input>

            <!-- 公司全称 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.fullname"
                label="公司全称"
            ></q-input>

            <!-- 公司地址 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.address"
                label="公司地址"
            ></q-input>

            <!-- 联系人 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.contact"
                label="联系人"
            ></q-input>

            <!-- 联系电话 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.phone"
                label="联系电话"
            ></q-input>

            <!-- 网址 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.website"
                label="网址"
            ></q-input>

            <!-- 属于 -->
            <q-input
                :rules="[ val => val!=='' || '不可为空']"
                type="number"
                v-model="companyList.owner"
                label="属于"
            ></q-input>

            <!-- 描述 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="companyList.description"
                label="描述"
            ></q-input>

            <q-btn
                color="info"
                class="q-mr-lg q-mt-lg"
                flat
                label="返回"
                @click="$router.back(-1)"
            />

            <q-btn
                color="primary"
                glossy
                type="submit"
                label="点击提交表单"
            />
        </q-form>

    </div>

</template>

<script>
export default {
    name: 'companyChange',
    data: () => {
        return ({
            companyList: {
                company_id: '',
                name: '',
                fullname: '',
                address: '',
                contact: '',
                phone: '',
                website: '',
                owner: 0,
                description: ''
            },
            changeShow: true,
            rulesName: ['name', 'fullname', 'address', 'contact', 'phone', 'website', 'owner', 'description']
        })
    },
    mounted () {
        this.getRoleMsg()
    },
    methods: {
        // 获取公司信息
        getRoleMsg () {
            let self = this
            let id = this.$route.query.companyId
            if (!id) {
                self.changeShow = false
            } else {
                self.$axios.get('/v1/comm/getCompany/' + id)
                    .then((res) => {
                        self.companyList = res.data.data
                    })
            }
        },
        // 表单验证
        onSubmit () {
            if (this.changeShow) {
                this.keep()
            } else {
                this.add()
            }
        },
        // 保存修改
        keep () {
            this.$axios.post('/v1/comm/updCompany/' + this.$route.query.companyId, {
                companyId: this.companyList.company_id,
                name: this.companyList.name,
                fullname: this.companyList.fullname,
                address: this.companyList.address,
                contact: this.companyList.contact,
                phone: this.companyList.phone,
                website: this.companyList.website,
                owner: this.companyList.owner,
                description: this.companyList.description
            })
                .then(this.formComplete)
        },
        // 新增公司
        add () {
            if (this.companyList.owner === '') {
                this.companyList.owner = 0
            }
            this.$axios.post('/v1/comm/newCompany', {
                name: this.companyList.name,
                fullname: this.companyList.fullname,
                address: this.companyList.address,
                contact: this.companyList.contact,
                phone: this.companyList.phone,
                website: this.companyList.website,
                owner: this.companyList.owner,
                description: this.companyList.description
            })
                .then(this.formComplete)
        }
    }
}
</script>
