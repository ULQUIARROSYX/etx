// import something here

import 'src/css/public.css'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
    const vm = Vue.prototype
    // something to do
    // 成功通知
    vm.notifySuccess = msg => {
        vm.$q.notify({
            position: 'top',
            color: 'positive',
            icon: 'check_circle',
            message: msg
        })
    }
    // 错误通知
    vm.notifyError = msg => {
        vm.$q.notify({
            position: 'top',
            color: 'negative',
            icon: 'report_problem',
            message: msg
        })
    }
    // 警告通知
    vm.notifyWarning = msg => {
        vm.$q.notify({
            position: 'top',
            color: 'warning',
            icon: 'report_problem',
            message: msg
        })
    }
    // 表单提交完成
    vm.formComplete = res => {
        if (res.data.code === 0) {
            vm.$q
                .dialog({
                    title: '完成',
                    message: '表单提交成功'
                })
                .onOk(() => {
                    router.back(-1)
                })
        } else {
            vm.notifyError('提交失败，错误代码：code=' + res.data.code)
        }
    }
    // 路由跳转
    vm.toPath = (path, query) => {
        if (query) {
            router.push({ path: path, query: query })
        } else {
            router.push(path)
        }
    }
    vm.goPath = (path, query) => {
        if (query) {
            let routeUrl = router.resolve({ path: path, query: query })
            window.open(routeUrl.href, '_blank')
        } else {
            let routeUrl = router.resolve(path)
            window.open(routeUrl.href, '_blank')
        }
    }
    //   日期过滤规则
    vm.dateRules = val => {
        const regex =
            '^[1-2][0-9][0-9][0-9]-([1][0-2]|0?[1-9])-([12][0-9]|3[01]|0?[1-9]) ([01][0-9]|[2][0-3]):[0-5][0-9]:[0-5][0-9]$'
        let result = val.match(regex) !== null
        return result || '日期格式错误'
    }
}
