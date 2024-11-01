<script>
import serviceAxios from "../utils/request";
import { ElMessage } from 'element-plus';
export default {
  data() {
    return {
      roomlist: [],
      roombooklist: [],
      currentroomlist: [],
      bookSchedule: [],
      roomindex: null,
      selectroom: false,
      isAppoint: false,
      week: [],
      appointForm: {
        startTime: null,
        endTime: null,
        bookname: null,
        peopleNumber: null,
        roomNumber: null,
        isUse: false,

      },
      dateNow: null,
      appointTimeArr: [],

    }
  },
  created() {
  },
  methods: {
    goBack() {
      console.log('go back');
    },
    getlist() {
      serviceAxios({
        url: "room/getlist",
        method: "get",
        data: null,
      }).then((res) => {
        this.roomlist = res;
      }).catch((error) => {
        console.log(error);
      })
    },
    getroombooklist() {
      serviceAxios({
        url: "room/getschedulelist",
        method: "get",
        data: null,
      }).then((res) => {

        this.roombooklist = res.map(reservation => ({
          ...reservation,
          formattedStartTime: this.formatDateTime(reservation.startTime),
          formattedEndTime: this.formatDateTime(reservation.endTime)
        }));
      }).catch((error) => {
        console.log(error);
      })
    },
    handleClick(room) {
      this.roomindex = this.roomlist.findIndex(r => r.roomNumber === room.roomNumber);
      this.selectroom = this.roomindex != null;
    },
    booClick() {
      serviceAxios({
        url: "room/getscheduletime?roomNumber=" + this.roomlist[this.roomindex].roomNumber,
        method: "get",
        data: null,
      }).then((res) => {
        this.bookSchedule = res;
        this.week = this.dealTime();
        this.isAppoint = true;
      }).catch((error) => {
        console.log(error);
      })
    },
    dealTime() {
      let obj = [];
      Object.keys(this.bookSchedule).forEach(dateStr => {
        let mydate = "2024/" + dateStr;
        const date = new Date(mydate.replace(/-/g, '/'));
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        let weekDay = days[date.getDay()];
        obj.push({
          date: dateStr,
          day: weekDay,
          is_active: 0,
        });
      });
      return obj;
    },
    changWeek(val, index) {
      for (let i = 0; i < this.week.length; i++) {
        this.week[i].is_active = 0;
      }
      this.week[index].is_active = 1;
      this.dateNow = val.date;
    },
    closeAppoint() {
      this.isAppoint = false
      for (let i = 0; i < this.week.length; i++) {
        this.week[i].is_active = 0;
      }
      this.week[0].is_active = 1;
      this.appointForm.bookname = '';
      this.appointForm.peopleNumber = null;
      if (this.dateNow === null) return;
      Object.keys(this.bookSchedule[this.dateNow]).forEach(timeinfo => {
        if (this.bookSchedule[this.dateNow][timeinfo] === 2) {
          this.bookSchedule[this.dateNow][timeinfo] = 0;
        }
      });
      this.dateNow = null;
    },
    saveAppoint() {
      this.appointForm.isUse = false;
      this.appointForm.roomNumber = this.roomlist[this.roomindex].roomNumber;
      console.log(this.appointForm)
      serviceAxios({
        url: "room/addschedule",
        method: "post",
        data: this.appointForm,
      }).then((res) => {
        console.log(res);
        this.getroombooklist();
        this.closeAppoint();
      }).catch((error) => {
        console.log(error);
      })
    },
    padZero(num, size = 2) {
      let s = num + '';
      while (s.length < size) s = '0' + s;
      return s;
    },
    changTime(val, time) {
      //当前选中数组的长度小于2时，即点击了1次、2次
      if (this.appointTimeArr.length < 2) {
        this.bookSchedule[this.dateNow][time] = 2;//点击按钮的状态设为3，即当前选中
        this.appointTimeArr.push(time);
        //当前选中数组的长度为2，即点击了2次
        if (this.appointTimeArr.length == 2) {
          //选中数组的俩个下标一样时，即同一个时间点点击了两次，即取消选中，则把状态都重置为0，并且清空选中数组
          if (this.appointTimeArr[0] == this.appointTimeArr[1]) {
            this.bookSchedule[this.dateNow][time] = 0;
            this.appointTimeArr = [];
          } else {
            //选中数组的两个下下标不一样时，对数组进行排序，顺序排序，如若是[3,2]则改为[2,3]，开始时间点和结束时间点
            this.appointTimeArr = this.appointTimeArr.sort(function (a, b) {
              const dateA = new Date('2024-01-01T' + a); // 假定所有时间为同一天
              const dateB = new Date('2024-01-01T' + b);
              if (dateA < dateB) return -1;
              if (dateA > dateB) return 1;
              return 0; // 相等
            });
            //求出开始时间和结束时间之间选中的时间点个数
            const startDate = new Date('2000-01-01T' + this.appointTimeArr[0]);
            const endDate = new Date('2000-01-01T' + this.appointTimeArr[1]);
            let len = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 30);
            const thirtyMinutesInMilliseconds = 30 * 60 * 1000;
            let currentDate = startDate;
            for (let i = 0; i < len; i++) {
              //将下选中数组内容的下标与时间数组的下标状态进行比对，若是有状态等于1的，即已有预约，则做出提示，并且把开始时间点和结束时间点重置为空，循环终止
              currentDate = new Date(currentDate.getTime() + thirtyMinutesInMilliseconds);
              let hours = currentDate.getHours();
              let minutes = currentDate.getMinutes();
              console.log(`${this.padZero(hours)}:${this.padZero(minutes)}`);
              if (this.bookSchedule[this.dateNow][`${this.padZero(hours)}:${this.padZero(minutes)}`] == 1) {
                ElMessage({
                  message: '已预约过的时间不允许预约',
                  type: 'warning',
                });
                Object.keys(this.bookSchedule[this.dateNow]).forEach(timeinfo => {
                  if (this.bookSchedule[this.dateNow][timeinfo] === 2) {
                    this.bookSchedule[this.dateNow][timeinfo] = 0;
                  }
                });
                this.appointForm.startTime = '';
                this.appointForm.endTime = '';
                break;
              } else {
                //将最终获取到的选中数组下标与时间数组进行比对，获取开始时间点和结束时间点，并且状态改为3，即当前选中
                this.bookSchedule[this.dateNow][`${this.padZero(hours)}:${this.padZero(minutes)}`] = 2;
              }
            }
            this.appointForm.startTime = "2024/" + this.dateNow + " " + this.appointTimeArr[0];
            this.appointForm.endTime = "2024/" + this.dateNow + " " + this.appointTimeArr[1];

          }
        }
      } else if (this.appointTimeArr.length = 3) {//当前选中数组的长度等于3时，即点击了3次，则把前两个状态改为0，即未选中，把第三次点击时的状态设为3，即当前选中
        Object.keys(this.bookSchedule[this.dateNow]).forEach(timeinfo => {
          if (this.bookSchedule[this.dateNow][timeinfo] === 2) {
            this.bookSchedule[this.dateNow][timeinfo] = 0;
          }
        });
        this.appointTimeArr = [];
        this.appointTimeArr.push(time);
        this.bookSchedule[this.dateNow][time] = 2;
      }
    },
    formatDateTime(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear().toString().substr(-2);
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
      const hours = (`0${date.getHours()}`).slice(-2);
      const minutes = (`0${date.getMinutes()}`).slice(-2);
      return `${year}/${month}/${day}-${hours}:${minutes}`;
    }
  },
  mounted() {
    this.getlist();
    this.getroombooklist();
  },
  computed: {
    groupedRooms() {
      const result = [];
      for (let i = 0; i < this.roomlist.length; i += 3) {
        result.push(this.roomlist.slice(i, i + 3));
      }
      return result;
    },
  },



}
</script>

