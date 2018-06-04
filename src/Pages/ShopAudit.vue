<template>
<div class="user-list-box">
  <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
    <el-form-item label="状态：">
      <el-select v-model="queryForm.status" placeholder="状态">
        <el-option label="提交资料（未缴纳金额）" ></el-option>
        <el-option label="待审核" value="0"></el-option>
        <el-option label="未通过" value="-1"></el-option>
        <el-option label="已通过" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="queryForm.driverNo" placeholder="车牌号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  <el-table v-loading="loading" ref="multipleTable" :data="tableData" stripe @cell-click="handleImg">
    <el-table-column prop="realname" label="真实姓名" align="center" ></el-table-column>
    <el-table-column prop="idCard" label="身份证号" min-width="170" align="center"></el-table-column>
    <el-table-column prop="driverNo" label="车牌号" min-width="100" align="center"></el-table-column>
    <el-table-column prop="onlineCarUrl" label="网约车图片" min-width="100" align="center">
      <template slot-scope="scope"><img @click="showCertifyPhoto(scope.row.onlineCarUrl)" class="certify-photo" :src="scope.row.onlineCarUrl" alt=""></template>
    </el-table-column>
    <el-table-column prop="onlineCarTypeDesc" label="网约车类型" min-width="100" align="center"></el-table-column>
    <!-- 新增推荐掌柜 -->
    <el-table-column prop="inviteName" label="推荐掌柜" align="center"  width="200" :formatter="shareCabinet"></el-table-column>
    <el-table-column prop="status" label="状态" align="center" :formatter="formatStatus"></el-table-column>
    <el-table-column prop="createTime" label="时间" width="170" :formatter="(row, column, cellValue)=>cellValue ? formatTime(cellValue) : '-'" align="center"></el-table-column>
    <el-table-column label="操作" min-width="340">
      <template slot-scope="scope">
      	<div class="btn-group" v-if="scope.row.status==0">
	        <el-button size="mini" type="success" @click="dialogCheckVisible=true,checkStatus=1,checkOwnerId=scope.row.id,checkText=''">通过</el-button>
	        <el-button size="mini" type="danger" @click="dialogCheckVisible=true,checkStatus=-1,checkOwnerId=scope.row.id,checkText=''">不通过</el-button>
          <el-button size="mini" @click="editApply(scope.$index, scope.row)">编辑</el-button>
        </div>
        <el-popover
          placement="right"
          width="120"
          trigger="click"
          :content="userInfo ? (userInfo.phone ? userInfo.phone : '未知') : '未知'">
          <el-button size="mini" @click="getUserInfo(scope.row.userId)" slot="reference">联系方式</el-button>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="mesg" label="审核意见" min-width="180"></el-table-column>
  </el-table>
  <div class="table-footer">
    <div class="batch-btn"></div>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
  <el-dialog title="图片预览" :visible.sync="dialogImgVisible" width="30%">
  	<el-card :body-style="{ padding: '0px' }">
      <img :src="showImage" class="image">
    </el-card>
  </el-dialog>
  <el-dialog title="审核意见" :visible.sync="dialogCheckVisible" width="30%">
  	<el-row>
  		<el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入内容" v-model="checkText"></el-input>
  	</el-row>
  	<el-row>
  		<el-select v-model="checkShopType" placeholder="请选择店铺类型">
	    	<el-option label="网约车" value="1"></el-option>
	    	<el-option label="大巴" value="2"></el-option>
  		</el-select>
  	</el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogCheckVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleCheck(),dialogCheckVisible=false">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="编辑" :visible.sync="dialogEditVisible" width="520px">
    <el-form :model="eidtForm" label-width="6em">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="姓名：">
            <el-input v-model="eidtForm.realname" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="车牌号：">
            <el-input v-model="eidtForm.driverNo" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="身份证号：">
            <el-input v-model="eidtForm.idCard" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitEditForm">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="certifyPhotoPvw" width="500px">
    <img width="100%" :src="certifyPhotoUrl" alt="">
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
        status: '1',
        carNo : ''
      },
      checkText:'',
      checkStatus:'',
      checkShopType:'',
      checkOwnerId:'',
      showImage:'',
      imgPropertyNames:[
      	'idcardUrl',
      	'idcardBackUrl',
      	'holdIdcardUrl',
      	'driverUrl',
      	'driverBackUrl',
      	'moveUrl',
      	'moveBackUrl'],
      tableData: [],
      loading:false,
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      multipleSelection: [],
      dialogImgVisible: false,
      dialogCheckVisible:false,
      formLabelWidth: '80px',
      certifyPhotoPvw : false,
      certifyPhotoUrl : '',
      userInfo : {},
      dialogEditVisible:false,
      eidtForm:{
        id : '',
        realname : '',
        driverNo : '',
        idCard : ''
      }
    };
  },

  created (){
  	this.shopListData();
  },

  methods: {
  	shopListData(param){
      let {
        currPage,
        pageSize
      } = this;
      this.loading = true;
      OrgRequest({
        url: `/platform/backshop/queryownerlist`,
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
        realname: '',
        idCard: ''
      };
      this.shopListData();
    },
    onSubmit() {
      let queryKeys = Object.assign({},this.queryForm);
      Object.keys(queryKeys).forEach((key,index)=>{
        if(queryKeys[key] == ''){
          delete queryKeys[key];
        }
      });
      this.shopListData(queryKeys);
    },
    handleDelete(index,row) {
      OrgRequest({
        url: `/platform/backshop/updateshop/`+ row.id,
        method:'get',
        data: {status:row.status==1?0:1},
        done: (res) => {
          this.shopListData(this.queryForm);
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    handleImg(row, column, cell, event){
    	this.imgPropertyNames.forEach((name, index) => {
    		if(column.property==name){
    			this.showImage = row[name];
    			this.dialogImgVisible = true;
    		}
    	})
    },
    handleCheck(){
      OrgRequest({
        url: `/platform/check/driver`,
        method:'post',
        data: {id:this.checkOwnerId,mesg:this.checkText,isPass:this.checkStatus,shopType:this.checkShopType},
        done: (res) => {
          this.shopListData(this.queryForm);
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
    handleCurrentChange(val) {
      this.currPage = val;
      this.onSubmit();
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm")
    },
    formatStatus(row, column, cellValue){
      return ['未通过','待审核','已通过'][cellValue+1];
    },
    showCertifyPhoto(src){
      this.certifyPhotoPvw = true;
      this.certifyPhotoUrl = src;
    },
    getUserInfo(uid){
      Request({
        url : `/platforms/platform/user/${uid}`,
        data : {},
        done : (res)=>{
          this.userInfo = res.data;
        },
        fail : (err)=>{
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('获取联系方式失败！');
          }
        }
      })
    },
    editApply(index,row){
      this.eidtForm = {
        id : row.id,
        realname : row.realname,
        driverNo : row.driverNo,
        idCard : row.idCard
      }
      this.dialogEditVisible = true;
    },
    submitEditForm(){
      Request({
        url : `/platforms/platform/check/updateowner`,
        method : 'POST',
        data : this.eidtForm,
        done : (res)=>{
          this.$message({
            type: 'success',
            message: '编辑成功!'
          });
          this.dialogEditVisible = false;
          this.shopListData();
        },
        fail : (err)=>{
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              this.$message.error(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              this.$message.error(err.responseJSON.error);
            }
          } else {
            this.$message.error('编辑失败！');
          }
        }
      });
    },
    shareCabinet(row,column,cellValue){
     console.log(row)
     if(row.inviteName){
       return `
       ${row.inviteName} 
      ${row.invitePhone}
       `
     }
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
  & .btn-group{
    display:inline-block;
    margin : 0 0.6em 0 0;
  }
}

.certify-photo{
  display: block;
  width: 3em;
  height: 3em;
  margin: 0 auto;
  &:hover{
    cursor: pointer;
  }
}
</style>
