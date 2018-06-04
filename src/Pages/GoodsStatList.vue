<template>
  <div class="goods-stat-list">
    <el-form ref="queryForm" :model="queryForm" label-width="6.5em">
      <el-row type="flex" :gutter="20">
        <el-col :span="14">
          <el-form-item label="商品名称：">
            <el-input v-model="queryForm.productName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :span="8" :offset="2">
            <div class="align-right">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="productImgUrl" label="图片" >
        <template slot-scope="scope"><img class="goods-photo" :src="scope.row.productImgUrl" alt=""></template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
      <el-table-column prop="cateName" label="类别" align="center"></el-table-column>
      <el-table-column prop="unit" label="规格" width="120" align="center"></el-table-column>
      <!-- <el-table-column prop="sums" label="销售额" width="120" align="center" :formatter="(row, column, cellValue)=> cellValue || '-' "></el-table-column> -->
      <el-table-column prop="sells" sortable label="销量" width="120" align="center" :formatter="(row, column, cellValue)=> cellValue || '-' "></el-table-column>
      <!-- <el-table-column prop="orders" label="订单量" width="120" align="center" :formatter="(row, column, cellValue)=> cellValue || '-' "></el-table-column> -->
      <!-- <el-table-column prop="" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="showStatDetail(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini" type="danger" @click="delWareHouse(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="table-footer">
      <div class=""></div>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {Request} from '../util.js';
export default {
  data(){
    return {
      queryForm : {
        productName: ''
      },
      tableData:[],
      currPage : 1,
      pageSize : 10,
      tableRows : 1,
      loading:false
    }
  },
  created(){
    this.queryList();
  },
  methods :{
    onSubmit(){
      let {productName} = this.queryForm;
      this.queryList({productName});
    },
    resetForm(){
      this.queryForm.productName = '';
      this.queryList();
    },
    queryList(param){
      this.loading = true;
      let { currPage, pageSize } = this;
      Request({
        url : '/platforms/platform/product/statis',
        data: Object.assign({},{
          page : currPage,
          size : pageSize
        },param),
        done:(res)=>{
          this.loading = false;
          this.tableData = res.data.result;
          this.tableRows = res.data.totalNum;
        },
        fail:(err)=>{
          this.loading = false;
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
      })
    },
    handleCurrentChange(val){
      this.currPage = val;
      this.queryList();
    },
    showStatDetail(index,row){
      this.$message({
        message: '正在完善中...',
        type: 'warning'
      });
    }
  }
}
</script>
<style>
.goods-stat-list{
  padding: 1em;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .goods-photo{
    width: 3em;
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
