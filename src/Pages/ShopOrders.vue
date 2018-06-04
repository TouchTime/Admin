<template>
<div class="shop-orders-list">
  <div class="orders-list-box">
    <div class="shop-info">
      <el-row :gutter="20">
        <el-col :span="3">
          <span>掌柜姓名：</span>
          <span>{{owerName}}</span>
        </el-col>
        <el-col :span="3"> 
          <span>账户余额：</span>
          <span>	&yen;	{{statData ? (statData.account || 0) : 0}}</span>
        </el-col>
         <el-col :span="2"> 
          <span>押金：</span>
          <span>	&yen;	{{statData ? (99 || 0) : 0}}</span>
        </el-col>
         <el-col :span="3"> 
          <span class="returnDeposit" @click="retunMoney">退押金</span>
        </el-col>
        <!-- <el-col :span="3">
          <span>销售金额：</span>
          <span>	&yen;{{statData ? (statData.sellMoney || 0) : 0}}</span>
        </el-col>
        <el-col :span="3">
          <span>推荐奖励金额：</span>
          <span>&yen;	{{statData ? (statData.referMoney || 0) : 0}}</span>
        </el-col>
        <el-col :span="3">
          <span>推荐分润金额：{{statData ? (statData.sharerateMoney || 0) : 0}}</span>
        </el-col> -->
        <el-col  :span="10" >
        <el-dropdown>
        <span class="show-qrcode " @mouseenter.prevent="showShareQrcode" @mouseleave="hideShareQrcode">
          店铺二维码
          <i class="el-icon-arrow-down el-icon--right" v-if="isShow"></i> 
          <i class="el-icon-arrow-up el-icon--right" v-if="!isShow"></i>
           <!-- <i class="el-icon-arrow-down el-icon--right" :class="{rotate:isShow}"> -->
        </span>
        <el-dropdown-menu slot="dropdown">
           <div class="mask share">
            <div class="details-box">
              <div id="share-qrcode"></div>
            </div>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
  

      <!-- <el-menu  mode="horizontal"  :default-active="1" text-color="#333">
        <el-submenu index="1">
          <template slot="title">二维码</template>
          <el-menu-item > 
            <div class="mask share">
              <div class="details-box">
                <div id="share-qrcode"></div>
              </div>
            </div>
         </el-menu-item> 
        </el-submenu>
      </el-menu> -->
      </el-col>
        <el-col :span="3">
          <div class="align-right">
          <a class="go-back" @click.prevent="goBack" href="#">返回上级</a>
        </div>
        </el-col>
      </el-row>
    </div>
    
    <el-form ref="queryForm" :model="queryForm"  label-width="6em"  :label-position="labelPosition">
      <el-row type="flex" :gutter="20" > 
        <!-- <el-col :span="12">
          <el-form-item label="选择类型：">
            <el-select v-model="queryForm.type" placeholder="">
              <el-option label="进货" value="1"></el-option>
              <el-option label="销售" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="选择状态：" >
            <el-select v-model="queryForm.status" placeholder="请选择">
              <el-option label="支付失败" value="-1"></el-option>
              <el-option label="支付成功" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否优惠：">
            <el-select v-model="queryForm.isDiscounted" placeholder="请选择">
              <el-option label="无优惠" value="0"></el-option>
              <el-option label="有优惠" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间范围：">
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
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col :span="6">
          <el-form-item label="销售金额：">
            <el-input :value="`¥ ${statData ? (statData.allSum || 0) : 0} 元`" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合计利润：">
            <el-input :value="`¥ ${statData ? (statData.allProfitSum || 0) : 0} 元`" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单数量：">
            <el-input :value="statData ? (statData.orderCount || 0) : 0" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 新增推荐奖励等 -->
      <el-row type="flex" :gutter="20">
        <el-col :span="6">
          <el-form-item label="推荐奖励：">
            <el-input :value="`¥ ${statData ? (statData.referMoney || 0) : 0} 元`" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐分润：">
            <el-input :value="`¥ ${statData ? (statData.sharerateMoney || 0) : 0} 元`" :disabled="true"></el-input>
          </el-form-item>
        </el-col>  
      </el-row>
      <el-row type="flex" :gutter="20" >
        <el-col :span="6" >
          <el-form-item label="补货金额:">
            <el-input :value="statData ? (statData.addProMoney || 0) : 0 " :disabled="true"></el-input>
          </el-form-item>
        </el-col>
    
        <el-col :span="6">
          <el-form-item label="提现金额：">
            <el-input :value="statData ? (statData.cashMoney || 0) : 0" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20">
        <el-col :span="12" :offset="12">
          <el-form-item>
            <div class="align-right">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button @click="exportExcel" type="primary">导出Excel</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="type" label="订单类型" align="center">
        <template slot-scope="scope">{{['商家进货','普通购买'][scope.row.type - 1]}}</template>
      </el-table-column>
      <el-table-column prop="orderPayType" label="支付方式" align="center">
        <template slot-scope="scope">{{['支付宝','微信','银行卡'][scope.row.orderPayType - 1]}}</template>
      </el-table-column>
      <el-table-column prop="isDiscounted" label="是否使用优惠" min-width="120" align="center">
        <template slot-scope="scope">{{['否','是'][scope.row.isDiscounted]}}</template>
      </el-table-column>
      <el-table-column prop="totalSum" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="discountSum" label="折扣金额" align="center"></el-table-column>
      <el-table-column prop="paySum" label="支付金额" min-width="100" align="center">
        <template slot-scope="scope">{{scope.row.expressSum + scope.row.paySum}}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80" align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleShowOrder(scope.$index, scope.row)">商品清单</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderCode" label="订单编号" width="210"></el-table-column>
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
import { Request } from "../util.js";
import moment from "moment";
moment.locale("zh-CN");
export default {
  data() {
    return {
      owerName: "",
      queryForm: {
        userId: "",
        type: "2",
        status: "2",
        isDiscounted: "",
        daterange: []
      },
      statusList: [
        {
          label: "提交",
          value: 0
        },
        {
          label: "支付中",
          value: 1
        },
        {
          label: "支付成功",
          value: 2
        },
        {
          label: "接单",
          value: 3
        },
        {
          label: "发货",
          value: 4
        },
        {
          label: "确认收货",
          value: 5
        }
      ],
      dataList: [],
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      loading: false,
      dialogVisible: false,
      orderDetails: [],
      shopId: "",
      statData: {},
      erCode: "",
      isShow:true,
      labelPosition:"left"
    };
  },
  created() {
    this.shopId = this.$route.query.shopId;
    this.owerName = this.$route.query.owerName;
    this.queryList();
    this.queryTotal();
  },
  methods: {
    queryList(param) {
      this.loading = true;
      Request({
        url: `/platforms/platform/order/queryorderunionlist`,
        data: Object.assign(
          {},
          {
            shopId: this.shopId,
            status: this.queryForm.status,
            type: this.queryForm.type,
            isDiscounted: this.queryForm.isDiscounted,
            startTime: this.queryForm.daterange
              ? this.queryForm.daterange[0]
              : "",
            endTime: this.queryForm.daterange
              ? this.queryForm.daterange[1]
              : "",
            page: this.currPage,
            pageSize: this.pageSize
          },
          param
        ),
        done: res => {
          this.dataList = res.data.result;
          this.tableRows = res.data.totalNum;
          this.loading = false;
          this.queryTotal();
        },
        fail: err => {
          this.loading = true;
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error("获取合计失败！");
          }
        }
      });
    },
    queryTotal() {
      Request({
        url: `/platforms/platform/order/countorderunion`,
        data: {
          shopId: this.shopId,
          type: this.queryForm.type,
          status: this.queryForm.status,
          isDiscounted: this.queryForm.isDiscounted,
          starttime: this.queryForm.daterange
            ? this.queryForm.daterange[0]
            : "",
          endtime: this.queryForm.daterange ? this.queryForm.daterange[1] : ""
        },
        done: res => {
          this.statData = res.data;
        },
        fail: err => {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error("获取列表失败！");
          }
        }
      });
    },
    onSubmit() {
      this.queryList();
    },
    resetForm() {
      (this.queryForm = {
        userId: "",
        type: "2",
        status: "",
        isDiscounted: "",
        daterange: []
      }),
        this.queryList();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.queryList();
    },
    handleShowOrder(index, row) {
      this.orderDetails = row.orderList;
      this.dialogVisible = true;
    },
    formatStatus(row, column, cellValue) {
      if (cellValue > 0) {
        return this.statusList[cellValue].label;
      } else if (cellValue < 0) {
        return "支付失败";
      } else {
        return "-";
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    formatTime(date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
    exportExcel() {
      let sendData = Object.assign({}, this.queryForm);
      let queryStr = `shopId=${this.shopId}&`;
      sendData.startTime =
        sendData.daterange && sendData.daterange[0]
          ? moment(sendData.daterange[0]).format("YYYY-MM-DD HH:mm:ss")
          : "";
      sendData.endTime =
        sendData.daterange && sendData.daterange[1]
          ? moment(sendData.daterange[1]).format("YYYY-MM-DD HH:mm:ss")
          : "";
      delete sendData.daterange;
      Object.keys(sendData).forEach((key, index) => {
        if (sendData[key] != "") {
          queryStr += `${key}=${sendData[key]}&`;
        }
      });
      window.location.href = `/platforms/platform/order/export?${queryStr}`;
    },
    showShareQrcode() {
      setTimeout(()=>{
        this.isShow = false;
      },100)
      
      $("#share-qrcode").html("");
      const qrCodes = this.statData.erweima;
      if(qrCodes){
        $("#share-qrcode").qrcode({
            width: 150,
            height: 150,
            text: qrCodes
          });
      }
      
    },
    hideShareQrcode(){
      setTimeout(()=>{
        this.isShow = true;
      },100)
      
    },
    retunMoney() {
       const h = this.$createElement;
        this.$msgbox({
          title: '退还押金',
          message: h('p',  { style: 'text-align:center' }, [
            h('span', { style: 'text-align:center' }, '确认退还押金吗 '),
            h('p',{ style: 'text-align:center' }, '1、确认掌柜是否将货架退还'),
            h('p',null, '2、退还押金将会冻结店铺')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              // instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          });
        });
    
    }
  }
};
</script>
<style>
.shop-orders-list {
  padding: 1em;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .el-date-editor {
    width: 100% !important;
  }
  & .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0;
  }
  & .pro-photo {
    display: block;
    width: 3em;
    height: 3em;
  }
  & .shop-info {
    padding: 0.5em 0 1.5em 0;
    color: #606266;
  }
  & .my-qrcode {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .qrcode-box {
    width: 60%;
    margin: 0 auto;
    text-align: center;
    background-color: #f2f2f2;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    & .qrcode-img canvas {
      width: 100%;
      border: 0.8em solid #fff;
      box-sizing: border-box;
    }
  }
  & .showDetails-enter-active {
    animation: fadeIn 0.3s;
    & .qrcode-box {
      animation: zoomIn 0.3s;
    }
  }
  & .showDetails-leave-active {
    animation: fadeIn 0.3s reverse;
    & .qrcode-box {
      animation: zoomIn 0.3s reverse;
    }
  }
  & .back-btn-bar {
    padding: 2em 0;
    background-color: #fff;
  }
  & .back-btn {
    width: 90%;
    margin: 0 auto;
    line-height: 3em;
    text-align: center;
    background-color: #eee;
  }
  & #share-qrcode {
    width: 100%;
    & canvas {
      width: 7em;
      height: 7em;
      box-sizing: border-box;
    }
  }
  & .details-box {
    /* padding: 1em; */
    padding-left: 4em;
    margin-top: -1em;
  }
  & .show-qrcode {
    position: relative;
    cursor: pointer;
  }
  & .show-qrcode .share {
    position: absolute;
    z-index: 9999;
  }
}

.rotate{
  transform:rotate(180deg);
-ms-transform:rotate(180deg); /* Internet Explorer */
-moz-transform:rotate(180deg); /* Firefox */
-webkit-transform:rotate(180deg); /* Safari 和 Chrome */
-o-transform:rotate(180deg); /* Opera */
}
@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 1);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.returnDeposit{
  padding: 0.3em;
  border: 1px solid #00000038;
  border-radius: .2em;
  font-size: 12px;
}

</style>
