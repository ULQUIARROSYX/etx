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
            <q-breadcrumbs-el
                label="系统管理 - 基础数据"
                to="/plat/system/base"
            />
            <q-breadcrumbs-el
                label="公司管理"
                to="/plat/system/base/company"
            />
            <q-breadcrumbs-el label="公司内人员列表" />
        </q-breadcrumbs>
        <div class="row justify-between items-center">
            <div class="col infoGroupTitle">公司内人员列表</div>
            <div class="row items-center">
                <q-btn
                    color="secondary"
                    icon="edit"
                    glossy
                    disabled
                    label="修改人员"
                    @click="add()"
                />
            </div>
        </div>
        <q-table
            class="q-my-md"
            :data="tableData.data"
            :columns="tableData.columns"
            :pagination.sync="pagination"
            row-key="name"
            color="primary"
        />
    </div>
</template>

<script>
export default {
    name: 'companyOp',
    data: () => ({
        tableData: {
            columns: [
                {
                    name: 'op_id',
                    label: '人员id',
                    field: 'op_id',
                    align: 'left'
                },
                { name: 'name', label: '名称', field: 'name', align: 'left' },
                {
                    name: 'login',
                    label: '登录名',
                    field: 'login',
                    align: 'left'
                },
                {
                    name: 'enable',
                    label: '是否有效',
                    field: 'enable',
                    align: 'left'
                },
                {
                    name: 'last_login',
                    label: '上次登录时间',
                    field: 'last_login',
                    align: 'left'
                }
            ],
            data: []
        },
        pagination: {
            rowsPerPage: 10
        }
    }),
    mounted () {
        this.getOpList()
    },
    methods: {
        // 获取人员列表
        getOpList () {
            this.$axios
                .post('/v1/auth/opInCompany', {
                    companyId: parseInt(this.$route.query.companyId)
                })
                .then(res => {
                    this.tableData.data = res.data.data.opList
                })
        }
    }
}
</script>

<style scoped>
</style>
