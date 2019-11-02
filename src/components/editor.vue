<template>
  <div>
    <!-- 图片上传组件-->
    <input class="avatar2-uploader" ref="inputer" type="file" file-model="image" name="image" nv-file-select uploader="uploader" @change="uploadImg"
      style="display:none" />
    <quill-editor class="editor" v-model="content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
  </div>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  ['image'] // 链接、图片、视频
]
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
export default {
  name: 'Editor',
  props: {
    /* 编辑器的内容 */
    value: {
      type: String
    },
    /* 图片大小 */
    maxSize: {
      type: Number,
      default: 4000 // kb
    }
  },
  components: {
    quillEditor
  },
  data () {
    return {
      content: this.value,
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '您想说点什么？',
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar2-uploader').click()
                  console.log(this.$refs.inputer)
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    onEditorChange () {
      // 内容改变事件
      this.$emit('input', this.content)
    },
    uploadImg () {
      const url = this.$store.state.opInfo.uploadBaseUrl
      const formData = new FormData()
      formData.append('img', this.$refs.inputer.files[0])
      this.$axios.post(url, formData)
        .then(res => {
          if (res.data.code === 0) {
            // 获取富文本组件实例
            const quill = this.$refs.myQuillEditor.quill
            // 获取光标所在位置
            const length = quill.getSelection().index
            // 插入图片  res.url为服务器返回的图片地址
            quill.insertEmbed(length, 'image', res.data.data.preview)
            // 调整光标到图片后
            quill.setSelection(length + 1)
          } else {
            this.notifyError('上传失败，请刷新重试')
          }
        })
    },
    mounted () {
      this.content = this.value
    }
  }
}
</script>
<style>
.editor {
  line-height: normal !important;
  height: auto;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip {
  z-index: 10000;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
