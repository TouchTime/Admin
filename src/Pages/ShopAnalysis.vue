<template>
<div class="shopanalysis-box">
  <div class="chart-box">
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">新增数量</h3>
        <el-select v-model="filterOpts.type" @change="changeType" placeholder="请选择">
          <el-option label="周" value="week"></el-option>
          <el-option label="月" value="month"></el-option>
          <el-option label="年" value="year"></el-option>
        </el-select>
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
      <line-chart class="chart-line" :chart-data="chartData" :options="chartOpts" :height="400"></line-chart>
    </section>
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">销量排名</h3>
        <el-select v-model="SalesfilterOpts.type" @change="changeSalesType" placeholder="请选择">
          <el-option label="日排名" value="day"></el-option>
          <el-option label="周排名" value="week"></el-option>
          <el-option label="月排名" value="month"></el-option>
        </el-select>
        <el-date-picker
          v-if="SalesfilterOpts.type == 'day'"
          v-model="SalesfilterOpts.date"
          @change="changeSalesDate"
          type="date"
          :clearable="false"
          placeholder="选择日">
        </el-date-picker>
        <el-date-picker
          v-if="SalesfilterOpts.type == 'week'"
          v-model="SalesfilterOpts.date"
          @change="changeSalesDate"
          format="yyyy 第 WW 周"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          :clearable="false"
          placeholder="选择周">
        </el-date-picker>
        <el-date-picker
          v-if="SalesfilterOpts.type == 'month'"
          v-model="SalesfilterOpts.date"
          @change="changeSalesDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker>
        <el-select style="margin-left:0.5em;" v-model="SalesfilterOpts.seq" @change="changeSalesDate" placeholder="请选择">
          <el-option label="前10位" value="0"></el-option>
          <el-option label="后10位" value="1"></el-option>
        </el-select>
      </div>
      <el-table v-loading="loading" class="log-table" :data="tableData">
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="realname" label="掌柜名称"></el-table-column>
        <el-table-column prop="driverNo" label="车牌号码" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="sum" label="销售额" align="center" :formatter="(row, column, cellValue)=>cellValue || '-'"></el-table-column>
        <el-table-column prop="number" label="商品数量" align="center" :formatter="(row, column, cellValue)=>cellValue || '-'"></el-table-column>
        <el-table-column prop="orders" label="订单数量" align="center" :formatter="(row, column, cellValue)=>cellValue || '-'"></el-table-column>
      </el-table>
      <div class="table-footer">
        <div class="batch-btn"></div>
        <el-pagination layout="prev, pager, next" @current-change="handleSaleCurrentChange" :current-page.sync="saleCurrPage" :page-size="salePageSize" :total="saleTableRows">
        </el-pagination>
      </div>
    </section>
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">补货排名</h3>
        <el-date-picker
          v-model="replenishData.date"
          @change="changeReplDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker>
        <!-- <el-select style="margin-left:0.5em;" v-model="replenishData.seq" @change="queryReplenishData" placeholder="请选择">
          <el-option label="前10位" value="0"></el-option>
          <el-option label="后10位" value="1"></el-option>
        </el-select> -->
      
      </div>
      <el-table v-loading="replenishData.loading"  class="log-table" :data="replenishData.tableData" @sort-change="sort">
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="shopName" label="掌柜名称"></el-table-column>
        <el-table-column prop="shopPhone" label="联系电话"  align="center"></el-table-column>
        <el-table-column prop="stocktimes" label="补货次数" sortable="custom"  align="center"></el-table-column>
        <el-table-column prop="sum" label="补货金额" sortable  align="center" ></el-table-column>
      </el-table>
      <div class="table-footer" v-if="replenishData.tableData.length">
        <div class="batch-btn"></div>
        <el-pagination layout="prev, pager, next" @current-change="handleReplenishCurrentChange" :current-page.sync="replenishData.currPage" :page-size="replenishData.pageSize" :total="replenishData.tableRows">
        </el-pagination>
      </div>
    </section>
    <section class="cb-section">
      <div class="chart-tool-bar">
        <h3 class="tb-title">提现排名</h3>
        <!-- <el-date-picker
          v-model="withdrawList.date"
          @change="changeWitlDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker> -->
        <!-- <el-select style="margin-left:0.5em;" v-model="withdrawList.seq" @change="queryWithdrawData" placeholder="请选择">
          <el-option label="前10位" value="0"></el-option>
          <el-option label="后10位" value="1"></el-option>
        </el-select> -->
          <el-select v-model="withdrawList.type" @change="changeCashType" placeholder="请选择">
          <el-option label="日排名" value="day"></el-option>
          <el-option label="周排名" value="week"></el-option>
          <el-option label="月排名" value="month"></el-option>
        </el-select>
        <el-date-picker
          v-if="withdrawList.type == 'day'"
          v-model="withdrawList.date"
          @change="changeWitlDate"
          type="date"
          :clearable="false"
          placeholder="选择日">
        </el-date-picker>
        <el-date-picker
          v-if="withdrawList.type == 'week'"
          v-model="withdrawList.date"
          @change="changeWitlDate"
          format="yyyy 第 WW 周"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          :clearable="false"
          placeholder="选择周">
        </el-date-picker>
        <el-date-picker
          v-if="withdrawList.type == 'month'"
          v-model="withdrawList.date"
          @change="changeWitlDate"
          type="month"
          :clearable="false"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <el-table v-loading="withdrawList.loading" class="log-table" :data="withdrawList.tableData" @sort-change="sortMoney">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="realName" label="掌柜姓名"></el-table-column>
        <el-table-column prop="shopPhone" label="联系电话"></el-table-column>
        <el-table-column prop="times" label="提现次数" align="center" sortable></el-table-column>
        <el-table-column prop="cashNumber" label="提现金额" align="center" sortable></el-table-column>
      </el-table>
      <div class="table-footer" v-if="withdrawList.tableData.length">
        <div class="batch-btn"></div>
        <el-pagination layout="prev, pager, next" @current-change="handleWithdrawListCurrentChange" :current-page.sync="withdrawList.currPage" :page-size="withdrawList.pageSize" :total="withdrawList.tableRows">
        </el-pagination>
      </div>
    </section>
  </div>
