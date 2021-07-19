<template>
  <v-container>
      <v-card
        width="100%"
        class="pa-md-4 mx-lg-auto"
        justify="center" 
        elevation="2"
      >
          <v-app-bar dark color="green lighten-2" class="mb-5">
            <v-toolbar-title class="text-h6">対象日付： {{ currentDate }} </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="addData()" color="white" outlined class="px-2 py-1">新規追加</v-btn>
            <v-btn icon @click="$router.back()">
              <v-icon large>mdi-arrow-left-bold-box-outline</v-icon>
            </v-btn>
          </v-app-bar>

          <div v-for="(memo, i) in memos.data" :key="i" >
            <v-row no-gutters class="mb-10">
              <v-col cols="11"> 
                  <v-card flat>
                    <v-card class="text-h6 mb-2 px-2 py-1" id="title" color="blue lighten-3">{{memo.title}}</v-card>
                    <v-card class="mb-2 px-2 py-1" id="text">{{memo.text}}</v-card>
                    <v-card class="mb-2 px-2 py-1" id="datestart">{{memo.datestart | getHHmm}} から</v-card>
                    <v-card class="mb-2 px-2 py-1" id="usemin">{{memo.usemin}} 分間の予定</v-card>
                    <v-card class="mb-2 px-2 py-0" id="level">
                        <v-radio-group v-model="memo.level" row dense readonly>
                          <v-radio
                            label="重要度１"
                            color="blue"
                            :value="1"
                          ></v-radio>
                          <v-radio
                            label="重要度２"
                            color="yellow darken-3"
                            :value="2"
                          ></v-radio>
                          <v-radio
                            label="重要度３"
                            color="red"
                            :value="3"
                          ></v-radio>
                        </v-radio-group>
                    </v-card>
                  </v-card>
              </v-col>
              <v-col cols="1">
                  <v-row no-gutters class="mb-1">
                    <v-col>
                      <v-btn @click="updateData(memo)" color="blue" elevation="2" outlined class="ml-2 mb-2 pa-4">更新</v-btn>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mb-1">
                    <v-col>
                      <v-btn @click="deleteData(memo.id)" color="red" elevation="2" outlined class="ml-2 mb-2 pa-4">削除</v-btn>
                    </v-col>
                  </v-row>
              </v-col>
            </v-row>
          </div>
      </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Details",
  data() {
      return {
          memos: [],
          currentDate: null,
      }
  },
  methods: {
    addData(){
      alert(this.currentDate);
      this.$router.push({ name: "SaveMemo", 
                          params: {
                            selectDate: this.currentDate,
                            memo: {
                              id: null,
                              title: null,
                              text: null,
                              datestart: this.currentDate + " 00:00:00",
                              usemin: 60,
                              level: 1,
                            }}}).catch(() => {});
      return;
    },
    updateData(record){
      alert(JSON.stringify(record));
      this.$router.push({ name: "SaveMemo", 
                          params: {selectDate: this.currentDate,
                                   memo: record }}).catch(() => {});
      return;
    },
    deleteData(uniqKey){
      alert(uniqKey);
      if(uniqKey){
        console.log("deleteData(" + uniqKey + ").DELETE Start");
        axios.delete(`https://sysfin-nodeapp1.herokuapp.com/api/v1/memo/` + uniqKey)
        .then(respons => {
            console.log(JSON.stringify(respons));
            // 対象日のメモデータを再取得する
            this.getMemoData(this.currentDate);
        })
        .catch(error => alert(JSON.stringify(error)))
      }
      return;
    },
    getMemoData(targetDate){
      // 対象日時のメモデータの取得
      axios.get(`https://sysfin-nodeapp1.herokuapp.com/api/v1/memo/search?datestart=` + targetDate)
      .then(respons => {
          this.memos = respons.data;
          console.log(respons.status);
          console.log(JSON.stringify(this.memos));

          // 作業日時で昇順にソートする
          this.memos.data.sort(function(a, b) {
            let datestartA = moment.utc(a.datestart).format('HH:mm');
            let datestartB = moment.utc(b.datestart).format('HH:mm');
            if (datestartA < datestartB) return -1;
            if (datestartA > datestartB) return 1;
            return 0;
          });

      }).catch(error => alert("get memo data error : " + JSON.stringify(error)))

      return;
    },
  },
  props: {
      selectDate: {
          type: String,
      }
  },
  created() {
      console.log("Start created()");

      // 既に検索済みの対象日があるかチェックを行う
      if(this.selectDate){    // 引数に日付があるなら
          // セッションに対象日を設定する
          sessionStorage.setItem('selectDate2', this.selectDate);
          // プロパティへ対象日を保存
          this.currentDate = this.selectDate;
      }
      else if(sessionStorage.getItem('selectDate2')){    // セッションに対象日が有る
          // 対象日プロパティにセッションの値を設定する
          this.currentDate = sessionStorage.getItem('selectDate2');
      }else{
          alert("プログラムエラー（対象日が不明）");
      }

      // 対象日のメモデータを取得する
      this.getMemoData(this.currentDate);
  },
  filters: {
      getHHmm: function (date) {
          return moment.utc(date).format('HH:mm');  // 日付をローカライズする
      },
  },  
};
</script>
