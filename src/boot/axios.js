import axios from 'axios'
let baseURL = 'http://192.168.1.20:8888/etx'
// let baseURL = 'http://dev.gzetx.com:8080/etx'
// let baseURL = 'https://jia-1.cn/my/etx'

export default ({ app, router, Vue }) => {
    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000, // 超时时间
        validateStatus: function (status) {
            // 进入request拦截器，其他进入error拦截器
            return (status >= 200 && status < 300) || status === 401
        }
    })

    Vue.prototype.$axios = axiosInstance

    // request拦截器==>对请求做处理
    axiosInstance.interceptors.request.use(config => {
        Vue.prototype.$q.loading.show({ delay: 400 })
        const AUTH_TOKEN = localStorage.getItem('token')
        if (AUTH_TOKEN) {
            config.headers['Authorization'] = 'Bearer ' + AUTH_TOKEN
        }
        return config
    })

    // response拦截器==>对响应做处理
    axiosInstance.interceptors.response.use(
        response => {
            Vue.prototype.$q.loading.hide()
            switch (response.status) {
                case 401:
                    if (response.config.url === baseURL + '/v1/refreshToken') {
                        router.push('/login')
                        return response
                    }
                    return Refresh(response.config)

                default:
                    return response
            }
        },
        err => {
            // 响应错误处理
            Vue.prototype.$q.loading.hide()
            if (err && err.response) {
                switch (err.response.status) {
                    case 400:
                        notifyInfo('请求错误，错误代码：400')
                        break

                    case 403:
                        notifyInfo('拒绝访问，错误代码：403')
                        break

                    case 404:
                        notifyInfo('请求地址出错，错误代码：404')
                        break

                    case 405:
                        notifyInfo('不允许使用该方法，错误代码：405')
                        break

                    case 408:
                        notifyInfo('请求超时，错误代码：408')
                        break

                    case 500:
                        notifyInfo('服务器内部错误，错误代码：500')
                        break

                    case 501:
                        notifyInfo('服务未实现，错误代码：501')
                        break

                    case 502:
                        notifyInfo('网关错误，错误代码：502')
                        break

                    case 503:
                        notifyInfo('服务不可用，错误代码：503')
                        break

                    case 504:
                        notifyInfo('网关超时，错误代码：504')
                        break

                    case 505:
                        notifyInfo('HTTP版本不受支持，错误代码：505')
                        break
                    default:
                }
            } else {
                notifyInfo('请求失败，接口配置错误')
            }
            return Promise.reject(err)
        }
    )
    const notifyInfo = msg => {
        Vue.prototype.$q.notify({
            message: msg,
            position: 'top',
            color: 'negative'
        })
    }

    async function Refresh (config) {
        try {
            localStorage.setItem('token', localStorage.getItem('refreshToken'))
            let res = await axiosInstance.post('/v1/refreshToken')
            localStorage.setItem('token', res.data.data.accessToken)
            localStorage.setItem('refreshToken', res.data.data.refreshToken)
            if (res.status === 200) {
                let res2 = await axiosInstance(config)
                if (res2.status === 200) {
                    console.log('token过期，刷新并重新请求成功')
                    return res2
                }
            } else {
                console.log('刷新失败')
            }
        } catch (err) {
            console.log(err)
        }
    }
}
