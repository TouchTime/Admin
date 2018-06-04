<template>
<div class="productOrder-list-box">
  <el-form ref="queryForm" :model="queryForm" label-width="4em">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="类型：">
          <el-select v-model="queryForm.type" placeholder="请选择">
            <el-option label="进货" value="1"></el-option>
            <el-option label="销售" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="方式：">
          <el-select v-model="queryForm.takeType" placeholder="请选择">
            <el-option label="自取" value="0"></el-option>
            <el-option label="快递" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" placeholder="请选择">
            <el-option label="支付失败" value="-1"></el-option>
            <el-option label="提交" value="0"></el-option>
            <el-option label="支付中" value="1"></el-option>
            <el-option label="支付成功" value="2"></el-option>
            <el-option label="接单" value="3"></el-option>
            <el-option label="发货" value="4"></el-option>
            <el-option label="确认收货" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="优惠：">
          <el-select v-model="queryForm.isDiscounted" placeholder="请选择">
            <el-option label="无优惠" value="0"></el-option>
            <el-option label="有优惠" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
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
      <el-col :span="8">
        <div class="align-right">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
  <el-table ref="multipleTable" :data="tableData">
    <el-table-column prop="orderCode" label="订单编码" width="210"></el-table-column>
    <el-table-column prop="createTime" label="订单时间" width="170" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
    <el-table-column prop="takeType" label="取货方式" width="120" align="center" :formatter="(row, column, cellValue)=> ['自取','快递'][cellValue]"></el-table-column>
    <el-table-column prop="isDiscounted" label="使用优惠" width="120" align="center" :formatter="(row, column, cellValue)=> cellValue == 0  ? '无优惠':'有优惠'"></el-table-column>
    <el-table-column prop="expressSum" label="运费" width="120" align="center"></el-table-column>
    <el-table-column prop="discountSum" label="折扣金额" width="120" align="center"></el-table-column>
    <el-table-column prop="paySum" label="支付总金额" width="120" align="center"></el-table-column>
    <el-table-column prop="totalSum" label="订单价格" width="120" align="center"></el-table-column>
    <el-table-column prop="shopProfitSum" label="利润" width="120" align="center"></el-table-column>
    <el-table-column prop="status" label="状态" width="120" :formatter="(row, column, cellValue)=> formatStatus(cellValue)"></el-table-column>
    <el-table-column prop="checkReturnSum" label="确认退换额" width="120" align="center"></el-table-column>
    <el-table-column prop="finalSum" label="最终价格" width="120" align="center"></el-table-column>
    <el-table-column prop="consignee" label="收货人" width="120" align="center"></el-table-column>
    <el-table-column prop="address" label="收货地址" width="120" align="center"></el-table-column>
    <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
    <el-table-column prop="" label="操作" width="100" align="center" fixed="right">
      <template slot-scope="scope">
        <el-button
          type="primary"
          size="mini"
          @click="handleShow(scope.$index, scope.row),dialogFormVisible=true">子订单</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="子订单列表" :visible.sync="dialogFormVisible" width="80%">
    <el-table ref="multipleTable" :data="tableData1">
      <el-table-column prop="productUrl" label="商品图" width="80" fixed="left">
        <template slot-scope="scope"><img class="user-avatar" :src="scope.row.productUrl" alt=""></template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="230"></el-table-column>
      <el-table-column prop="productPrice" label="商品价格" width="120"></el-table-column>
      <el-table-column prop="cateName" label="类名" width="120"></el-table-column>
      <el-table-column prop="discountPrice" label="折扣价格" width="120"></el-table-column>
      <el-table-column prop="discountRate" label="折扣率" width="120"></el-table-column>
      <el-table-column prop="actualPrice" label="单价" width="120"></el-table-column>
      <el-table-column prop="numbers" label="件数" width="120"></el-table-column>
      <el-table-column prop="checkNumbers" label="确认收货数" width="120"></el-table-column>
      <el-table-column prop="takenNumbers" label="发货数" width="120"></el-table-column>
      <el-table-column prop="totalPrice" label="件数" width="120"></el-table-column>
      <el-table-column prop="unit" label="规格" width="120"></el-table-column>
      <el-table-column prop="shopProfitSum" label="利润" width="120"></el-table-column>
      <el-table-column prop="actualPaySum" label="支付额" width="120"></el-table-column>
    </el-table>

  </el-dialog>

  <div class="table-footer">
    <div class="batch-btn">
      <!-- <el-button @click="toggleSelection()">全部取消</el-button> -->
    </div>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
</div>
</template>
<script>
import {
  Request,
  OrgRequest
} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data() {
    return {
      queryForm: {
        orderCode: '',
        type: '2',
        takeType: '',
        isDiscounted: '',
        status: '',
        daterange:''
      },
      detailForm: {
        orderCode: '',
        takeType: '',
        isDiscounted: '',
        expressSum: '',
        discountSum: '',
        paySum: '',
        checkReturnSum: '',
        totalSum: '',
        finalSum: '',
        consignee: '',
        address: '',
        phone: '',
        shopProfitSum: '',
        status: ''
      },
      tableData: [],
      tableData1: [],
      currPage: 1,
      pageSize: 10,
      currPage1: 1,
      pageSize1: 10,
      tableRows: 0,
      multipleSelection: [],
      dialogFormVisible: false,
      formLabelWidth: '80px'
    };
  },

  created() {
    this.orderListData();
  },

  methods: {
    orderListData(param) {
      let {
        currPage,
        pageSize
      } = this;
      Request({
        url: `/platforms/platform/order/queryorderunionlist`,
        data: Object.assign({}, {
          type: this.queryForm.type,
          page: currPage,
          pageSize: pageSize
        }, param),
        done: (res) => {
          this.tableData = res.data.result;
          this.tableRows = res.data.totalNum;
        },
        fail: (err) => {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('请求失败，请重试！');
          }
        }
      });
    },
    resetForm() {
      this.queryForm = {
        orderCode: '',
        type: '2',
        takeType: '',
        isDiscounted: '',
        status: ''
      },
      this.orderListData();
    },
    onSubmit() {
      let queryKeys = Object.assign({},this.queryForm);
      queryKeys.startTime = queryKeys.daterange[0];
      queryKeys.endTime = queryKeys.daterange[1];
      delete queryKeys.daterange;
      Object.keys(queryKeys).forEach((key,index)=>{
        if(queryKeys[key] == ''){
          delete queryKeys[key];
        }
      });
      this.orderListData(queryKeys);
    },
    handleShow(index, row) {
      this.tableData1 = row.orderList;
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.onSubmit();
    },
    formatTime(date) {
      return moment(date).format("YYYY/MM/DD hh:mm")
    },
    formatStatus(value) {
      if (value == -1) return '支付失败';
      if (value == 0) return '提交';
      if (value == 1) return '支付中';
      if (value == 2) return '支付成功';
      if (value == 3) return '接单';
      if (value == 4) return '发货';
      if (value == 5) return '确认收货';
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm:ss")
    }
  }
};
</script>
<style>
.productOrder-list-box {
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0;
  }
  & .el-date-editor{
    width: 100% !important;
  }
}
</style>
