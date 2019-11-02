<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="消息通知" />
    </q-breadcrumbs>
    <div class="fixed-center text-center">
      <p>
        <q-icon name="sentiment_very_dissatisfied" size="150px" color="info" />
      </p>
      <p class="text-info">抱歉，此页面暂无内容...<strong>(404)</strong></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'message',
  data () {
    return {}
  }
}
</script>
