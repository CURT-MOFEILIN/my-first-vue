<template>
  <div class="info" id="app">
    <div v-if="$route.meta.keepAlive">
      <LeftNav ></LeftNav>
      <router-view></router-view>
    </div>
    <transition name="fade" mode="out-in" v-if="!$route.meta.keepAlive">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import LeftNav from '@/components/LeftNav'
export default {
  name: 'app',
  components: {
    LeftNav
  }
}
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
