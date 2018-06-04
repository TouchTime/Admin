<template>
<div class="useranalysis-box">
  <div class="chart-box">
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">用户数量</h3>
        <el-select v-model="filterOpts.type" @change="changeType" placeholder="请选择">
          <el-option label="日" value="day"></el-option>
          <el-option label="周" value="week"></el-option>
          <el-option label="月" value="month"></el-option>
          <el-option label="年" value="year"></el-option>
        </el-select>
        <el-date-picker
          v-if="filterOpts.type == 'day'"
          v-model="filterOpts.date"
          @change="changeDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-if="filterOpts.type == 'week'"
          v-model="filterOpts.date"
          @change="changeDate"
          format="yyyy 第 WW 周"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          :clearable="false"
          placeholder="选择周">
        </el-date-picker>
        <el-date-picker
          v-if="filterOpts.type == 'month'"
          v-model="filterOpts.date"
          @change="changeDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker>
        <el-date-picker
          v-if="filterOpts.type == 'year'"
          v-model="filterOpts.date"
          @change="changeDate"
          type="year"
          :clearable="false"
          placeholder="选择年">
        </el-date-picker>
      </div>
    </section>
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="allNum" label="下单的总数" align="center"></el-table-column>
      <el-table-column prop="againNum" label="复购用户人数" align="center"></el-table-column>
      <el-table-column prop="againBuy" label="复购率" align="center"></el-table-column>
      <el-table-column prop="aliPayNum" label="支付宝用户数" align="center"></el-table-column>
      <el-table-column prop="wxNum" label="微信用户数" align="center"></el-table-column>
    </el-table>
  </div>
</div>
</template>
<script>
import { Request, wmdr } from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {

  data() {
    return {
      tableData:[],
      filterOpts : {
        type : 'month',
        date : new Date()
      },
      loading:false
    }
  },
  created() {
    this.changeDate();
  },
  methods: {
    changeType(val){
      this.changeDate();
    },
    changeDate(){
      let currDate  = new Date(this.filterOpts.date);
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth() + 1;
      let currDay = currDate.getDate();

      if(this.filterOpts.type == 'month'){
        this.queryDateList({
          starttime : wmdr.mfd(this.filterOpts.date),
          endtime : wmdr.mld(this.filterOpts.date),
        });
      }else if(this.filterOpts.type == 'week'){
        this.queryDateList({
          starttime : wmdr.wfd(this.filterOpts.date),
          endtime : wmdr.wld(this.filterOpts.date),
        });
      }else if(this.filterOpts.type == 'year'){
        this.queryDateList({
          starttime : wmdr.yfd(this.filterOpts.date),
          endtime : wmdr.yld(this.filterOpts.date),
        });
      }else if(this.filterOpts.type == 'day'){
        this.queryDateList({
          starttime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 00:00:00`,
          endtime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 23:59:59`,
        });
      }
    },
    queryDateList(param){
      this.loading = true;
      Request({
        url : `/platforms/platform/statistics/userNumber`,
        data :Object.assign({},{
          starttime : '',
          endtime : ''
        },param),
        done : (res)=>{
          this.tableData = [res.data];
          this.loading = false;
        },
        fail : (err)=>{
          this.loading = false;
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('查询失败！');
          }
        }
      })
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD")
    }
  }
}
</script>
<style>
.useranalysis-box {
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .chart-tool-bar {
    display: flex;
    align-items: center;
    padding: 0 0 0.5em 0;
    & .el-select {
      width: 120px;
      margin-right: 0.5em;
    }
    & .display-daterange {
      min-width: 240px;
      line-height: 34px;
      padding: 0 15px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      & .el-icon-date {
        font-size: 14px;
        color: #c0c4cc;
        margin-right: 0.5em;
      }
      & .separateText {
        color: #c0c4cc;
        margin: 0 0.5em;
      }
    }
  }
  & .log-table{
    margin: 1.6em 0 0 0;
  }
}
</style>
