<template>
  <div class="root-list-box">
    <el-table v-loading="loading" :data="tableData" stripe >
      <el-table-column prop="adminName" label="管理员名称" align="center"></el-table-column>
      <el-table-column prop="realName" label="真实姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center"></el-table-column>
      <el-table-column prop="roleId" label="管理员角色" align="center" :formatter="formatRole"></el-table-column>
      <el-table-column prop="" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑角色</el-button>
          <el-button type="danger" size="mini" @click="handleEditPass(scope.$index, scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑角色" :visible.sync="dialogVisible" width="520px">
      <el-form :model="rootForm" label-width="7em">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="管理员名称：">
              <el-input v-model="rootForm.adminName" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="角色名称：">
              <el-select v-model="rootForm.roleId" placeholder="请选择">
                <el-option v-for="(item,index) in roleList" :label="item.role" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRootForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogPassVisible" width="520px">
      <el-form :model="passForm" label-width="7em">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="管理员名称：">
              <el-input v-model="passForm.adminName" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="旧密码：">
              <el-input type="password" v-model="passForm.oldPassword" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="新密码：">
              <el-input type="password" v-model="passForm.newPassword" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPassVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPassForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {Request} from '../util.js';
  export default {
    data(){
      return {
        tableData:[],
        loading : false,
        dialogVisible : false,
        rootForm : {
          id : '',
          adminName:'',
          roleId : '',
          roleDesc : ''
        },
        roleList : [],
        dialogPassVisible: false,
        passForm : {
          adminId : '',
          adminName:'',
          oldPassword : '',
          newPassword : ''
        }
      }
    },
    created(){
      this.queryRoleList();
    },
    methods :{
      handleEdit(index,row){
        this.rootForm.id = row.id;
        this.rootForm.adminName = row.adminName;
        this.rootForm.roleId = row.roleId;
        this.rootForm.roleDesc = row.roleDesc;
        this.dialogVisible = true;
      },
      queryRootList(){
        Request({
          url : `/platforms/back/role/findadmin`,
          method : 'POST',
          data : {},
          done : (res)=>{
            this.tableData = res.list;
          },
          fail : (err)=>{
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
      submitRootForm(){
        Request({
          url : `/platforms/back/role/setRole`,
          method : 'POST',
          data : this.rootForm,
          done : (res)=>{
            this.$message({
              message: '设置成功！',
              type: 'success'
            });
            this.queryRootList();
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
              this.$message.error('设置失败!');
            }
          }
        })
      },
      queryRoleList(){
        Request({
          url : `/platforms/back/role/find`,
          method : 'POST',
          data:{},
          done : (res)=>{
            this.roleList = res.list;
            this.queryRootList();
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('获取角色列表失败!');
            }
          }
        });
      },
      handleEditPass(index,row){
        this.passForm = {
          adminId : row.id,
          adminName:row.adminName,
          oldPassword : '',
          newPassword : ''
        }
        this.dialogPassVisible = true;
      },
      submitPassForm(){
        Request({
          url : `/systems/systemAdmin/updatePassword`,
          method : 'POST',
          data : {
            adminId : this.passForm.adminId,
            oldPassword : this.passForm.oldPassword,
            newPassword : this.passForm.newPassword
          },
          done : (res)=>{
            this.$message({
              message: '设置成功！',
              type: 'success'
            });
            this.dialogPassVisible = false;
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('修改失败!');
            }
          }
        });
      },
      formatRole(row, column, cellValue){
        let fArr = this.roleList.filter((item,index)=>(
          item.id == cellValue
        ));
        return fArr.length > 0 ? fArr[0].role : '-';
      }
    }
  }
</script>
<style>
  .root-list-box{
    padding: 1em;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    }
    & .table-tool-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0 0 1em 0;
      & .search-input {
        width: 16em;
      }
    }
  }
</style>
