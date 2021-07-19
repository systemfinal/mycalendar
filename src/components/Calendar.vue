<template>
<div>
    <h2 class="ml-10 mt-2">{{ currentDate.format("YYYY年MM月") }}</h2>
    <v-btn @click="prevMonth" color="primary" elevation="2" outlined class="ml-10 mb-2 pa-4">前月</v-btn>
    <v-btn @click="nextMonth" color="primary" elevation="2" outlined class="ml-2 mb-2 pa-4">次月</v-btn>
    <v-container class="indigo lighten-3 mt-2">
        <v-row no-gutters rows=1 style="height: 30px;"
            justify="center" align-content="center" class="indigo lighten-3 pl-1">
            <v-col cols=n v-for="n in 7" v-bind:key="n">
                <v-card class="text-center mr-1 mb-1" color="yellow lighten-4" height=25 tile outlined >
                    {{ getYoubi(n-1) }}
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters rows=rowIndex v-for="(week, rowIndex) in calendars" v-bind:key="rowIndex"
            style="height: 125px;"
            justify="center" align-content="center" class="indigo lighten-3 pl-1" >
            <v-col cols=colIndex v-for="(day, colIndex) in week" v-bind:key="colIndex">
                <v-card class="text-center pa-2 mr-1 mb-1" 
                        height=120 outlined tile 
                        v-bind:color="getColor(day)" 
                        @dblclick="dblClickDay(day.fullDate,rowIndex,colIndex)">
                    <p v-if="day.fullDate == nowDate.format('YYYY-MM-DD')" class="font-weight-bold" this.backColor="primary">
                        {{ day.date }}
                    </p>
                    <p v-else-if="day.fullDate.slice(0,7) != currentDate.format('YYYY-MM')" class="grey--text" >
                        {{ day.date }}
                    </p>
                    <p v-else-if="colIndex === 0" class="red--text">
                        {{ day.date }}
                    </p>
                    <p v-else-if="colIndex === 6" class="blue--text">
                        {{ day.date }}
                    </p>
                    <p v-else class="black--text">
                        {{ day.date }}
                    </p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</div>
</template>

<script>
import moment from "moment";
export default {
    data() {
        return {
            nowDate: moment(),        // 現在日付に現在時刻を取得する
            currentDate: moment(),    // 対象日付に現在時刻を取得する
        };
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
        getCalendar() {
            // 既に検索済みの対象日があるかチェックを行う
            if(sessionStorage.getItem('selectDate')){    // セッションに対象日が有る
                // 対象日にセッションの値を設定する
                this.currentDate = moment(sessionStorage.getItem('selectDate'),"YYYY-MM-DD");
            }else{
                // セッションに対象日を設定する
                sessionStorage.setItem('selectDate',this.currentDate.format("YYYY-MM-DD"));
            }

            let startDate = this.getStartDate();  // カレンダーの最初の日付
            const endDate = this.getEndDate();    // カレンダーの最後の日付
            const weekNumber = Math.ceil(endDate.diff(startDate, "days") / 7);    // カレンダーの行数

            let calendars = [];
            for (let week = 0; week < weekNumber; week++) {    // 行数分の繰り返し
                let weekRow = [];
                for (let day = 0;  day < 7; day++) {    // 列数分の繰り返し（曜日の数）
                    // 週配列の最後尾に対象日付を追加する
                    weekRow.push({
                        date: startDate.get("date"),
                        fullDate: startDate.get("year") + "-" + 
                                  ("0" + (startDate.get("month") + 1)).slice(-2) + "-" + 
                                  ("0" + startDate.get("date")).slice(-2),
                    });
                    startDate.add(1, "days");    // 対象日付のインクリメント
                }
                // カレンダー配列の最後尾に週配列を追加する
                calendars.push(weekRow);
            }
            return calendars;
        },
        nextMonth() {
            this.currentDate = moment(this.currentDate).add(1, "month");
            // セッションに対象日を設定する
            sessionStorage.setItem('selectDate',this.currentDate.format("YYYY-MM-DD"));
        },
        prevMonth() {
            this.currentDate = moment(this.currentDate).subtract(1, "month");
            // セッションに対象日を設定する
            sessionStorage.setItem('selectDate',this.currentDate.format("YYYY-MM-DD"));
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
        dblClickDay(selectDate, rowIndex, colIndex){
            alert(selectDate + " rowIndex=" + rowIndex + " colIndex=" + colIndex);
            this.$router.push({ name: "Details", params: {selectDate: selectDate}}).catch(() => {});
        }
    },
    computed: {
        calendars() {
            return this.getCalendar();
        }
    },
}
</script>
