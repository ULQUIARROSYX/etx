<template>
    <div style="width: 1000px; max-width: 100%">
        <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
            <q-breadcrumbs-el label="首页" icon="home" to="/" />
            <q-breadcrumbs-el label="售票渠道-销售管理" to="/plat/agent/sell" />
            <q-breadcrumbs-el label="在线售票订单查询" />
        </q-breadcrumbs>

        <!-- 订单查询 -->
        <div class="row justify-between items-center q-mb-sm">
            <div class="col infoGroupTitle">订单查询</div>
            <q-input v-model="orderNo" label="请输入订单号" dense filled />
            <q-input v-model="phone" label="请输入手机号" dense filled class="q-mx-lg" />
            <q-btn label="点击搜索" glossy color="primary" icon="search" @click="onSearch" />
        </div>
        <q-table :data="orders" :columns="columns" :pagination.sync="pagination" @request="onRequest">
            <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
                <q-td key="orderNo" :props="props">{{ props.row.orderNo }}</q-td>
                <q-td key="content" :props="props">{{ props.row.content }}</q-td>
                <q-td key="orderAmount" :props="props">{{ props.row.orderAmount }}</q-td>
                <q-td key="status" :props="props">{{ props.row.status | status }}</q-td>
                <q-td key="smsPhone" :props="props">{{ props.row.smsPhone }}</q-td>
                <q-td key="cdate" :props="props">{{ props.row.cdate }}</q-td>
            </q-tr>
        </q-table>
    </div>
</template>

<script>
export default {
    name: 'order',
    data () {
        return {
            orders: [],
            columns: [
                { name: 'orderNo', label: '订单号', field: 'orderNo', align: 'left' },
                { name: 'content', label: '内容', field: 'content', align: 'left' },
                { name: 'orderAmount', label: '金额', field: 'orderAmount', align: 'left' },
                { name: 'status', label: '状态', field: 'status', align: 'left' },
                { name: 'smsPhone', label: '电子票手机', field: 'smsPhone', align: 'left' },
                { name: 'cdate', label: '订单时间', field: 'cdate', align: 'left' }
            ],
            pagination: {
                rowsPerPage: 10, // 每页几行
                rowsNumber: 10, // 订单总数
                page: 1 // 当前第几页
            },
            phone: '',
            orderNo: ''
        }
    },
    mounted () {
        this.onRequest()
        this.getRowsNumberCount()
    },
    methods: {
        // 获取订单总数
        async getRowsNumberCount () {
            try {
                let res = await this.$axios.get(`/v1/plat/getSellOrderCount?${this.searchQuery}`)
                this.pagination.rowsNumber = res.data.data.count
            } catch (err) {
                console.log(err)
            }
        },
        // 表格内容请求
        onRequest (props) {
            if (props) {
                this.pagination = props.pagination
            }
            this.$axios.get(`/v1/plat/getSellOrder?${this.searchQuery}&${this.limitQuery}`).then(res => {
                this.orders = res.data.data
            })
        },
        // 搜索
        onSearch () {
            if (this.phone !== '' || this.orderNo !== '') {
                this.pagination = {
                    page: 1
                }
            } else {
                this.pagination = {
                    rowsPerPage: 10,
                    rowsNumber: 10,
                    page: 1
                }
            }
            this.onRequest()
            this.getRowsNumberCount()
        }
    },
    computed: {
        // 分页参数
        limitQuery () {
            if (this.phone !== '' || this.orderNo !== '') return ``
            return `limit=${this.pagination.rowsPerPage}&offset=${(this.pagination.page - 1) * this.pagination.rowsPerPage}`
        },
        // 搜索参数
        searchQuery () {
            let result = `projectId=${this.$route.query.proId}`
            if (this.phone !== '') result += `&phone=${this.phone}`
            if (this.orderNo !== '') result += `&orderNo=${this.orderNo}`
            return result
        }
    },
    filters: {
        // 订单状态名
        status (val) {
            switch (val) {
                case 0:
                    return '不完整'
                case 1:
                    return '待支付'
                case 2:
                    return '已支付'
                case 3:
                    return '已发货'
                case 4:
                    return '已收货'
                case 5:
                    return '已完成'
                case 6:
                    return '已取消'
            }
        }
    }
}
</script>
