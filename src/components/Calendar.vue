<template>
<div>
    <h2 class="ml-10 mt-2">{{ currentDate.format("YYYY年MM月") }} </h2>
    <v-btn @click="prevMonth" color="primary" elevation="2" outlined class="ml-10 mb-2 pa-4">前月</v-btn>
    <v-btn @click="nextMonth" color="primary" elevation="2" outlined class="ml-2 mb-2 pa-4">次月</v-btn>
    <v-container class="indigo lighten-3 mt-2">
        <v-row no-gutters rows=index v-for="(week, rowIndex) in calendars" v-bind:key="rowIndex"
            style="height: 125px;"
            justify="center" align-content="center" class="indigo lighten-3 pl-1"
        >
            <v-col cols=index v-for="(day, colIndex) in week" v-bind:key="colIndex">
                <v-card class="pa-2 mr-1 mb-1" color="grey lighten-3" height=120 outlined tile @dblclick="dblClickDay(day.fullDate,rowIndex,colIndex)">
                    {{ day.date }}
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
            currentDate: moment(),    // 現在時刻を取得する
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
                        fullDate: startDate.get("year") + "/" + 
                                  ("0" + (startDate.get("month") + 1)).slice(-2) + "/" + 
                                  ("0" + startDate.get("date")).slice(-2),
                    });
                    startDate.add(1, "days");    // 対象日付のインクリメント
                }
                // カレンダー配列の最後尾に週配列を追加する
                calendars.push(weekRow);
            }
            //console.log(calendars);
            return calendars;
        },
        nextMonth() {
            this.currentDate = moment(this.currentDate).add(1, "month");
        },
        prevMonth() {
            this.currentDate = moment(this.currentDate).subtract(1, "month");
        },
        dblClickDay(selectDate, rowIndex, colIndex){
            alert(selectDate + " rowIndex=" + rowIndex + " colIndex=" + colIndex);
        }
    },
    computed: {
        calendars() {
            return this.getCalendar();
        }
    },
}
</script>
