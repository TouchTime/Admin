<template >
<div class="warehouse-list">
  <div class="table-tool-bar">
    <el-button type="primary" @click="showDetails(-1,-1)">添加仓库</el-button>
    <el-form @submit.native.prevent="submitForm">
      <el-form-item>
        <el-input v-model="keyWords" class="search-input" placeholder="搜索仓库名称..."></el-input>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-loading="loading" :data="tableData" style="width: 100%">
    <el-table-column prop="store" label="名称" width="180"></el-table-column>
    <el-table-column prop="storePhone" label="电话" width="120" align="center"></el-table-column>
    <el-table-column prop="storeUserId" label="管理员" width="120" align="center"></el-table-column>
    <el-table-column prop="level" label="等级" align="center"></el-table-column>
    <!-- <el-table-column prop="orders" label="总订单数" align="center"></el-table-column>
    <el-table-column prop="sellSum" label="总出货金额" min-width="120" align="center"></el-table-column> -->
    <el-table-column prop="storeAddress" label="地址" width="360"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="160" :formatter="(row, column, cellValue)=>formatTime(cellValue)" align="center"></el-table-column>
    <el-table-column prop="status" label="状态"></el-table-column>
    <el-table-column prop="" label="操作" width="200" align="center">
      <template slot-scope="scope">
        <el-button size="mini" @click="showGoods(scope.$index, scope.row)">仓库商品</el-button>
        <el-button size="mini" @click="showDetails(scope.$index, scope.row)">详情</el-button>
        <!-- <el-button size="mini" type="danger" @click="delWareHouse(scope.$index, scope.row)">删除</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
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
      keyWords:'',
      tableData: [],
      currPage : 1,
      pageSize : 10,
      tableRows : 1,
      loading : true
    }
  },
  created(){
    this.queryListData();
  },
  methods :{
    queryListData(param){
      let {currPage,pageSize} = this;
      this.loading = true;
      Request({
        url : '/platforms/platform/store',
        data : Object.assign({},{
          page:currPage,
          size:pageSize
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
            this.$message.error('列表获取失败！');
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.queryListData();
    },
    submitForm(){
      this.queryListData({store:this.keyWords});
    },
    showGoods(index,row){
      //查看仓库商品
      this.$router.push({
        name : 'warehouseGoods',
        query:{
          storeId : row.id
        }
      });
    },
    showDetails(index,row){
      //查看详情
      this.$router.push({
        name : 'warehouseEdit',
        query:{
          storeId : row.id ? row.id : -1
        }
      });
    },
    delWareHouse(index,row){
      //删除仓库
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url : `/platforms/platform/store/${row.id}`,
          method : 'DELETE',
          data :{},
          done : (res)=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryListData();
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('删除失败！');
            }
          }
        });
      }).catch(() => {

      });
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD hh:mm")
    }
  }
}
</script>
<style>
.warehouse-list {
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .table-tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    & .search-input {
      width: 16em;
    }
  }
  & .table-footer{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1em 0;
  }
  & .error-bar{
    margin: 0 0 1em 0;
  }
}
</style>
