<template>
  <div class="withdraw-list-box">
    <el-form ref="queryForm" :model="queryForm" label-width="6em">
      <el-row type="flex" :gutter="20">
        <el-col :span="8">
          <el-form-item label="真实姓名：">
            <el-input v-model="queryForm.realname" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话号码：">
            <el-input v-model="queryForm.phone" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提现状态：">
            <el-select v-model="queryForm.status" placeholder="请选择">
              <el-option label="不通过" value="-1"></el-option>
              <el-option label="提交" value="0"></el-option>
              <el-option label="通过" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="车牌号码：">
            <el-input  placeholder=""></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row type="flex"  :gutter="20">
        <el-col :span="8">
          <el-form-item label="提现方式：">
            <el-select v-model="queryForm.payType" placeholder="请选择">
              <el-option label="银行卡" value="1"></el-option>
              <el-option label="微信" value="2"></el-option>
              <el-option label="支付宝" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="8">
          <el-form-item>
            <div class="align-right">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="tableData" stripe>
      <el-table-column prop="realname" label="姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120" align="center"></el-table-column>
      <el-table-column prop="carNo" label="车牌号" width="120" align="center"></el-table-column>
      <el-table-column prop="idNo" label="身份证号码" width="180" align="center"></el-table-column>
      <el-table-column prop="cachBankcard" label="银行卡" width="180" align="center"></el-table-column>
      <el-table-column prop="payType" label="提现方式" align="center" :formatter="(row, column, cellValue)=> ['银行卡','微信','支付宝'][cellValue-1]"></el-table-column>
      <el-table-column prop="cashNumber" label="提现金额" align="center"></el-table-column>
      <el-table-column prop="status" label="提现状态" align="center" :formatter="(row, column, cellValue)=>['不通过','提交','通过'][cellValue+1]"></el-table-column>
      <el-table-column prop="createTime" label="提现时间" width="180" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="primary" size="mini" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div class="batch-btn"></div>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
      </el-pagination>
    </div>
    <el-dialog title="审核操作" :visible.sync="dialogVisible" width="30%">
      <el-form :model="auditForm" label-width="5em">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="姓名：">
              <el-input v-model="auditForm.realname" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="金额：">
              <el-input v-model="auditForm.cashNumber" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审核：">
              <el-select v-model="auditForm.isPass" placeholder="请选择">
                <el-option label="不通过" value="-1"></el-option>
                <el-option label="通过" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {Request} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
  export default {
    data(){
      return {
        queryForm : {
          realname : '',
          phone : '',
          payType : '',
          status : ''
        },
        tableData : [],
        currPage : 1,
        pageSize : 10,
        tableRows : 1,
        loading : false,
        dialogVisible : false,
        auditForm : {
          realname : '',
          cashNumber : '',
          cashId : '',
          isPass : ''
        }
      }
    },
    created(){
      this.queryWithdrawList();
    },
    methods : {
      queryWithdrawList(param){
        this.loading = true;
        Request({
          url : '/platforms/back/cash/querycashlist',
          data : Object.assign({},{
            page : this.currPage,
            pageSize : this.pageSize
          },param),
          done : (res)=>{
            this.tableData = res.data.result;
            this.tableRows = res.data.totalNum;
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
              this.$message.error('获取列表失败！');
            }
          }
        })
      },
      handleCurrentChange(val){
        this.currPage = val;
        this.onSubmit();
      },
      onSubmit(){
        let queryKeys = Object.assign({},this.queryForm);
        Object.keys(queryKeys).forEach((key,index)=>{
          if(queryKeys[key] == ''){
            delete queryKeys[key];
          }
        });
        this.queryWithdrawList(queryKeys);
      },
      resetForm(){
        this.queryForm = {
          realname : '',
          phone : '',
          payType : '',
          status : ''
        };
        this.queryWithdrawList();
      },
      handleAudit(index,row){
        this.auditForm = {
          realname : row.realname,
          cashNumber : row.cashNumber,
          cashId : row.id
        };
        this.dialogVisible = true;
      },
      submitAuditForm(){
        Request({
          url : `/platforms/platform/check/ownercash`,
          method : 'POST',
          data : {
            cashId : this.auditForm.cashId,
            isPass : this.auditForm.isPass
          },
          done : (res)=>{
            this.onSubmit();
            this.dialogVisible = false;
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('审核失败！');
            }
          }
        })
      },
      formatTime(date){
        return moment(date).format("YYYY/MM/DD hh:mm")
      }
    }
  }
</script>

<style>
.withdraw-list-box{
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
}
</style>
