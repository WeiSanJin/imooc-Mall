<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="./">Home</a>
        <slot name="bread"></slot>
      </nav>
    </div>
  </div>
</template>

<script>
    export default {
        name: "NacBread"
    }
</script>

<style scoped>

</style>
