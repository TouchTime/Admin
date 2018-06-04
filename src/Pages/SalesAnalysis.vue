<template>
<div class="useranalysis-box">
  <div class="chart-box">
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">销售统计</h3>
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
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="totalsum" label="销售金额" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
        <el-table-column prop="discountsum" label="折扣金额" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
        <el-table-column prop="ordercounts" label="订单数" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
        <el-table-column prop="avgUnitPrice" label="平均客单价" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
        <el-table-column prop="number" label="商品数量" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
      </el-table>
    </section>
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">畅销排名</h3>
        <el-select v-model="sellFilterOpts.type" @change="changeSellType" placeholder="请选择">
          <el-option label="日" value="day"></el-option>
          <el-option label="月" value="month"></el-option>
        </el-select>
        <el-date-picker
          v-if="sellFilterOpts.type == 'day'"
          v-model="sellFilterOpts.date"
          @change="changeSellDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-if="sellFilterOpts.type == 'month'"
          v-model="sellFilterOpts.date"
          @change="changeSellDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <el-table v-loading="sellLoading" :data="sellTableData">
        <el-table-column prop="productUrl" label="图片"  width="100">
          <template slot-scope="scope"><img class="goods-photo" :src="scope.row.productUrl" alt=""></template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" align="left"></el-table-column>
        <el-table-column prop="sells" label="销量" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
      </el-table>
    </section>
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">滞销排名</h3>
        <el-select v-model="unsalableFilterOpts.type" @change="changeUnsalableType" placeholder="请选择">
          <el-option label="日" value="day"></el-option>
          <el-option label="月" value="month"></el-option>
        </el-select>
        <el-date-picker
          v-if="unsalableFilterOpts.type == 'day'"
          v-model="unsalableFilterOpts.date"
          @change="changeUnsalableDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-if="unsalableFilterOpts.type == 'month'"
          v-model="unsalableFilterOpts.date"
          @change="changeUnsalableDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <el-table v-loading="unsalableLoading" :data="unsalableTableData">
        <el-table-column prop="productUrl" label="图片" width="100">
          <template slot-scope="scope"><img class="goods-photo" :src="scope.row.productUrl" alt=""></template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" align="left"></el-table-column>
        <el-table-column prop="sells" label="销量" align="center" :formatter="(row, column, cellValue)=>cellValue || 0"></el-table-column>
      </el-table>
    </section>
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
      loading:false,
      filterOpts : {
        type : 'day',
        date : new Date()
      },
      sellFilterOpts:{
        type : 'day',
        date : new Date()
      },
      sellTableData : [],
      sellLoading:false,
      unsalableFilterOpts:{
        type : 'day',
        date : new Date()
      },
      unsalableTableData: [],
      unsalableLoading:false
    }
  },
  created() {
    this.changeDate();
    this.changeSellDate();
    this.changeUnsalableDate();
  },
  methods: {
    changeType(val){
      this.filterOpts.type = val;
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
        url : `/platforms/platform/statistics/sellStatis`,
        data :Object.assign({},{
          starttime : '',
          endtime : '',
          type : 2,
          status : 2
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
    changeSellType(val){
      this.sellFilterOpts.type = val;
      this.changeSellDate();
    },
    changeSellDate(){
      let currDate  = new Date(this.sellFilterOpts.date);
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth() + 1;
      let currDay = currDate.getDate();

      if(this.sellFilterOpts.type == 'day'){
        this.querySellDataList({
          startTime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 00:00:00`,
          endTime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 23:59:59`,
        });
      }else if(this.sellFilterOpts.type == 'month'){
        this.querySellDataList({
          startTime : wmdr.mfd(this.sellFilterOpts.date),
          endTime : wmdr.mld(this.sellFilterOpts.date),
        });
      }
    },
    querySellDataList(param){
      this.sellLoading = true;
      Request({
        url : `/platforms/platform/statistics/hotSellProductInfo`,
        data : Object.assign({},{
          orderstr : 'sells desc',
          type : 2 ,
          status : 2
        },param),
        done : (res)=>{
          this.sellTableData = res.data;
          this.sellLoading = false;
        },
        fail : (err)=>{
          this.sellLoading = false;
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
      });
    },
    changeUnsalableType(val){
      this.unsalableFilterOpts.type = val;
      this.changeUnsalableDate();
    },
    changeUnsalableDate(){
      let currDate  = new Date(this.unsalableFilterOpts.date);
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth() + 1;
      let currDay = currDate.getDate();

      if(this.unsalableFilterOpts.type == 'day'){
        this.queryUnsalableDataList({
          startTime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 00:00:00`,
          endTime : `${currYear}-${currMonth < 10 ? '0'+currMonth : currMonth}-${currDay< 10 ? '0'+currDay : currDay} 23:59:59`,
        });
      }else if(this.unsalableFilterOpts.type == 'month'){
        this.queryUnsalableDataList({
          startTime : wmdr.mfd(this.unsalableFilterOpts.date),
          endTime : wmdr.mld(this.unsalableFilterOpts.date),
        });
      }
    },
    queryUnsalableDataList(param){
      this.unsalableLoading = true;
      Request({
        url : `/platforms/platform/statistics/unSellProductInfo`,
        data : Object.assign({},{
          orderstr : 'sells asc',
          type : 2 ,
          status : 2
        },param),
        done : (res)=>{
          this.unsalableTableData = res.data;
          this.unsalableLoading = false;
        },
        fail : (err)=>{
          this.unsalableLoading = false;
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
      });
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
  & .goods-photo{
    width: 3em;
    height: 3em;
  }
  & .cb-section{
    margin: 0 0 1.6em 0;
  }
  & .log-table{
    margin: 1.6em 0 0 0;
  }
}
</style>
