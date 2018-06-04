<template>
  <div class="driver-operate-box">
    <h3 class="do-title">司机端配置</h3>
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
      <el-table-column prop="value" label="当前值" align="center"></el-table-column>
      <el-table-column prop="isEdit" label="是否可编辑" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
        	<el-button v-if="scope.row.isEdit == 1" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑配置项" :visible.sync="dialogFormVisible" width="420">
      <el-form :model="editForm" label-width="6em">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="描述：">
              <el-input v-model="editForm.description" placeholder="" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="参数值：">
              <el-input v-model="editForm.value" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Request } from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data(){
    return {
      tableData : [],
      loading:false,
      dialogFormVisible : false,
      editForm : {
        description : '',
        value : '',
        id : '',
        keyName : '',
        isEdit : ''
      }
    }
  },
  created(){
    this.queryList();
  },
  methods : {
    queryList(){
      this.loading = true;
      Request({
        url : `/systems/systemDictionary/find`,
        data : {},
        done : (res)=>{
          this.tableData = res.list;
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
            this.$message.error('获取参数失败！');
          }
        }
      });
    },
    handleEdit(index,row){
      this.dialogFormVisible = true;
      this.editForm = row;
    },
    submitForm(){
      Request({
        url : `/systems/systemDictionary/saveOrUpdate`,
        method : 'POST',
        data : this.editForm,
        done : (res)=>{
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.queryList();
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
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm:ss")
    }
  }
}
</script>
<style>
.driver-operate-box{
  & .do-title{
    font-weight: normal;
  }
}
</style>
