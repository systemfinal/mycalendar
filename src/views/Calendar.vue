<template>
<div>
    <div class="modal-mask" v-if="isLoading === true">
        <vue-loading type="spiningDubbles" color="blue" :size="{ width: '100px', height: '100px'}"></vue-loading>
    </div>
    <h2 class="ml-10 mt-2">{{ currentDate.format("YYYY年MM月") }}</h2>
    <v-btn @click="prevMonth" color="primary" elevation="2" outlined class="ml-10 mb-1 pa-4">前月</v-btn>
    <v-btn @click="nextMonth" color="primary" elevation="2" outlined class="ml-2 mb-1 pa-4">次月</v-btn>
    <v-container class="indigo lighten-3 my-4">
        <v-row no-gutters rows=1 style="height: 30px;"
            justify="center" align-content="center" class="indigo lighten-3 pl-1">
            <v-col cols=1.7 v-for="n in 7" v-bind:key="n">
                <v-card class="text-center mt-1 mr-1 mb-1 black--text" color="yellow lighten-4" height=25 tile outlined >
                    {{ getYoubi(n-1) }}
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters rows=1 v-for="(week, rowIndex) in calendars" v-bind:key="rowIndex"
            style="height: 125px;"
            justify="center" align-content="center" class="indigo lighten-3 pl-1" >
            <v-col cols=1.7 v-for="(day, colIndex) in week" v-bind:key="colIndex">
                <v-card class="text-center pa-2 mr-1 mb-1" 
                        height=120 outlined tile 
                        v-bind:color="getColor(day)" 
                        @dblclick="moveDetails(day.fullDate)">
                    <v-btn rounded v-if="day.fullDate == nowDate.format('YYYY-MM-DD')" color="light-green lighten-2" 
                        class="font-weight-bold black--text" elevation="0"
                        @click="moveDetails(day.fullDate)">
                            {{ day.date }} 
                    </v-btn>
                    <v-btn rounded text v-else-if="day.fullDate.slice(0,7) != currentDate.format('YYYY-MM')" class="grey--text" 
                        @click="moveDetails(day.fullDate)">
                            {{ day.date }}
                    </v-btn>
                    <v-btn rounded text v-else-if="colIndex === 0" class="red--text"
                        @click="moveDetails(day.fullDate)">
                            {{ day.date }}
                    </v-btn>
                    <v-btn rounded text v-else-if="colIndex === 6" class="blue--text"
                        @click="moveDetails(day.fullDate)">
                            {{ day.date }}
                    </v-btn>
                    <v-btn rounded text v-else class="black--text"
                        @click="moveDetails(day.fullDate,rowIndex,colIndex)">
                            {{ day.date }}
                    </v-btn>
                    <v-row no-gutters rows=1 class="mt-7 ml-1">
                        <v-icon v-if="day.level == 1" large color="blue lighten-3">mdi-clock</v-icon>
                        <v-icon v-else-if="day.level == 2" large color="yellow darken-2">mdi-clock</v-icon>
                        <v-icon v-else-if="day.level == 3" large color="red lighten-3">mdi-clock</v-icon>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { VueLoading } from "vue-loading-template";    // VueLoadingの名前付きインポート
