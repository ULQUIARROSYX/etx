export const myMixin = {
    data () {
        return {
            rules: {
                required: val => (val !== null && val !== undefined && val !== '' && val.length > 0) || '不可为空'
            }
        }
    },
    methods: {
        // 检测表单是否有格式错误
        formError (arr) {
            arr.forEach(item => {
                if (this.$refs[item].$refs[item]) {
                    this.$refs[item].$refs[item].validate()
                } else {
                    this.$refs[item].validate()
                }
            })
            let result = arr.some(item => {
                if (this.$refs[item].$refs[item]) {
                    return this.$refs[item].$refs[item].validate()
                } else {
                    return this.$refs[item].hasError
                }
            })
            if (result) {
                this.notifyError('表单格式不正确')
                return result
            } else {
                return result
            }
        },
        // 成功通知
        notifySuccess (msg) {
            this.$q.notify({
                position: 'top',
                color: 'positive',
                icon: 'check_circle',
                message: msg
            })
        },
        // 错误通知
        notifyError (msg) {
            this.$q.notify({
                position: 'top',
                color: 'negative',
                icon: 'report_problem',
                message: msg
            })
        },
        // 警告通知
        notifyWarning (msg) {
            this.$q.notify({
                position: 'top',
                color: 'warning',
                icon: 'report_problem',
                message: msg
            })
        }
    }
}
