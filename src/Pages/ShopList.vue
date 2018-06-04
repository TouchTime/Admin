<template>
<div class="user-list-box">
  <el-form ref="queryForm" :model="queryForm" label-width="4.5em">
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form-item label="姓名：">
          <el-input v-model="queryForm.realName" value="" placeholder="掌柜姓名"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="电话：">
          <el-input v-model="queryForm.shopPhone" value="" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" placeholder="状态">
            <el-option label="冻结" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="待激活" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form-item label="时间：">
          <el-date-picker
            v-model="queryForm.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="6">
        <el-form-item>
          <div class="align-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-table v-loading="loading" ref="multipleTable" :data="tableData" style="width: 100%" stripe>
    <el-table-column prop="updateTime" label="激活时间" width="120" :formatter="(row, column, cellValue)=>((row.status != 2) && cellValue) ? formatTime(cellValue) : '-'" align="center"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="120" :formatter="(row, column, cellValue)=>((row.status != 2) && cellValue) ? formatTime(cellValue) : '-'" align="center"></el-table-column>
    <el-table-column prop="realName" label="掌柜姓名" min-width="100"></el-table-column>
    <el-table-column prop="shopPhone" label="联系电话" min-width="110" align="center"></el-table-column>
    <el-table-column prop="shopType" label="类型" min-width="100" :formatter="(row, column, cellValue)=>['网约车','大巴车'][cellValue-1]" align="center"></el-table-column>
    <el-table-column prop="shopLevel" label="等级" min-width="80" align="center"></el-table-column>
    <el-table-column prop="shopMark" label="综合评分" min-width="80" align="center"></el-table-column>
    <el-table-column prop="status" label="状态" min-width="80" :formatter="(row, column, cellValue)=>['冻结','正常','待激活'][cellValue]" align="center"></el-table-column>
    <el-table-column prop="" label="操作" min-width="600">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleShow(scope.$index, scope.row),dialogFormVisible=true">详情</el-button>
        <el-button
          size="mini"
          :disabled="scope.row.status != 2"
          @click="handleActivate(scope.$index, scope.row)">激活</el-button>
        <el-button
          size="mini"
          @click="showOrdes(scope.$index, scope.row)">查询订单</el-button>
        <el-popover
          placement="right"
          width="100"
          trigger="click"
          :content="shopBalance.toString() +'元'">
          <el-button style="margin:0 10px" size="mini" @click="showBalance(scope.row)" slot="reference">掌柜余额</el-button>
        </el-popover>
        <el-button
          size="mini"
          @click="showRecommend(scope.$index, scope.row)">查询推荐</el-button>
        <el-button
          size="mini"
          :disabled="!scope.row.qrCode"
          @click="unBind(scope.$index, scope.row)">解绑ER</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">{{scope.row.status==0?'取消冻结':'冻结'}}</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
    <div class="batch-btn">
    </div>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
  <el-dialog title="店铺详情" :visible.sync="dialogFormVisible">
    <el-form :model="detailForm">
      <el-col :span="12">
        <el-form-item label="店铺名称" :label-width="formLabelWidth">
          <el-input v-model="detailForm.shopName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth">
          <el-input v-model="detailForm.driverNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺类型" :label-width="formLabelWidth">
          <el-select v-model="detailForm.shopType" placeholder="请选择店铺类型">
            <el-option label="网约车" value="1"></el-option>
            <el-option label="大巴" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺等级" :label-width="formLabelWidth">
          <el-input v-model="detailForm.shopLevel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺状态" :label-width="formLabelWidth">
          <el-input v-model="detailForm.status" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系号码" :label-width="formLabelWidth">
          <el-input v-model="detailForm.shopPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备用号码" :label-width="formLabelWidth">
          <el-input v-model="detailForm.shopPhone2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="综合评分" :label-width="formLabelWidth">
          <el-input v-model="detailForm.shopMark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺描述" :label-width="formLabelWidth">
          <el-input v-model="detailForm.shopDescription" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺提示" :label-width="formLabelWidth">
          <el-input v-model="detailForm.tip" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleClose(),dialogFormVisible=false">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="推荐列表" :visible.sync="dialogRecommendVisible">
     <el-row :gutter="20">
      <el-col :span="11">
        <span>推荐人:</span>
        <span v-if="tableName">{{tableName.inviteName}} {{tableName.invitePhone}}</span>
        <span v-else>无</span>
      </el-col>
    </el-row>
    <el-table :data="recommendListData"  height="260">
      <el-table-column property="realname" label="姓名" align="center"></el-table-column>
      <el-table-column prop="updateTimes" label="店铺激活时间" :formatter="(row, column, cellValue)=>((row.status != 2) && cellValue) ? formatTime(cellValue) : '未激活'"></el-table-column>
      <el-table-column property="idCard" label="身份证号" align="center" width="180"></el-table-column>
      <el-table-column property="driverNo" label="车牌号" align="center"></el-table-column>
      <el-table-column property="onlineCarTypeDesc" label="网约车类型" align="center"></el-table-column>
    </el-table>
  </el-dialog>
</div>

