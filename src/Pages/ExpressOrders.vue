<template>
  <div class="self-orders-box">
    <el-form ref="queryForm" :model="queryForm" label-width="6em">
      <el-row type="flex" :gutter="20">
        <el-col :span="10">
          <el-form-item label="掌柜姓名：">
            <el-input v-model="queryForm.realName" placeholder="掌柜姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态：">
            <el-select v-model="queryForm.status" placeholder="请选择">
              <el-option v-for="(item,index) in statusList" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="优惠：">
            <el-select v-model="queryForm.isDiscounted" placeholder="请选择">
              <el-option label="无优惠" value="0"></el-option>
              <el-option label="有优惠" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col :span="10">
          <el-form-item label="时间：">
            <el-date-picker
              v-model="queryForm.daterange"
              type="daterange"
              prefix-icon=""
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']" >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item>
            <div class="align-right">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button @click="exportExcel" type="primary">导出Excel</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col :span="10">
          <el-form-item label="合计金额：">
            <el-input :value="`¥ ${statData ? (statData.allSum || 0) : 0} 元`" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="合计利润：">
            <el-input :value="`¥ ${statData ? (statData.allProfitSum || 0) : 0} 元`" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="订单数量：">
            <el-input :value="statData ? (statData.orderCount || 0) : 0" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="shopRealName" label="掌柜姓名" min-width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="140" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="isDiscounted" label="使用优惠" min-width="80" align="center" :formatter="(row, column, cellValue)=> cellValue == 0  ? '无优惠':'有优惠'"></el-table-column>
      <el-table-column prop="expressSum" label="运费" min-width="80" align="center"></el-table-column>
      <el-table-column prop="paySum" label="支付总金额" min-width="100" align="center">
        <template slot-scope="scope">{{scope.row.expressSum + scope.row.paySum}}</template>
      </el-table-column>
      <el-table-column prop="totalSum" label="订单金额" min-width="80" align="center"></el-table-column>
      <el-table-column prop="shopProfitSum" label="利润" min-width="80" align="center"></el-table-column>
      <el-table-column prop="orderShipping.expressName" label="快递单号" min-width="120" align="center"></el-table-column>
      <el-table-column prop="address" label="收货人" min-width="100" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" min-width="110" align="center"></el-table-column>
      <el-table-column prop="consignee" label="收货地址" min-width="200" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="80" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="checkReturnSum" label="确认退换额" align="center" min-width="120"></el-table-column>
      <el-table-column prop="finalSum" label="最终价格" min-width="120" align="center"></el-table-column>
      <el-table-column prop="" label="操作" width="200">
        <template slot-scope="scope">
        	<el-button
            size="mini"
            @click="handleShow(scope.$index, scope.row)">明细</el-button>
          <el-button
        	  type="primary"
            size="mini"
            v-if="(scope.row.status >= 2 && scope.row.status < 5)"
            @click="handleSureSend(scope.$index, scope.row)">确认发货</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderCode" label="订单编码" min-width="220"></el-table-column>
    </el-table>
    <div class="table-footer">
      <div class="batch-btn"></div>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
      </el-pagination>
    </div>
    <el-dialog title="订单明细" :visible.sync="dialogFormVisible" width="80%">
    	<el-table ref="multipleTable" :data="goodsList">
  	    <el-table-column prop="productUrl" label="商品图" width="80" fixed="left">
  	      <template slot-scope="scope"><img class="pro-photo" :src="scope.row.productUrl" alt=""></template>
  	    </el-table-column>
  	    <el-table-column prop="productName" label="商品名称" width="200"></el-table-column>
        <el-table-column prop="unit" label="规格" width="80" align="center"></el-table-column>
  	    <!-- <el-table-column prop="productPrice" label="商品价格" min-width="100" align="center"></el-table-column> -->
  	    <el-table-column prop="cateName" label="类名" min-width="100" align="center"></el-table-column>
  	    <el-table-column prop="discountPrice" label="折扣价格" width="80" align="center"></el-table-column>
  	    <el-table-column prop="discountRate" label="折扣率" width="80" align="center"></el-table-column>
  	    <el-table-column prop="actualPrice" label="单价" width="80" align="center"></el-table-column>
  	    <el-table-column prop="numbers" label="件数" width="80" align="center"></el-table-column>
  	    <el-table-column prop="totalPrice" label="总价" width="80" align="center"></el-table-column>
    	</el-table>
    </el-dialog>
    <el-dialog title="扫码确认" :visible.sync="scanDialogVisible" width="380px">
      <p class="scan-hint">请使用仓库端扫码确认</p>
      <vue-qrcode
        :value="qrcodeUrl"
        :options="{ size: '360',background:'white',backgroundAlpha:0,level:'H',foregroundAlpha:1,padding:25}"></vue-qrcode>
    </el-dialog>
  </div>
