<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar app color="primary" dark >
      <div class="d-flex align-center">
        <v-toolbar-title class="headline text-uppercase">
          <span class="ml-6">スケジュール表</span>
        </v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- メイン -->
    <v-main>
      <transition mode="out-in">
          <router-view/>    <!-- コンポーネントの呼出し -->
      </transition>
    </v-main>

    <!-- フッター -->
    <v-footer app color="primary">
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App',

    data: () => ({
      //
    }),
  };
</script>

<style>
  .v-enter {
    transform: translate(-100px, 0);
    opacity: 0;
  }
  .v-enter-to {
    opacity: 1;
  }
  .v-enter-active {
    transition: all 1s 0s ease;
  }
  .v-leave {
    transform: translate(0, 0);
    opacity: 1;
  }
  .v-leave-to {
    transform: translate(100px, 0);
    opacity: 0;
  }
  .v-leave-active {
    transition: all .5s 0s ease;
  }  
</style>