</div>
</template>
<script>
import LineChart from '../components/LineChart.js';
import { Request,wmdr } from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  components: {
    LineChart
  },
  data() {
    return {
      filterOpts : {
        type : 'month',
        date : new Date()
      },
      chartOpts: {
        responsive: true,
        maintainAspectRatio: false,
        animation:false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: true
            }
          }]
        }
      },
      chartData: {
        labels: [],
        datasets: []
      },
      SalesfilterOpts:{
        type : 'month',
        date : new Date(),
        seq  : '0'
      },
      tableData:[],
      saleCurrPage:1,
      salePageSize:10,
      saleTableRows:1,
      loading:false,
      replenishData : {
        tableData : [],
        date : new Date(),
        seq : '0',
        currPage : 2,
        pageSize : 10,
        tableRows:1,
        loading : false
      },
      withdrawList:{
        tableData : [],
        date : new Date(),
        seq : '0',
        currPage : 1,
        pageSize : 10,
        tableRows:2,
        loading : false,
         type : 'day',
      },
      seq:0,
      seqname:'sum',
      seqCash: 0,
      seqnameCash:'cashNumber'
    }
  },
  created(){
    this.queryDate({
      starttime : wmdr.mfd(new Date()),
      endtime : wmdr.mld(new Date()),
      time : '%Y-%m-%d'
    });
    this.querySalesData(this.getMonthDateDaterange(new Date()));
    this.queryReplenishData('sum',0,this.getMonthDateDaterange(new Date()));
    this.changeCashDate();
    // this.queryWithdrawData(this.seqCash,this.seqnameCash,);
  },
  methods: {
    changeType(val){
      this.filterOpts.type = val;
      this.changeDate();
    },
    queryDate(param){
      Request({
        url : `/platforms/platform/statistics/countshops`,
        data : Object.assign({},{
          starttime : wmdr.mfd,
          endtime : wmdr.mld,
          time : '%Y-%m-%d'
        },param),
        done : (res)=>{
          //this.tableData = res.data;
          this.padChartData(res.data);
          console.log('res',res.data)
        },
        fail : (err)=>{
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
    changeDate(){
      if(this.filterOpts.type == 'month'){
        this.queryDate({
          starttime : wmdr.mfd(this.filterOpts.date),
          endtime : wmdr.mld(this.filterOpts.date),
          time : '%Y-%m-%d'
        });
      }else if(this.filterOpts.type == 'week'){
        this.queryDate({
          starttime : wmdr.wfd(this.filterOpts.date),
          endtime : wmdr.wld(this.filterOpts.date),
          time : '%Y-%m-%d'
        });
      }else if(this.filterOpts.type == 'year'){
        this.queryDate({
          starttime : wmdr.yfd(this.filterOpts.date),
          endtime : wmdr.yld(this.filterOpts.date),
          time : '%Y-%m'
        });
      }
    },
    padInitMonthDate(cDate){
      let currDate = new Date(cDate);
      let nextMonthFirstDay = new Date(currDate.getFullYear(), currDate.getMonth()+1, 1);
      nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);
      let currDay  = nextMonthFirstDay.getDate();
      let labels = [];
      let datas = [];
      for(let i = 1; i <= currDay ; i++){
        labels.push(`${i}日`);
        datas.push(0)
      }
      return {labels,datas};
    },
    padInitWeekDate(){
      let labels = [];
      let datas = [];
      const cnText = ['周日','周一','周二','周三','周四','周五','周六'];
      for(let i = 0; i <= 6 ; i++){
        labels.push(`${cnText[i]}`);
        datas.push(0)
      }
      return {labels,datas};
    },
    padInitYearDate(){
      let labels = [];
      let datas = [];
      const cnText = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
      for(let i = 0; i < 12 ; i++){
        labels.push(`${cnText[i]}`);
        datas.push(0)
      }
      return {labels,datas};
    },
    padChartData(data){
      let initM = this.padInitMonthDate(this.filterOpts.date);
      let initW = this.padInitWeekDate();
      let initY = this.padInitYearDate();
      let applyData = Object.assign({},initM);
      let passData = Object.assign({},initM);
      let finalData = {
        labels : [],
        datasets : [{
          label: '新增申请',
          pointBackgroundColor: '#ffc700',
          borderColor: '#ffc700',
          backgroundColor : '#ffc700',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        },{
          label: '正式通过',
          pointBackgroundColor: 'green',
          borderColor: 'green',
          backgroundColor : 'green',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        }]
      }
      if(this.filterOpts.type == 'month'){
        finalData.labels = initM.labels;
        data.owner.forEach((item,index)=>{
          console.log('item',item.time)
          let logDate = new Date(item.time);
          applyData.datas[logDate.getDate()-1] = item.number
        });
        finalData.datasets[0].data = applyData.datas;


        data.shop.forEach((item,index)=>{
          let logDate = new Date(item.time);
          passData.datas[logDate.getDate()-1] = item.number
        });
        finalData.datasets[1].data = passData.datas;

      }else if(this.filterOpts.type == 'week'){
        finalData.labels = initW.labels;
        data.owner.forEach((item,index)=>{
          let w = (new Date(item.time)).getDay();
          applyData.datas[w] = item.number
        });
        finalData.datasets[0].data = applyData.datas;

        data.shop.forEach((item,index)=>{
          let w = (new Date(item.time)).getDay();
          passData.datas[w] = item.number
        });
        finalData.datasets[1].data = passData.datas;
      }else if(this.filterOpts.type == 'year'){
        finalData.labels = initY.labels;
        data.owner.forEach((item,index)=>{
          let m = (new Date(item.time)).getMonth();
          applyData.datas[m] = item.number;
        });
        finalData.datasets[0].data = applyData.datas;

        data.shop.forEach((item,index)=>{
          let m = (new Date(item.time)).getMonth();
          applyData.datas[m] = item.number;
        });
        finalData.datasets[1].data = passData.datas;
      }
      this.chartData = finalData;
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD")
    },
    changeSalesType(val){
      this.SalesfilterOpts.type = val;
      this.changeSalesDate();
    },
     changeCashType(val){
      this.withdrawList.type = val;
      this.changeCashDate();
    },
    getDayTimeRange(date){
      const userSelectDate = new Date(date);
      const userSelectYear = userSelectDate.getFullYear();
      const userSelectMonth = userSelectDate.getMonth() + 1;
      const userSelectDay = userSelectDate.getDate();
      return {
        starttime : `${userSelectYear}-${userSelectMonth < 10 ? '0'+userSelectMonth : userSelectMonth}-${userSelectDay < 10 ? '0'+userSelectDay:userSelectDay} 00:00:00`,
        endtime : `${userSelectYear}-${userSelectMonth < 10 ? '0'+userSelectMonth : userSelectMonth}-${userSelectDay < 10 ? '0'+userSelectDay:userSelectDay} 23:59:59`,
      }
    },
    getWeekDateDaterange(date){
      const userSelectDate = new Date(date);
      userSelectDate.setDate(userSelectDate.getDate() - 1);
      let userSelectYear = userSelectDate.getFullYear();
      let userSelectMonth = userSelectDate.getMonth() + 1;
      const wf = userSelectDate.getDate();
      userSelectDate.setDate(userSelectDate.getDate() + 6);
      let wlMonth = userSelectDate.getMonth() + 1;
      const wl = userSelectDate.getDate();
      return {
        starttime : `${userSelectYear}-${userSelectMonth < 10 ? '0'+userSelectMonth : userSelectMonth}-${wf < 10 ? '0'+wf:wf} 00:00:00`,
        endtime : `${userSelectYear}-${wlMonth < 10 ? '0'+wlMonth : wlMonth}-${wl < 10 ? '0'+wl:wl} 23:59:59`,
      }
    },
    getMonthDateDaterange(date){
      const userSelectDate = new Date(date);
      let userSelectYear  =  userSelectDate.getFullYear();
      let nextMonthFirstDay = new Date(userSelectDate.getFullYear(), userSelectDate.getMonth()+1, 1);
      nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);
      userSelectYear = nextMonthFirstDay.getFullYear();
      let userSelectMonth = nextMonthFirstDay.getMonth() + 1;
      let userSelectDay  = nextMonthFirstDay.getDate();
      return {
        starttime : `${userSelectYear}-${userSelectMonth < 10 ? '0'+userSelectMonth : userSelectMonth}-01 00:00:00`,
        endtime : `${userSelectYear}-${userSelectMonth < 10 ? '0'+userSelectMonth : userSelectMonth}-${userSelectDay < 10 ? '0'+userSelectDay:userSelectDay} 23:59:59`,
      }
    },
    changeSalesDate(){
      if(this.SalesfilterOpts.type == 'day'){
        this.querySalesData(this.getDayTimeRange(this.SalesfilterOpts.date));
      }else if(this.SalesfilterOpts.type =='week'){
        this.querySalesData({
          starttime : wmdr.wfd(this.SalesfilterOpts.date),
          endtime : wmdr.wld(this.SalesfilterOpts.date),
        });
      }else if(this.SalesfilterOpts.type == 'month'){
        this.querySalesData(this.getMonthDateDaterange(this.SalesfilterOpts.date));
      }
    },
    changeCashDate(){
      if(this.withdrawList.type == 'day'){
        this.queryWithdrawData(this.seqCash,this.seqnameCash,this.getDayTimeRange(this.withdrawList.date));
      }else if(this.withdrawList.type =='week'){
        this.queryWithdrawData(this.seqCash,this.seqnameCash,{
          starttime : wmdr.wfd(this.withdrawList.date),
          endtime : wmdr.wld(this.withdrawList.date),
        });
      }else if(this.withdrawList.type == 'month'){
        this.queryWithdrawData(this.seqCash,this.seqnameCash,this.getMonthDateDaterange(this.withdrawList.date));
      }
    },
    querySalesData(param){
      this.loading = true;
      Request({
        url : `/platforms/platform/statistics/shopsell`,
        data : Object.assign({},{
          page : this.saleCurrPage,
          pageSize : this.salePageSize,
          seq : this.SalesfilterOpts.seq
        },param),
        done : (res)=>{
          this.tableData = res.data.result;
          this.saleTableRows = res.data.totalNum;
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
    changeReplDate(val){
      this.replenishData.date = val;
      this.queryReplenishData(this.seqname,this.seq);
    },
    queryReplenishData(item,seq,param){
      let daterange = Object.assign({},this.getMonthDateDaterange(this.replenishData.date));
      this.replenishData.loading = true;
      Request({
        url : `/platforms/platform/statistics/stockTimes`,
        data : Object.assign(daterange,{
          // seq : this.replenishData.seq,   //0是降序，1是升序
          page : this.replenishData.currPage,
          pageSize : this.replenishData.pageSize,        //seqname=sum:补货金额；seqname=stocktimes：补货次数
          seqname: item,
          seq: seq
        },param),
        done : (res)=>{
          this.replenishData.tableData = res.data.result;
          this.replenishData.tableRows = res.data.totalNum;
          this.replenishData.loading = false;
        },
        fail : (err)=>{
          this.replenishData.loading = false;
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('获取列表失败！');
          }
        }
      });
    },
    changeWitlDate(val){
      this.withdrawList.date = val;
      this.queryWithdrawData(this.seqCash,this.seqnameCash);
    },
    queryWithdrawData(seq,seqname,param){
      let daterange = Object.assign({},this.getMonthDateDaterange(this.withdrawList.date));
      this.withdrawList.loading = true;
      Request({
        url : `/platforms/platform/statistics/cashMoney`,
        data : Object.assign(daterange,{
          // seq : this.withdrawList.seq,
          seq: seq,
          seqname: seqname,     //cashNumber:提现金额   times：提现次数
          page : this.withdrawList.currPage,
          pageSize : this.withdrawList.pageSize
        },param),
        done : (res)=>{
          console.log('res',res.data.result)
          this.withdrawList.tableData = res.data.result;
          this.withdrawList.tableRows = res.data.totalNum;
          this.withdrawList.loading = false;
        },
        fail : (err)=>{
          this.withdrawList.loading = false;
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('获取列表失败！');
          }
        }
      });
    },
    handleSaleCurrentChange(val){
      this.saleCurrPage = val;
      this.changeSalesDate();
    },
    handleReplenishCurrentChange(val){
      //补货排名的分页
      this.replenishData.currPage = val;
      this.changeReplDate(this.replenishData.date);
    },
    handleWithdrawListCurrentChange(val){
      this.withdrawList.currPage = val;
      this.changeWitlDate(this.withdrawList.date);
    },
    sort(column){
      if(this.replenishData.tableData.length){
        const seqs = column.order == 'ascending' ? 1 : 0 ;
        const seqnames = column.prop;
        this.queryReplenishData(seqnames,seqs);
        this.seq = seqs;
        this.seqname = seqnames;
      }
    },
    sortMoney(column){
      if(this.withdrawList.tableData.length){
      const seqs = column.order == 'ascending' ? 1 : 0 ;
      const seqnames = column.prop;
      this.queryWithdrawData(seqs,seqnames);
      this.seqCash = seqs;
      this.seqnameCash = seqnames;
      }
   
    }
    
  }
}
</script>
<style>
.shopanalysis-box {
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .chart-tool-bar{
    display: flex;
    align-items: center;
    padding: 0 0 0.5em 0;
    & .el-select{
      width: 120px;
      margin-right: 0.5em;
    }
    & .display-daterange{
      min-width: 240px;
      line-height: 34px;
      padding: 0 15px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      & .el-icon-date{
        font-size: 14px;
        color: #c0c4cc;
        margin-right: 0.5em;
      }
      & .separateText{
        color: #c0c4cc;
          margin:0 0.5em;
      }
    }
  }
  & .cb-section{
    margin: 0 0 1em 0;
  }
  & .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0 0 0;
  }
}
</style>