</template>
<script>
import {Request,OrgRequest} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data() {
    return {
      queryForm: {
        realName:'',
        shopPhone: '',
        status: '',
        daterange:''
      },
      detailForm: {
        shopId:'',
        shopName: '',
        driverNo: '',
        shopType: '',
        shopLevel:'',
        status:'',
        shopPhone:'',
        shopPhone2:'',
        shopMark:'',
        shopDescription:'',
        tip:''
      },
      tableData: [],
      loading:false,
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      multipleSelection: [],
      dialogFormVisible: false,
      formLabelWidth: '80px',
      dialogRecommendVisible : false,
      recommendListData : [],
      shopBalance : 0,
      tableName:''
     
    };
  },

  created (){
    let {realName,shopPhone,status,daterange,currPage} = this.$route.query;
    this.currPage = Number(currPage) || 1;
    this.queryForm = {
      realName,
      shopPhone,
      status,
      daterange
    };
  	this.onSubmit();
  },

  methods: {
  	shopListData(param){
      let {
        currPage,
        pageSize
      } = this;
      this.loading = true;
      OrgRequest({
        url: `/platform/backshop/queryshoplist`,
        data: Object.assign({}, {
          page: currPage,
          pageSize: pageSize
        }, param),
        done: (res) => {
          this.tableData = res.data.result;
          this.tableRows = res.data.totalNum;
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
    resetForm() {
      this.queryForm = {
        shopName: '',
        shopPhone: '',
        status: '',
        daterange:''
      };
      this.currPage = 1;
      this.shopListData();
      this.recordStatus();
    },
    onSubmit() {
      let queryKeys = Object.assign({},this.queryForm);
      queryKeys.startTime = queryKeys.daterange ? moment(queryKeys.daterange[0]).format("YYYY-MM-DD HH:mm:ss") : '';
      queryKeys.endTime = queryKeys.daterange ? moment(queryKeys.daterange[1]).format("YYYY-MM-DD HH:mm:ss") :'';
      delete queryKeys.daterange;
      Object.keys(queryKeys).forEach((key,index)=>{
        if(queryKeys[key] == ''){
          delete queryKeys[key];
        }
      });
      this.shopListData(queryKeys);
      this.recordStatus();
    },
    handleShow(index,row) {
      this.detailForm.shopId = row.id;
      this.detailForm.shopName = row.shopName;
      this.detailForm.driverNo = row.carNo;
      this.detailForm.shopDescription = row.shopDescription;
      this.detailForm.shopLevel = row.shopLevel;
      this.detailForm.shopMark = row.shopMark;
      this.detailForm.shopPhone = row.shopPhone;
      this.detailForm.shopPhone2 = row.shopPhone2;
      this.detailForm.shopType = String(row.shopType);
      this.detailForm.status = row.status;
      this.detailForm.tip = row.tip;

    },
    handleClose() {
      OrgRequest({
        url: `/platform/backshop/updateshop/`+this.detailForm.shopId,
        method:'GET',
        data: this.detailForm,
        done: (res) => {
          this.shopListData();
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
      });
    },
    handleDelete(index,row) {
      this.$confirm('你确定要执行此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OrgRequest({
          url: `/platform/backshop/updateshop/`+ row.id,
          method:'get',
          data: {status:row.status==1?0:1},
          done: (res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.shopListData(this.queryForm);
          },
          fail: (err) => {
            console.log(err);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    unBind(index,row){
      this.$confirm('你确定要执行此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OrgRequest({
          url: `/platform/backshop/unbindewCode/`+ row.id,
          method:'post',
          done: (res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.shopListData(this.queryForm);
          },
          fail: (err) => {
            console.log(err);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.onSubmit();
    },
    showOrdes(index,row){
      this.recordStatus();
      this.$router.push({
        name : 'shopOrders',
        query:{
          shopId : row.id,
          owerName:row.realName
        }
      });
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD")
    },
    handleActivate(index,row){
      this.$confirm('你确定要执行此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url :`/platforms/platform/check/activityshop/${row.id}`,
          data: {},
          done : (res)=>{
            this.$message({
              message: '激活成功！',
              type: 'success'
            });
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('修改失败！');
            }
          }
        });
      }).catch(() => {

      });
    },
    recordStatus(){
      this.$router.replace({
        name : 'shoplist',
        query : Object.assign({currPage:this.currPage},this.queryForm)
      });
    },
    showRecommend(index,row){
      this.recommendListData = [];
      this.tableName = '';
       OrgRequest({
        url: `/platform/backshop/queryownerlist`,
        data: {driverNo:row.carNo,page:1,pageSize:2},
        done: (res) => {
          console.log(res.data)
          if(res.data.result[0].inviteName){
            this.tableName = Object.assign({},{inviteName:res.data.result[0].inviteName,invitePhone:res.data.result[0].invitePhone});
          }else{
            this.tableName = ''
          }
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
      
      Request({
        url : `/platforms/platform/backshop/invited`,
        method : 'POST',
        data: {inviteUid:row.userId},
        done : (res)=>{
          this.recommendListData = res.data.result;
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
      this.dialogRecommendVisible = true;
    },
    showBalance(row){
      Request({
        url : `/platforms/platform/backshop/remaining/${row.id}`,
        data:{},
        done : (res)=>{
          this.shopBalance = res.data[0].account;
        },
        fail:(err)=>{
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
      });
    }
  }
};
</script>
<style>
.user-list-box {
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .user-avatar {
    width: 2.4em;
  }
  & .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0;
  }
}
</style>
