<template>
  <div id="app">
    <div class="header">
      <div class="logo" @click="$router.push({path: '/'})">Ws Mock Server</div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
.header {
  height: 100px;
  border: 1px solid #ccc;
}
.logo {
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  text-align: center;
  width: 250px;
  cursor: pointer;
}
</style>
