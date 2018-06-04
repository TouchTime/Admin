<template>
  <div class="marketing-analysis-box">
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">营销费用</h3>
        <el-select v-model="filterOpts.type" @change="changeDate" placeholder="请选择">
          <el-option label="日" value="day"></el-option>
          <el-option label="月" value="month"></el-option>
          <el-option label="年" value="year"></el-option>
        </el-select>
        <el-date-picker
          v-if="filterOpts.type == 'day'"
          v-model="filterOpts.date"
          @change="changeDate"
          type="date"
          :clearable="false"
          placeholder="选择日期">
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
      <el-table-column prop="countRecommend" label="推荐费用总额" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
      <el-table-column prop="countShareProfit" label="推荐分润金额" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { Request ,wmdr} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data(){
    return {
      filterOpts:{
        type : 'month',
        date : new Date()
      },
      tableData : [],
      loading:false
    }
  },
  created(){
    this.changeDate();
  },
  methods:{
    changeDate(){
      let currDate  = new Date(this.filterOpts.date);
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth() + 1;
      let currDay = currDate.getDate();
      if(this.filterOpts.type == 'month'){
        this.queryData({
          starttime : wmdr.mfd(this.filterOpts.date),
          endtime : wmdr.mld(this.filterOpts.date),
        });
      }else if(this.filterOpts.type == 'day'){
        this.queryData({
          starttime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 00:00:00`,
          endtime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 23:59:59`,
        });
      }else if(this.filterOpts.type == 'year'){
        this.queryData({
          starttime : wmdr.yfd(this.filterOpts.date),
          endtime : wmdr.yld(this.filterOpts.date),
        });
      }
    },
    queryData(param){
      this.loading = true;
      Request({
        url : `/platforms/platform/statistics/shareprofit`,
        data : Object.assign({},param),
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
    }
  }
}
</script>
<style>
.marketing-analysis-box{
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .cb-section{
    margin-bottom: 1em;
  }
  & .chart-tool-bar{
    display: flex;
    align-items: center;
  }
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
</style>
