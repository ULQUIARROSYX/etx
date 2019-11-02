<template>
  <div class="fixed-center text-center">
    <p>
      <q-icon name="sentiment_very_dissatisfied" size="150px" color="info" />
    </p>
    <p class="text-faded">抱歉，此页面出错，请点击返回...<strong>(404)</strong></p>
    <q-btn color="secondary" style="width:200px;" @click="$router.push('/')">Go back</q-btn>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
