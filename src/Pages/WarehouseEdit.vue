<template>
  <div class="warehouse-edit">
    <div class="warehouse-form-box">
      <el-form class="warehouse-form" ref="warehouseForm" :model="warehouseForm" label-width="8em">
        <div class="form-left">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="仓库名称：">
                <el-input v-model="warehouseForm.store"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="仓库等级：">
                <el-input v-model="warehouseForm.level" placeholder="总仓库为0，其它仓库为1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="!isPossess">
            <el-col :span="24">
              <el-form-item label="设置管理员：">
                <el-autocomplete
                  class="select-keeper"
                  v-model="keeper"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入手机号码查找"
                  @select="handleSelect"
                >
                <template slot-scope="props">
                  <span class="select-nickname">{{ props.item.nickname }}</span>
                  <span>-</span>
                  <span class="select-uid">{{ props.item.id }}</span>
                </template>
              </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="isPossess">
            <el-col :span="18">
              <el-form-item label="管理员ID：">
                <el-input :disabled="true" v-model="warehouseForm.storeUserId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="danger" @click="deleteKeeper">解除绑定</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="联系电话：">
                <el-input v-model="warehouseForm.storePhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="仓库地址：">
                <el-input v-model="warehouseForm.storeAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-right">

        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import {Request} from '../util.js';
  export default {
    data(){
      return {
        warehouseForm : {
          id : '',
          store : '',
          level : '',
          storeImg : '',
          storeAddress :'',
          storePhone : '',
          storeUserId : ''
        },
        resetData : {},
        keeper : '',
        isPossess : ''
      }
    },
    created(){
      let { storeId } = this.$route.query;
      if(storeId && storeId > 0){
        this.queryStoreDetails(storeId);
      }
    },
    methods : {
      queryStoreDetails(storeId){
        Request({
          url : `/platforms/platform/store/${storeId}`,
          data : {},
          done : (res)=>{
            if(res.data){
              let {id,store,level,storeImg,storeAddress,storePhone,storeUserId} = res.data;
              level = level.toString();
              this.warehouseForm = {id,store,level,storeImg,storeAddress,storePhone,storeUserId};
              this.resetData = {id,store,level,storeImg,storeAddress,storePhone,storeUserId};
              this.isPossess = storeUserId ? true : false;
            }
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message({
                type: 'error',
                message: '获取仓库详情失败！'
              });
            }
          }
        });
      },
      querySearchAsync(queryString,cb){
        Request({
          url: `/platforms/platform/user`,
          data:{
            page:1,
            size:10,
            // userlevel:3,
            status : 0,
            phone : queryString.toString() || ''
          },
          done : (res)=>{
            cb(res.data.result);
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('获取列表失败!');
            }
          }
        });
      },
      handleSelect(item){
        this.keeper = `${item.nickname} - ${item.id}`;
        this.warehouseForm.userLevel = item.userLevel;
        this.warehouseForm.storeUserId = item.id;
      },
      deleteKeeper(){
        let id = this.warehouseForm.id;
        let uid = this.warehouseForm.storeUserId;
        this.$confirm('你确定要执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Request({
            url : `/platforms/platform/store/removeadmin/${id}/${uid}`,
            method : 'DELETE',
            data : {},
            done : (res)=>{
              this.$message({
                message: '仓管员解绑成功！',
                type: 'success'
              });
              this.warehouseForm.storeUserId = "";
              this.isPossess = false;
            },
            fail : (err)=>{
              if (err.responseJSON) {
                if (err.responseJSON.error_mesg) {
                  this.$message.error(err.responseJSON.error_mesg);
                } else if (err.responseJSON.error) {
                  this.$message.error(err.responseJSON.error);
                }
              } else {
                this.$message.error('仓管员解绑失败，请重试！');
              }
            }
          });
        }).catch(()=>{

        });
      },
      onSubmit(){
        let warehouseFormData = Object.assign({},this.warehouseForm);
        Object.keys(warehouseFormData).forEach((item,index)=>{
          if(!warehouseFormData[item]){
            delete warehouseFormData[item];
          }
        });
        Request({
          url : `/platforms/platform/store`,
          method : 'POST',
          data : warehouseFormData,
          done : (res)=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.$router.go(-1);
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('保存失败，请重试！');
            }
          }
        });
      },
      resetForm(){
        this.warehouseForm = Object.assign({},this.resetData);
      }
    }
  }
</script>
<style>
.warehouse-edit{
  padding: 2em;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .warehouse-form{
    display: flex;
    max-width: 960px;
    &>div{
      width: 50%;
    }
  }
  & .select-keeper{
    width: 100%;
    & .select-nickname{

    }
    & .select-uid{

    }
  }
}

</style>
