<template>
    <div style="width: 700px; max-width: 100%">
        <q-breadcrumbs
            class="text-grey q-mb-lg"
            active-color="primary"
        >
            <q-breadcrumbs-el
                label="首页"
                icon="home"
                to="/"
            />
            <q-breadcrumbs-el label="公司管理" />
        </q-breadcrumbs>
        <!--公司管理-->
        <div class="row justify-between items-center">
            <div class="col infoGroupTitle">公司列表</div>
            <q-btn
                color="secondary"
                icon="add_box"
                glossy
                label="添加新公司"
                @click="companyMsg($route.query.proId)"
            />
        </div>
        <q-table
            class="q-mt-md q-mb-lg"
            :data="companyData.data"
            :columns="companyData.columns"
            :pagination.sync="pagination"
            row-key="name"
        >
            <!--表格主体-->
            <q-tr
                slot="body"
                slot-scope="props"
                :props="props"
                @click.native="companyMsg(props.row.companyId)"
                class="cursor-pointer"
            >
                <q-td
                    key="companyId"
                    :props="props"
                >{{ props.row.companyId }}</q-td>
                <q-td
                    key="name"
                    :props="props"
                >{{ props.row.name }}</q-td>
                <q-td
                    key="fullname"
                    :props="props"
                >{{ props.row.fullname }}</q-td>
                <q-td
                    key="contact"
                    :props="props"
                >{{ props.row.contact }}</q-td>
                <q-td
                    key="more"
                    :props="props"
                    class="cursor-pointer"
                >
                    <q-btn
                        size="sm"
                        rounded
                        push
                        color="brown-5"
                        @click.stop="companyOp(props.row.companyId)"
                    >人员查看</q-btn>
                </q-td>
            </q-tr>
        </q-table>
    </div>
</template>

<script>
export default {
    name: 'company',
    data: () => ({
        loading: false,
        companyData: {
            columns: [
                {
                    name: 'companyId',
                    label: '公司id',
                    field: 'companyId',
                    align: 'left'
                },
                { name: 'name', label: '简称', field: 'name', align: 'left' },
                { name: 'fullname', label: '全称', field: 'fullname', align: 'left' },
                { name: 'contact', label: '联系人', field: 'contact', align: 'left' },
                { name: 'more', label: '操作', align: 'left' }
            ],
            data: [
                {
                    address: '',
                    belongto: '',
                    cdate: '',
                    companyId: '',
                    contact: '',
                    description: '',
                    fullname: '',
                    name: '',
                    phone: '',
                    website: ''
                }
            ]
        },
        pagination: {
            rowsPerPage: 10
        }
    }),
    mounted () {
        this.getCompany()
    },
    methods: {
        // 编辑公司信息
        companyMsg (id) {
            if (id) {
                this.toPath('/plat/company/editCompany', { companyId: id })
            } else {
                this.toPath('/plat/company/editCompany')
            }
        },
        // 编辑人员管理
        companyOp (id) {
            this.toPath('/plat/company/companyOp', { companyId: id })
        },
        // 获取全部信息
        getCompany () {
            this.$axios
                .get('/v1/comm/getCompany')
                .then(res => {
                    this.companyData.data = res.data.data
                })
        }
    }
}
</script>

<style scoped>
</style>
