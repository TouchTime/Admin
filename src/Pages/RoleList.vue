<template>
  <div class="role-list-box">
    <div class="table-tool-bar">
      <el-button type="primary" @click="handleEdit(-1,-1)">添加角色</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" stripe >
      <el-table-column prop="role" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="level" label="角色等级" align="center"></el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button type="danger" size="mini" @click="">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="540px">
      <el-form :model="roleForm" label-width="6em">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="角色名称：">
              <el-input v-model="roleForm.role" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="等级：">
              <el-input v-model="roleForm.level" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="权限：">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="(item,index) in rolesList" :key="item.id" :label="item.module"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {Request} from '../util.js';
  export default {
    data(){
      return {
        tableData : [],
        loading   : false,
        dialogVisible : false,
        roleForm : {
          role : '',
          level : '',
        },
        checkList : [],
        rolesList : []
      }
    },
    created(){
      this.queryRoleList();
      this.queryAllRoles();
    },
    methods : {
      queryRoleList(){
        this.loading = true;
        Request({
          url : `/platforms/back/role/find`,
          method : 'POST',
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
              this.$message.error('获取列表失败！');
            }
          }
        })
      },
      handleEdit(index,row){
        if(index == -1 && row ==-1){
          this.roleForm = {
            role : '',
            level : ''
          };
          this.dialogVisible = true;
        }else{
          this.loading = true;
          Request({
            url : `/platforms/back/role/findModule/${row.id}`,
            data :{},
            done : (res)=>{
              this.roleForm = {
                id : row.id,
                role : row.role,
                level : row.level
              };
              this.checkList = res.list.map((item,index)=>(
                item.module
              ));
              this.dialogVisible = true;
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
                this.$message.error('获取用户权限失败！');
              }
            }
          });
        }
      },
      queryAllRoles(){
        Request({
          url : `/platforms/back/role/getmodultlist`,
          data : {
            level : 2
          },
          done : (res)=>{
            this.rolesList = res.data;
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('获取权限列表失败！');
            }
          }
        });
      },
      saveUserRole(){
        let sendList = [];
        this.checkList.forEach((item,index)=>{
          this.rolesList.forEach((v,i)=>{
            if(v.module == item){
              sendList.push(v.id);
            }
          });
        });
        Request({
          url : `/platforms/back/role/updaterolemoudle`,
          method : 'GET',
          data : {
            role : this.roleForm.id,
            moduleJson : JSON.stringify(sendList)
          },
          done : (date)=>{
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
            this.queryRoleList();
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
              this.$message.error('保存失败！');
            }
          }
        });
      },
      submitRoleForm(){
        Request({
          url : `/platforms/back/role/saveOrUpdate`,
          method : 'POST',
          data : this.roleForm,
          done : (res)=>{
            this.saveUserRole();
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('保存失败！');
            }
          }
        });

      }
    }
  }
</script>
<style>
  .role-list-box{
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
    & .el-checkbox{
      width: 9em;
      margin:0!important;
    }
  }
</style>
