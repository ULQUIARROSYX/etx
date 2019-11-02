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
            <q-breadcrumbs-el label="场地管理" />
        </q-breadcrumbs>
        <!--场馆管理-->
        <div class="row justify-between items-center">
            <div class="col infoGroupTitle">场馆列表</div>
            <q-btn
                color="secondary"
                icon="add_box"
                glossy
                label="添加新场馆"
                @click="placeChange()"
            ></q-btn>
        </div>
        <q-table
            class="q-mt-md q-mb-lg"
            :data="placeData.data"
            :columns="placeData.columns"
            :pagination.sync="pagination"
            row-key="name"
        >
            <!--表格主体-->
            <q-tr
                slot="body"
                slot-scope="props"
                :props="props"
                @click.native="placeChange(props.row.venuesId)"
                class="cursor-pointer"
            >
                <q-td
                    key="venuesId"
                    :props="props"
                >{{ props.row.venuesId }}</q-td>
                <q-td
                    key="name"
                    :props="props"
                >{{ props.row.name }}</q-td>
                <q-td
                    key="province"
                    :props="props"
                >{{ props.row.province }}</q-td>
                <q-td
                    key="city"
                    :props="props"
                >{{ props.row.city }}</q-td>
                <q-td
                    key="area"
                    :props="props"
                >{{ props.row.area }}</q-td>
                <q-td
                    key="address"
                    :props="props"
                >{{ props.row.address }}</q-td>
            </q-tr>
        </q-table>

    </div>
</template>

<script>
export default {
    name: 'place',
    data: () => ({
        loading: false,
        placeData: {
            columns: [
                { name: 'venuesId', label: '场地id', field: 'venuesId', align: 'left' },
                { name: 'name', label: '场地名', field: 'name', align: 'left' },
                { name: 'province', label: '省', field: 'province', align: 'left' },
                { name: 'city', label: '市', field: 'city', align: 'left' },
                { name: 'area', label: '区', field: 'area', align: 'left' },
                { name: 'address', label: '地址', field: 'address', align: 'left' }
            ],
            data: []
        },
        pagination: {
            rowsPerPage: 10
        }
    }),
    mounted () {
        this.getPlaceList()
    },
    methods: {
        // 编辑公司信息
        placeChange (id) {
            if (id) {
                this.toPath('/plat/system/base/venues/editVenues', { venuesId: id })
            } else {
                this.toPath('/plat/system/base/venues/editVenues')
            }
        },
        // 获取全部信息
        getPlaceList () {
            this.$axios
                .get('/v1/plat/getVenues')
                .then(res => { this.placeData.data = res.data.data })
        }
    }
}
</script>

<style scoped>
</style>
