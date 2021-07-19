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
      <router-view/>    <!-- コンポーネントの呼出し -->
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