<template>
  <el-page-header @back="goBack" content="在线会议室列表" class="roommassage"></el-page-header>
  <div class="roomlist">
    <el-row :gutter="20" v-for="(roomsInRow, index) in groupedRooms" :key="index">
      <el-col :span="8" v-for="room in roomsInRow" :key="room.roomNumber">
        <div class="grid-content bg-purple">
          <el-button type="primary" plain @click="handleClick(room)">
            <p>{{ room.roomName }}</p>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="roomdetail" v-if="selectroom">
    <p class="title">{{ roomlist[roomindex].roomName }}</p>
    <p>房间号: {{ roomlist[roomindex].roomNumber }}</p>
    <p>位置: {{ roomlist[roomindex].location }}</p>
    <p>容量: {{ roomlist[roomindex].peopleNumber }}人</p>
  </div>


  <el-button type="primary" plain @click="booClick()" class="bookbut" :disabled="!selectroom">
    预 订
  </el-button>
  <div class="table-container">
    <el-table :data="roombooklist" class="massageTable" stripe>
      <el-table-column prop="roomNumber" label="房间号" width="60">
      </el-table-column>
      <el-table-column prop="bookname" label="姓名" width="40">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="formattedStartTime" label="借用日期" width="125">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="formattedEndTime" label="借用日期" width="125">
      </el-table-column>
      <el-table-column prop="use" label="是否使用" width="60">
      </el-table-column>
      <el-table-column prop="peopleNumber" label="实际人数" width="40">
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-dialog title="预约" v-model="isAppoint" width="100%" :modal="true" class="bookdialog">
      <el-form label-width="100%" :model="appointForm">
        <div style="margin:5px;">
          <div style="display:flex;justify-content:space-between;">
            <span v-for="(item, index) in week" :key="index"
              :class="{ 'top_style': item.is_active == 0, 'top_active': item.is_active == 1 }"
              @click="changWeek(item, index)">
              <div style="height:25px;line-height:20px;">{{ item.date }}</div>
              <div style="height:25px;line-height:20px;">{{ item.day }}</div>
            </span>
          </div>
          <div style="display:flex;margin:20px 50px;font-size:18px;justify-content:space-between;">
            <div style="display:flex;">
              <div style="background-color:#ffa4a4;width:40px;height:20px;margin-right:10px;"></div>
              <div>已有预约</div>
            </div>
            <div style="display:flex;">
              <div style="background-color:#3EA7F1;width:40px;height:20px;margin-right:10px;"></div>
              <div>当前预约</div>
            </div>
          </div>
          <div style="height:240px;" class="button_wrap">
            <el-button v-for="(isBooked, time) in bookSchedule[dateNow]" :key="index" @click="changTime(isBooked, time)"
              style="width: auto;margin-left: 10px;" :type="isBooked === 0 ? '' : isBooked === 1 ? 'danger' : 'primary'"
              :disabled="isBooked == 1" class="button_style">{{ time }}</el-button>
          </div>
        </div>
        <el-row :gutter="5">
          <el-col :span="10">负责人姓名
            <el-form-item label="负责人姓名">
              <el-input placeholder="请输入会议人数" v-model="appointForm.bookname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 10px;">会议人数
            <el-form-item label="会议人数">
              <el-input placeholder="请输入会议人数" v-model="appointForm.peopleNumber" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAppoint">取消</el-button>
        <el-button type="primary" @click="saveAppoint" style="margin-left:20px;">确定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<style scoped>