export default {
    data() {
        return {
            nowDate: moment(),        // 現在日付に現在時刻を取得する
            currentDate: moment(),    // 対象日付に現在時刻を取得する
            calendars: [],            // カレンダーデータ保存領域
            memos: [],                // メモデータ保存領域
            isLoading: true,          // ローディングフラグ
        };
    },
    components: {
        VueLoading
    },    
    methods: {
        getStartDate() {
            let date = moment(this.currentDate);
            date.startOf("month");
            const youbiNum = date.day();
            return date.subtract(youbiNum, "days");
        },
        getEndDate() {
            let date = moment(this.currentDate);
            date.endOf("month");
            const youbiNum = date.day();
            return date.add(6 - youbiNum, "days");
        },    
        async getCalendar(memoData) {
            let startDate = this.getStartDate();  // カレンダーの最初の日付
            let endDate = this.getEndDate();    // カレンダーの最後の日付
            let weekNumber = Math.ceil(endDate.diff(startDate, "days") / 7);    // カレンダーの行数
            
            let calendars = [];
            for (let week = 0; week < weekNumber; week++) {    // 行数分の繰り返し
                let weekRow = [];
                for (let day = 0;  day < 7; day++) {    // 列数分の繰り返し（曜日の数）

                    let target = memoData.data.filter((val) => {
                        return (moment.utc(val.datestart).format('YYYY-MM-DD') == moment(startDate).format('YYYY-MM-DD'));
                    });
                    let targetLevel = null;
                    if(0 < target.length){
                        // 日ごとに重要度を降順で取得
                        target.sort(function(a,b){
                            if (a.level > b.level ) return -1;
                            if (b.level > a.level ) return 1;
                            return 0;
                        })
                        // 最重要度を取得
                        targetLevel = target[0].level;
                    }

                    // 週配列の最後尾に対象日付を追加する
                    weekRow.push({
                        date: startDate.get("date"),
                        fullDate: moment(startDate).format('YYYY-MM-DD'),
                        level: targetLevel,
                    });
                    startDate.add(1, "days");    // 対象日付のインクリメント
                }
                // カレンダー配列の最後尾に週配列を追加する
                calendars.push(weekRow);
            }
            return calendars;
        },
        async getMemoData(startDate, endDate){
            let memoData = null;

            // 対象日時のメモデータの取得
            await axios.get(`https://sysfin-nodeapp1.herokuapp.com/api/v1/memo/search?datestart=` + startDate + `&dateend=` + endDate)
            .then(respons => {
                //console.log("API respons.data = " + JSON.stringify(respons.data));
                memoData = respons.data;
            })
            .catch(error => { 
                alert("getMemoData Error : " + JSON.stringify(error));
            })
            return(memoData);
        },
        async nextMonth() {
            // 対象月を次月にする
            this.currentDate = moment(this.currentDate).add(1, "month");
            // セッションに対象日を設定する
            sessionStorage.setItem('selectDate',this.currentDate.format("YYYY-MM-DD"));
            // 開始日から終了日までのメモデータを取得する
            let memoData = await this.getMemoData(moment(this.getStartDate()).format('YYYY-MM-DD'),
                                            moment(this.getEndDate()).format('YYYY-MM-DD'));
            // カレンダーデータを取得する
            this.calendars = await this.getCalendar(memoData);
            // プロパティへメモデータをコピーする
            this.memos = memoData;    
        },
        async prevMonth() {
            // 対象月を前月にする
            this.currentDate = moment(this.currentDate).subtract(1, "month");
            // セッションに対象日を設定する
            sessionStorage.setItem('selectDate',this.currentDate.format("YYYY-MM-DD"));
            // 開始日から終了日までのメモデータを取得する
            let memoData = await this.getMemoData(moment(this.getStartDate()).format('YYYY-MM-DD'),
                                            moment(this.getEndDate()).format('YYYY-MM-DD'));
            // カレンダーデータを取得する
            this.calendars = await this.getCalendar(memoData);
            // プロパティへメモデータをコピーする
            this.memos = memoData;    
        },
        getYoubi(dayIndex) {
            const week = ["日", "月", "火", "水", "木", "金", "土"];
            return week[dayIndex];
        },
        getColor(targetDate) {
            if(targetDate.fullDate == this.nowDate.format('YYYY-MM-DD')){
                return("red lighten-4");
            }else{
                return("white");
            }
        },
        moveDetails(selectDate){
            //console.log("日付クリック " + selectDate + " rowIndex=" + rowIndex + " colIndex=" + colIndex);
            this.$router.push({ name: "Details", params: {selectDate: selectDate}}).catch(() => {});
        },
        async getSessionData(){
            // 既に検索済みの対象日があるかチェックを行う
            if(sessionStorage.getItem('selectDate')){    // セッションに対象日が有る
                // 対象日にセッションの値を設定する
                this.currentDate = moment(sessionStorage.getItem('selectDate'),"YYYY-MM-DD");
            }else{
                // セッションに対象日を設定する
                sessionStorage.setItem('selectDate',this.currentDate.format("YYYY-MM-DD"));
            }
            return(true);
        },
    },
    created() {
        ( async() => { 
            //console.log("created Start");

            //console.log("getSessionData Start");
            // セッションデータを取得および設定する
            await this.getSessionData();
            //console.log("getSessionData End");

            //console.log("getMemoData Start " + moment().format('HH:mm:ss.SSS'));
            // 開始日から終了日までのメモデータを取得する
            let memoData = await this.getMemoData(moment(this.getStartDate()).format('YYYY-MM-DD'),
                                                    moment(this.getEndDate()).format('YYYY-MM-DD'));
            //console.log("getMemoData End " + moment().format('HH:mm:ss.SSS'));
            this.isLoading = false;    // ローティング画面を閉じる

            if(memoData){
                //console.log("getCalendar Start");
                // カレンダーデータを取得する
                this.calendars = await this.getCalendar(memoData);
                //console.log("getCalendar End");
                // プロパティへメモデータをコピーする
                this.memos = memoData;    
            }else{
                //console.log("memoData = " + JSON.stringify(memoData));
            }

            //console.log("created End");
        })();
    },
}
</script>

<style>
    @import "../style/MyStyle.css";
</style>

