<template>
<div class="shopanalysis-box">
  <div class="chart-box">
    <section class="cb-section">
      <div class="chart-tool-bar">
        <el-date-picker
          v-model="value"
          @change="changeDate"
         type="daterange"
          unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
          clearable

         >
        </el-date-picker>
      </div>
      <line-chart class="chart-line" :chart-data="chartData" :options="chartOpts" :height="400"></line-chart>
    </section>
    <section class="cb-section">
      <el-table v-loading="loading" class="log-table" :data="tableData">
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="createtimes" label="时间" :formatter="(row, column, cellValue)=> formatTime(cellValue)"></el-table-column>
        <el-table-column prop="totalsum" label="销售金额" align="center"></el-table-column>
        <el-table-column prop="discountsum" label="折扣金额" align="center"></el-table-column>
        <el-table-column prop="ordercounts" label="订单数" align="center"></el-table-column>
        <el-table-column prop="avgUnitPrice" label="平均客单价" align="center"></el-table-column>
        <el-table-column prop="number" label="商品数量" align="center" ></el-table-column>
      </el-table>
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
     value:[new Date().getTime() - 3600 * 1000 * 24 * 6, new Date().getTime()],
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
      tableData:[],
      loading:false,
     
    }
  },
  created(){
    this.querySalesData({
      starttime : `${this.formatTime(new Date().getTime() - 3600 * 1000 * 24 * 7)} 00:00:00`,
      endtime :  `${this.formatTime(new Date())} 23:59:59`
    })
    // localStorage.setItem('time',this.value)


  },
  methods: {
    querySalesData(param){
       this.loading = true;
      Request({
        url : `/platforms/platform/statistics/sellStatis`,
        data :Object.assign({},{
          type : 2,
          status : 2,
          page: 1    //1:日   7：周 363：年  30：月
        },param),
        done : (res)=>{
          this.tableData = res.data;
          this.loading = false;
          this.padChartData(res.data,this.value[0])
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
  
    changeDate(){
      const that = this;
      const time = that.value;
      if((that.value[1] - that.value[0])<=3600*24*100000){
         that.querySalesData({starttime:`${that.formatTime(time[0])} 00:00:00`,endtime:`${that.formatTime(time[1])} 23:59:59`});
      }else{
         that.$message.error('最长时间为100天');
         
      }
    },
  
    padChartData(data,time){
      let finalData = {
        labels : [],
        datasets : [{
          label: '销售金额',
          pointBackgroundColor: '#20b3c0',
          borderColor: '#20b3c0',
          backgroundColor : '#20b3c0',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        },{
          label: '折扣金额',
          pointBackgroundColor: '#fd9827',
          borderColor: '#fd9827',
          backgroundColor : '#fd9827',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        },
        {
          label: '订单数',
          pointBackgroundColor: '#198f1c',
          borderColor: '#198f1c',
          backgroundColor : '#198f1c',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        },{
          label: '平均客单价',
          pointBackgroundColor: '#644983',
          borderColor: '#644983',
          backgroundColor : '#644983',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        },
        {
          label: '商品数量',
          pointBackgroundColor: '#ed6b80',
          borderColor: '#ed6b80',
          backgroundColor : '#ed6b80',
          fill: false,
          pointRadius: 2,
          lineTension: 0,
          borderWidth: 1.5,
          data: []
        },
        ]
      }
      //时间处理
      this.timeDeal(time);
      finalData.labels =  this.timeDeal(time);
   
      let totalSum = this.timeDeal(time);
      let newSum = totalSum.concat().fill(0);
      let newDiscount = totalSum.concat().fill(0);
      let newOrder = totalSum.concat().fill(0);
      let newAvgUnit = totalSum.concat().fill(0);
      let newNumber = totalSum.concat().fill(0);
      let w = '';
       //销售金额totalsum
      data.forEach((item,index)=>{
        w = this.formatTime(item.createtimes);
        for(let i in totalSum){
            if(totalSum[i]== w){
              newSum[i] = item.totalsum;
            }
        }
      })
      finalData.datasets[0].data =  newSum;
        //折扣金额discountsum
       data.forEach((item,index)=>{
        w = this.formatTime(item.createtimes);
        for(let i in totalSum){
            if(totalSum[i]== w){
              newDiscount[i] = item.discountsum;
            }
        }
       })
        finalData.datasets[1].data = newDiscount;
        //订单数ordercounts
         data.forEach((item,index)=>{
         w = this.formatTime(item.createtimes);
        for(let i in totalSum){
            if(totalSum[i]== w){
              newOrder[i] = item.ordercounts;
            }
        }
       })
        finalData.datasets[2].data = newOrder;
        //平均客单价avgUnitPrice 
        data.forEach((item,index)=>{
         w = this.formatTime(item.createtimes);
        for(let i in totalSum){
            if(totalSum[i]== w){
              newAvgUnit[i] = item.avgUnitPrice;
            }
        }
       })
        finalData.datasets[3].data = newAvgUnit;
         //商品数量number 
        data.forEach((item,index)=>{
         w = this.formatTime(item.createtimes);
        for(let i in totalSum){
            if(totalSum[i]== w){
              newNumber[i] = item.number;
            }
        }
       })
        finalData.datasets[4].data = newNumber;

         this.chartData = finalData;
    },
    formatTime(date){
      return moment(date).format("YYYY-MM-DD")
    },
    pad(num){
     return num < 10 ? `0${num}` : num
  },
  timeDeal(data){
      let interval = (this.value[1]-this.value[0])/(3600*1000*24); 
      let newTime = [];
      let currDate = new Date(data).getTime() ;
      for(var i = 0;i <= interval;i++){
        newTime.push(this.formatTime(currDate + (3600*1000*24)*i))
      }
      return newTime;
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
