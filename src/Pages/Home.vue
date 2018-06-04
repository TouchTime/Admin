<template>
<div class="user-list-box">
  <el-form ref="queryForm" :model="queryForm" label-width="4em">
    <el-row type="flex" :gutter="20">
      <el-col :span="7">
        <el-form-item label="昵称：">
          <el-input v-model="queryForm.nickname" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="电话：">
          <el-input v-model="queryForm.phone" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" placeholder="状态">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex"  :gutter="20">
      <el-col :span="7">
        <el-form-item label="等级：">
          <el-select v-model="queryForm.userlevel" placeholder="等级">
            <!-- <el-option label="微信授权登录" value="1"></el-option>
            <el-option label="支付宝授权登录" value="2"></el-option> -->
            <el-option label="普通用户" value="3"></el-option>
            <el-option label="仓管员" value="5"></el-option>
            <el-option label="商户" value="200"></el-option>
            <el-option label="运营人员" value="4000"></el-option>
            <el-option label="经理" value="9999"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="时间：">
          <el-date-picker
            v-model="queryForm.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']" >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <div class="align-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex"  :gutter="20">
      <el-col :span="8">
        <el-button type="primary" @click="exportExcel">导出Excel</el-button>
      </el-col>
    </el-row>
  </el-form>
  <el-table v-loading="loading" ref="multipleTable" :data="tableData" style="width: 100%" stripe @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange">
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column prop="createTime" label="创建时间" width="160" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
    <el-table-column prop="headImg" label="头像" min-width="60">
      <template slot-scope="scope"><img class="user-avatar" :src="scope.row.headImg" alt=""></template>
    </el-table-column>
    <el-table-column prop="nickname" label="昵称" min-width="160" align="center"></el-table-column>
    <el-table-column prop="gender" label="性别" min-width="80" align="center" :formatter="(row, column, cellValue)=> cellValue == 1  ? '男':(cellValue == 2 ? '女' : '未知')"></el-table-column>
    <el-table-column prop="phone" label="电话" min-width="120" align="center"></el-table-column>
    <el-table-column prop="city" label="省份/城市" min-width="180" align="center" :formatter="(row, column, cellValue)=> `${row.province}/${cellValue}` "></el-table-column>
    <el-table-column prop="levelName" label="等级" min-width="100" align="center"></el-table-column>
    <el-table-column prop="statusName" label="状态" min-width="70" align="center"></el-table-column>
    <el-table-column prop="" label="操作" width="190" align="center">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleShow(scope.$index, scope.row)">详情</el-button>
        <el-button v-if="scope.row.userlevel != 4000" size="mini" @click="handleSetRoot(scope.$index, scope.row)">设置管理员</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
    <div class="batch-btn">
      <!-- <el-button @click="batchSendMessage">批量发短信</el-button>
      <el-button @click="toggleSelection()">全部取消</el-button> -->
    </div>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
</div>
</template>
<script>
import {Request} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data() {
    return {
      queryForm: {
        nickname: '',
        phone: '',
        status: '0',
        userlevel:'3',
        daterange:''
      },
      tableData: [],
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      multipleSelection: [],
      loading:true,
    };
  },
  beforeRouteEnter (to, from, next) {
    let loginInfo = window.sessionStorage.getItem('loginInfo');
    if(JSON.parse(loginInfo) && JSON.parse(loginInfo).data && JSON.parse(loginInfo).data.moduleList){
      let userAuthList = JSON.parse(loginInfo).data.moduleList;
      let finalArr = userAuthList.filter((item,index)=>(
        item.moduleUri == to.path
      ));
      if(finalArr.length > 0){
        next();
      }else{
        alert('您无权访问该页面，请联系管理员！');
      }
    }
  },
  created() {
    let {nickname,phone,status,userlevel,daterange,currPage} = this.$route.query;
    this.currPage = Number(currPage) || 1;
    this.queryForm = {
      nickname:nickname || '',
      phone:phone || '',
      status : status || 0,
      userlevel: userlevel || '3',
      daterange : daterange || []
    };
  	this.onSubmit();
  },
  methods: {
    queryUserList(param) {
      let { currPage, pageSize } = this;
      this.loading = true;
      Request({
        url: `/platforms/platform/user`,
        data: Object.assign({}, {
          page: currPage,
          size: pageSize,
          userlevel: this.queryForm.userlevel,
          status: this.queryForm.status,
        }, param),
        done: (res) => {
          this.tableData = res.data.result;
          this.tableRows = res.data.totalNum;
          this.loading = false;
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
    batchSendMessage() {
      //批量发短信
      if (this.multipleSelection.length > 0) {
        this.$message.error('抱歉，此功能正在开发中...,给您带来的不便，请谅解！');
      } else {
        this.$message({
          message: '请先选择批量发短息的用户！',
          type: 'warning'
        });
      }
    },
    handleSelectionChange(val) {
      //取消多选
      this.multipleSelection = val;
    },
    handleSelect(selection, row) {
      //多选事件
      console.log(selection);
    },
    handleSelectAll(selection) {
      //全选事件
      console.log(selection);
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    resetForm() {
      this.queryForm = {
        nickname: '',
        phone: '',
        status: '0',
        userlevel:'3',
        daterange:[]
      };
      this.currPage = 1;
      this.queryUserList();
      this.recordStatus();
    },
    onSubmit() {
      let sendData = Object.assign({},this.queryForm);
      sendData.startTime = sendData.daterange[0] ? moment(sendData.daterange[0]).format("YYYY-MM-DD HH:mm:ss") : '';
      sendData.endTime = sendData.daterange[1] ? moment(sendData.daterange[1]).format("YYYY-MM-DD HH:mm:ss") : '';
      delete sendData.daterange;
      Object.keys(sendData).forEach((key,index)=>{
        sendData[key] =='' && delete sendData[key];
      });
      this.queryUserList(sendData);
      this.recordStatus();
    },
    handleShow(index,row) {
      //查看用户详情
      this.recordStatus();
      this.$router.push({
        name : 'userDetails',
        query:{ uid : row.id }
      });
    },
    handleDelete() {
      //禁止用户
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.onSubmit();
    },
    handleSetRoot(index,row){
      this.$confirm('你确定要执行此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url : `/platforms/back/role/setamdin`,
          method : 'POST',
          data : {
            userId : row.id
          },
          done : (res)=>{
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
            this.queryUserList();
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
    exportExcel(){
      let sendData = Object.assign({},this.queryForm);
      let queryStr = '';
      sendData.startTime = sendData.daterange[0] ? moment(sendData.daterange[0]).format("YYYY-MM-DD HH:mm:ss") : '';
      sendData.endTime = sendData.daterange[1] ? moment(sendData.daterange[1]).format("YYYY-MM-DD HH:mm:ss") : '';
      delete sendData.daterange;
      Object.keys(sendData).forEach((key,index)=>{
        if(sendData[key] != ''){
          queryStr += `${key}=${sendData[key]}&`;
        }
      });
      window.location.href = `/platforms/platform/user/export?${queryStr}`;
    },
    recordStatus(){
      this.$router.replace({
        name : 'home',
        query : Object.assign({currPage:this.currPage},this.queryForm)
      });
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm")
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
  & .el-date-editor{
    width: 100% !important;
  }
}
</style>
