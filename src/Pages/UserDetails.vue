<template >
<div class="user-details">
  <div class="user-base-info">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content"><span>用户ID：</span><span>{{uid}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"><span>昵称：</span><span>{{userInfo.nickname}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"><span>电话：</span><span>{{userInfo.phone}}</span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"><span>等级：</span>{{userInfo.levelName}}<span></span></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content"><span>状态：</span>{{userInfo.statusName}}<span></span></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"><span>购买总金额：</span>{{userCost}}元<span></span></div>
      </el-col>
      <el-col :span="6" :offset="6">
        <div class="grid-content"><a class="go-back" @click.prevent="goBack" href="#">返回上级</a></div>
      </el-col>
    </el-row>
  </div>
  <div class="user-orders">
    <el-table :data="orderList">
      <!-- <el-table-column prop="orderCode" label="订单编号" width="210"></el-table-column>
      <el-table-column prop="shopId" label="店铺ID" width="100" align="center"></el-table-column> -->
      <el-table-column prop="type" label="订单类型" align="center">
        <template slot-scope="scope">{{['商家进货','普通购买'][scope.row.type - 1]}}</template>
      </el-table-column>
      <el-table-column prop="orderPayType" label="支付方式" align="center">
        <template slot-scope="scope">{{['支付宝','微信','银行卡'][scope.row.orderPayType - 1]}}</template>
      </el-table-column>
      <el-table-column prop="isDiscounted" label="是否使用优惠" width="120" align="center">
        <template slot-scope="scope">{{['否','是'][scope.row.isDiscounted]}}</template>
      </el-table-column>
      <el-table-column prop="totalSum" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="discountSum" label="折扣金额" align="center"></el-table-column>
      <el-table-column prop="paySum" label="支付金额" width="120" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleShowOrder(scope.$index, scope.row)">商品清单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div class="batch-btn"></div>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
      </el-pagination>
    </div>
  </div>
  <el-dialog title="商品清单" :visible.sync="dialogVisible" width="50">
    <el-table :data="orderDetails">
      <el-table-column prop="productName" label="商品" width="140"></el-table-column>
      <el-table-column prop="productUrl" label="图片">
        <template slot-scope="scope"><img class="pro-photo" :src="scope.row.productUrl" alt=""></template>
      </el-table-column>
      <el-table-column prop="unit" label="规格/单位" align="center" :formatter="(row, column, cellValue)=> cellValue || '-'"></el-table-column>
      <el-table-column prop="actualPrice" label="单价" align="center" :formatter="(row, column, cellValue)=> `¥ ${(cellValue || 0).toFixed(2)}`"></el-table-column>
      <el-table-column prop="numbers" label="数量" align="center" :formatter="(row, column, cellValue)=> `X ${(cellValue || 0)}`"></el-table-column>
      <el-table-column prop="totalPrice" label="总价" align="right" :formatter="(row, column, cellValue)=> `¥ ${(cellValue || 0).toFixed(2)}`"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { Request } from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data() {
    return {
      uid: '',
      userInfo: {},
      orderList: [],
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      dialogVisible: false,
      orderDetails: [],
      userCost:0
    }
  },
  created() {
    this.uid = this.$route.query.uid;
    this.queryUerData();
    this.queryUserSpend();
  },
  methods: {
    queryUerData() {
      let { uid, currPage, pageSize} = this;
      Request({
        url: `/platforms/platform/user/${uid}/${currPage}/${pageSize}`,
        data: {},
        done: (res) => {
          this.orderList = res.data.result.orderList;
          this.tableRows = res.data.totalNum;
          let dd = Object.assign({}, res.data.result);
          delete dd.orderList;
          this.userInfo = dd;
        },
        fail: (err) => {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('获取详情失败！');
          }
        }
      })
    },
    queryUserSpend(){
      Request({
        url: `/platforms/platform/statistics/countUserBuy`,
        data: {uid : this.uid},
        done: (res) => {
          this.userCost = res.data;
        },
        fail: (err) => {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('获取失败！');
          }
        }
      })
    },
    handleCurrentChange(val){
      this.currPage = val;
      this.queryUerData();
    },
    handleShowOrder(index,row) {
      this.orderDetails = row.orderList;
      this.dialogVisible = true;
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm")
    },
    goBack(){
      this.$router.go(-1);
    }
  }
}
</script>
<style>
.user-details {
  padding: 1em;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .user-base-info {
    padding: 0 0 1em 0;
    margin: 0 0 1em 0;
    border-bottom: 1px solid #f6f6f6;
    & .grid-content {
      padding: 0.6em 0;
    }
  }
  & .table-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0;
  }
}
</style>
