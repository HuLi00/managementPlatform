<template>
  <div>
    <h2>这里是主页，开始展示</h2>
    <button @click="logout">注销</button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return{

      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped>

</style>