</template>
<script>
import { Request } from '../util.js';
import moment from 'moment';
import VueQrcode from '@xkeshi/vue-qrcode';
moment.locale('zh-CN');
  export default  {
    components: { VueQrcode },
    data(){
      return {
        queryForm:{
          status : '',
          isDiscounted : '',
          daterange : '',
          realName :''
        },
        statusList:[{
          label: '支付失败',
          value : '-1'
        },{
          label: '提交',
          value: '0'
        }, {
          label: '支付中',
          value: '1'
        }, {
          label: '支付成功',
          value: '2'
        }, {
          label: '接单',
          value: '3'
        }, {
          label: '发货',
          value: '4'
        }, {
          label: '确认收货',
          value: '5'
        }],
        tableData: [],
        loading:false,
        currPage: 1,
        pageSize: 10,
        tableRows: 1,
        dialogFormVisible : false,
        goodsList: [],
        statData: {},
        scanDialogVisible : false,
        qrcodeUrl: ''
      }
    },
    created (){
      this.orderListData();
    },
    methods : {
      orderListData(param){
        let { currPage,pageSize } = this;
        this.loading = true;
        Request({
          url: `/platforms/platform/order/queryorderunionlist`,
          data: Object.assign({}, {
            type: 1,
            takeType: 1,
            page: currPage,
            pageSize: pageSize
          }, param),
          done: (res) => {
            this.tableData = res.data.result;
            this.tableRows = res.data.totalNum;
            this.queryTotal(param);
            this.loading = false;
          },
          fail: (err) => {
            this.loading = false;
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
      onSubmit(){
        let queryKeys = Object.assign({},this.queryForm);
        queryKeys.startTime = queryKeys.daterange ? queryKeys.daterange[0] : '';
        queryKeys.endTime = queryKeys.daterange ? queryKeys.daterange[1] : '';
        delete queryKeys.daterange;
        Object.keys(queryKeys).forEach((item,index)=>{
          if(queryKeys[item] == ''){
            delete queryKeys[item]
          }
        });
        this.orderListData(queryKeys);
      },
      resetForm(){
        this.queryForm = {
          status : '',
          isDiscounted : '',
          daterange : ''
        };
        this.orderListData();
      },
      handleCurrentChange(page){
        this.currPage  = page;
        this.onSubmit();
      },
      handleShow(index,row){
        this.goodsList = row.orderList;
        this.dialogFormVisible = true;
      },
      handleSureSend(index,row){
        this.qrcodeUrl = `https://cartmall.net/enters/selfd/store/1?param=${row.id}`;
        this.scanDialogVisible = true;
      },
      queryTotal(param){
        Request({
          url : `/platforms/platform/order/countorderunion`,
          data : Object.assign({},{
            type : 1,
            takeType: 1,
            status: this.queryForm.status,
            isDiscounted : this.queryForm.isDiscounted,
            // starttime : this.queryForm.daterange ? this.queryForm.daterange[0] : '',
            // endtime  : this.queryForm.daterange ? this.queryForm.daterange[1] : '',
          },param),
          done : (res)=>{
            this.statData = res.data;
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('获取合计失败！');
            }
          }
        });
      },
      formatStatus(row, column, cellValue){
        let finalArr = this.statusList.filter((item,index)=>(
          item.value == cellValue
        ));
        return finalArr.length > 0 ? finalArr[0].label : '-';
      },
      formatTime(date) {
        return moment(date).format("YYYY/MM/DD HH:mm")
      },
      exportExcel(){
        let sendData = Object.assign({},this.queryForm);
        let queryStr = `type=1&takeType=1&`;
        sendData.startTime = sendData.daterange[0] ? moment(sendData.daterange[0]).format("YYYY-MM-DD HH:mm:ss") : '';
        sendData.endTime = sendData.daterange[1] ? moment(sendData.daterange[1]).format("YYYY-MM-DD HH:mm:ss") : '';
        delete sendData.daterange;
        Object.keys(sendData).forEach((key,index)=>{
          if(sendData[key] != ''){
            queryStr += `${key}=${sendData[key]}&`;
          }
        });
        window.location.href = `/platforms/platform/order/mailexport?${queryStr}`;
      }
    }
  }
</script>
<style >
.self-orders-box {
  padding: 1em;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .el-date-editor{
    width: 100% !important;
  }
  & .el-date-editor .el-range-input{
    width: 36%;
  }
  & .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0;
  }
  & .pro-photo{
    display: block;
    width: 3em;
    height: 3em;
  }
  & .scan-hint{
    text-align: center;
    font-size: 1.2em;
  }
}
</style>
