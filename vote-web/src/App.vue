<template>
  <div id="app">
    <nav>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/manage">投票管理</router-link> |
        <router-link to="/vote">投票</router-link>
      </nav>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
