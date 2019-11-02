<template>
  <div>
    <Edit v-model="content" class="q-mt-xs" />
    <q-btn class="q-my-lg" label="测试" @click="demo" glossy color="info" />
  </div>
</template>
<script>
export default {
  name: 'demo',
  data () {
    return {
      content: null
    }
  },
  methods: {
    demo () {
      this.$axios.get('/v1/plat/getAgent?companyId=2')
        .then(res => console.log(res))
    }
  },
  components: { Edit: () => import('components/editor') }
}
</script>
