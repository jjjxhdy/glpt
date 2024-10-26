<template>
  <div id="app" >
    
    
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  mounted(){
    document.title="海南好思达"
  }
};
</script>
<style>
html,
body,
#app,
p {
  margin: 0;
  height: 100%;
}
</style>
