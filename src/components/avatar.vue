<template>
    <div>
        <div class="upload-wrap anticon" nv-file-drop="" uploader="uploader">
            <!-- input鼠标悬浮时有提示文字，所以用label替代 -->
            <label class="file-ele">
                <input
                    class="file-ele"
                    ref="inputer1"
                    type="file"
                    file-model="image"
                    name="image"
                    nv-file-select
                    uploader="uploader"
                    @change="uploadImg"
                    style="display:none"
                />
            </label>
            <div class="upLoadIconContainer">
                <img v-if="proImageUrl" :src="proImageUrl" class="previewImg" />
                <q-icon v-else name="add" size="30px" color="info" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'avatar',
    props: {
        value: {
            type: String
        },
        preview: {
            type: String
        }
    },
    data () {
        return {
            proImageUrl: ''
        }
    },
    methods: {
        uploadImg () {
            const url = this.$store.state.opInfo.uploadBaseUrl
            const formData = new FormData()
            formData.append('img', this.$refs.inputer1.files[0])
            this.$axios.post(url, formData).then(res => {
                if (res.data.code === 0) {
                    this.proImageUrl = res.data.data.preview
                    this.$emit('input', res.data.data.imgUrl)
                } else {
                    this.notifyError('上传失败，请刷新重试')
                }
            })
        }
    },
    mounted () {
        this.proImageUrl = this.preview
    },
    watch: {
        preview () {
            this.proImageUrl = this.preview
        }
    }
}
</script>
<style>
.upload-wrap {
    position: relative;
    display: inline-block;
    overflow: hidden;
}
.upload-wrap .file-ele {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
    z-index: 1;
}
.upload-wrap .file-open {
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
}
.previewImg {
    max-width: 500px !important;
    max-height: 178px !important;
    display: block;
}
.upLoadIconContainer {
    min-width: 100px !important;
    min-height: 100px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgb(199, 199, 199);
    border-radius: 5px;
    z-index: -1;
}
.upLoadIconContainer:hover {
    border: 1px dashed rgb(111, 154, 219);
}
</style>