.top_style {
  border: 1px solid #AAA;
  padding: 3px 5px;
  text-align: center;
}

.top_active {
  border: 1px solid #AAA;
  padding: 3px 5px;
  text-align: center;
}

.bookdialog {
  width: 95%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-footer {
  width: 95%;
  display: flex;
  height: 8vh;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.top_active {
  border-color: #02A7F0;
  color: #02A7F0;
}

.button_style {
  text-align: center;
  float: left;
  width: 60px;
}

.button_wrap {
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  justify-content: flex-start;
  margin-bottom: 5px;
}

.button_no {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  background: #FFFFFF;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 400;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.calender {
  width: 500px;
  height: 300px;
  margin: 0 auto;
  /* margin-left:50px; */
}

.calender_title {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.arrow {
  width: 50px;
  height: 100%;
}

.data {
  font-size: 20px;
}

.title_span {
  width: calc(100% / 7);
  text-align: center;
  height: 40px;
  line-height: 40px;
}

.row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.prevDay {
  color: #fff;
  background-color: #eee;
}

.content_span {
  width: calc(100% / 7);
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.content_button {
  margin-bottom: 5px;
  width: 60px;
  margin-left: 10px;
}

.calender_content {
  width: 100%;
  height: 250px;
}

.content {
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.table-container {
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: 50vh;
}

.massageTable {
  width: 100%;

}

.roommassage {
  font-size: 30px;
  margin-bottom: 30px;
  background-color: powderblue;
  border-bottom: 1px solid #eee;
}

.roomdetail {
  font-size: 10px;

  .title {
    font-size: 15px;
    font-weight: bold;
    font-family: '黑体';
  }
}

.roomlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 150px;
}

.el-row {
  margin-top: 30px;
  width: 100%;
  height: 40px;

  &:last-child {
    margin-bottom: 0;
  }
}

.bookbut {
  margin-top: 30px;
  margin-right: 20px;
  float: right;
}

.el-col {
  width: 100%;
  height: 100%;
}

.el-col .el-button {
  font-size: 15px;
  padding: 18px 33px;
}


.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
