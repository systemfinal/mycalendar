<template>
  <v-container>
      <v-card
        width="100%"
        class="pa-md-4 mx-lg-auto"
        justify="center" 
        elevation="2"
      >
        <v-app-bar dark color="green lighten-2" class="mb-5">
            <v-toolbar-title class="text-h6">対象日付： {{ selectDate }} </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn ref="control7" @click="saveData(request)" 
                   color="white" outlined class="px-2 py-1" >保存</v-btn>
            <v-btn ref="control8" icon @click="$router.back()" >
              <v-icon large>mdi-arrow-left-bold-box-outline</v-icon>
            </v-btn>
        </v-app-bar>

        <template v-if="isError">
            <v-card flat tile class="white--text text-h6 mb-4 px-2 wrap" color="red">{{ errorString }}</v-card>
        </template>

        <v-row no-gutters class="mb-1">
            <v-col cols="12"> 
                <v-card flat>
                    <v-text-field class="text-h6" label="タイトル" ref="control1" maxlength="20"
                    counter outlined dense clearable color="blue"
                    v-model="request.title"></v-text-field>
                    
                    <v-textarea label="予定作業" ref="control2" maxlength="100" 
                    counter outlined dense clearable color="blue" auto-grow rows="1" 
                    v-model="request.text"></v-textarea>
                    
                    <v-menu
                        ref="menu1" 
                        v-model="menuDate"
                        :close-on-content-click="false"
                        :nudge-right="100"
                        transition="scale-transition"
                        offset-y
                    >                    
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="dateStart"
                                label="開始日付"
                                outlined dense readonly required color="blue" 
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker 
                            locale="ja-jp" 
                            :day-format="dateStart => new Date(dateStart).getDate()"
                            v-model="dateStart" @input="menuDate = false">
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="blue"
                                    @click="menuDate = false"
                                >
                                    Cancel
                                </v-btn>
                        </v-date-picker>
                    </v-menu>

                    <v-menu
                        ref="menu2" 
                        v-model="menuTime"
                        :close-on-content-click="false"
                        :nudge-right="100"
                        :return-value.sync="timeStart"
                        transition="scale-transition"
                        offset-y
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="timeStart"
                                label="開始時間"
                                v-bind="attrs"
                                v-on="on"
                                outlined dense readonly required color="blue" 
                            >
                            </v-text-field>
                        </template>
                            <v-time-picker
                            v-if="menuTime"
                            v-model="timeStart"
                            @click:minute="$refs.menu2.save(timeStart)"
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="blue"
                                    @click="menuTime = false"
                                >
                                    Cancel
                                </v-btn>
                        </v-time-picker>
                    </v-menu>

                    <v-text-field label="作業時間（分単位：スライダーで設定してください）"                    
                    outlined dense color="blue" readonly 
                    v-model="request.usemin"></v-text-field>

                    <v-slider
                        ref="control5" 
                        v-model="request.usemin"
                        track-color="grey"
                        always-dirty
                        min="1"
                        max="1440"
                    >
                        <template v-slot:prepend>
                            <v-icon @click="decrement" >
                            mdi-minus-thick
                            </v-icon>
                        </template>

                        <template v-slot:append>
                            <v-icon @click="increment" >
                            mdi-plus-thick
                            </v-icon>
                        </template>
                    </v-slider>
                    
                    <v-card class="mb-2 px-2 py-0" outlined>
                        <v-radio-group ref="control6" v-model="request.level" row dense>
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
        </v-row>
      </v-card>
  </v-container>
</template>

<style>
    @import "../style/MyStyle.css";
</style>

<script>
import axios from "axios";
import moment from "moment";
import joi from "joi-browser";
import constants from "../common/constants";
export default {
    name: "SaveMemo",
    data() {
        return {
            request: {},
            consts: {},
            dateStart: null,
            timeStart: null,
            menuDate: false,
            menuTime: false,
            schema : null,
            isError: false,
            errorString: "",
        }
    },
    methods: {
        checkInput(record){
            //console.log("checkInput() Start");
            //console.log(JSON.stringify(record));

            // エラー表示領域のクリアー
            this.isError = false;
            this.errorString = "";

            // パラメータチェックの実行 
            //var {error, value} = this.schema.validate(record, { abortEarly: false })
            var {error} = this.schema.validate(record, { abortEarly: false })
            if(error){
                //console.log("check Error !!!");
                //console.log(error.message);
                //error.details.forEach(element => console.log(element.Error));
                //error.details.forEach(element => this.errorString = (this.errorString + element.Error + "\r\n") );
                this.errorString = error.message;
                this.isError = true;
                return(false);        
            } else {
                //console.log('all check OK !!!');
                //alert(JSON.stringify(value));
            }
            return(true);
        },
        saveData(record){
            //console.log("saveData() Start");

            // 開始日付の編集
            if(this.dateStart && this.timeStart){
                record.datestart = this.dateStart + " " + this.timeStart + ":00";
            }else{
                record.datestart = null;
            }

            // 入力値をチェックする
            if(!this.checkInput({title: record.title,
                                 text: record.text,
                                 datestart: record.datestart})
            ){
                return;
            }

            if(record.id){    // 更新作業（ＰＵＴ）
                //console.log("saveData().PUT Start");

                axios.put(`https://sysfin-nodeapp1.herokuapp.com/api/v1/memo/` + record.id, record)
                .then(() => {
                    //console.log(JSON.stringify(respons));
                })
                .catch(error => alert(JSON.stringify(error)))

            }else{            // 新規追加作業（ＰＯＳＴ）
                //console.log("saveData().POST Start");

                axios.post(`https://sysfin-nodeapp1.herokuapp.com/api/v1/memo/`, 
                    { title: record.title,
                      text: record.text,
                      datestart: record.datestart,
                      usemin: record.usemin,
                      level: record.level }
                )
                .then(() => {
                    //console.log(JSON.stringify(respons));
                })
                .catch(error => alert(JSON.stringify(error)))

            }
            return;
        },
        decrement () {
            this.request.usemin--;
        },
        increment () {
            this.request.usemin++;
        },
    },
    props: {
        selectDate: {
            type: String,
        },
        memo: {
            type: Object,
        },
    },
    created() {
        if(!this.memo){    // パラメータがないので直接呼出しということになる
          alert("このページを直接に開くことはできません。");
          this.$router.push({ path: '/' });    // ルート画面を呼ぶ
          return;
        }
        // ローカルへコピーする
        this.request = this.memo;
        this.consts = constants;

        // エラー検証の設定（joi-browser）
        this.schema = joi.object().keys({
            title: joi.string().max(this.consts.max_title_len).required().error(new Error('タイトルを入力してください。')),
            text: joi.string().max(this.consts.max_text_len).required().error(new Error('作業予定を入力してください。')),
            datestart: joi.date().required().error(new Error('開始日付および時間を入力してください。'))
        });

        // 作業開始日付をローカライズ編集してプロパティへ保管する
        if(this.memo.datestart){
            this.dateStart = moment.utc(this.request.datestart).format('YYYY-MM-DD');  // 日時
            this.timeStart = moment.utc(this.request.datestart).format('HH:mm');   // 時分
        }else{
            this.dateStart = null;   // 日時
            this.timeStart = null;   // 時分
        }
    },
    mounted () {
        // 初期フォーカスの設定
        this.$refs.control1.focus(); 
    },
}    
</script>
