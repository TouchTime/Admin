<template>
<div class="warehouse-goods">
  <div class="table-tool-bar">
    <el-button type="primary" @click="editGoods(-1,-1)">添加仓库商品</el-button>
  </div>
  <el-table v-loading="loading" :data="tableData">
    <el-table-column prop="productId" label="商品ID" align="center"></el-table-column>
    <el-table-column prop="productImgUser" label="商品图片">
      <template slot-scope="scope"><img class="goods-photo" :src="scope.row.productImgUser" alt=""></template>
    </el-table-column>
    <el-table-column prop="productName" label="商品名称" width="160"></el-table-column>
    <el-table-column prop="storePrice" label="存储价格" align="center"></el-table-column>
    <el-table-column prop="numbers" label="数量" align="center"></el-table-column>
    <el-table-column prop="updateTime" label="更新时间" width="140" :formatter="(row, column, cellValue)=>cellValue ? formatTime(cellValue) : '-'" align="center"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="140" :formatter="(row, column, cellValue)=>cellValue ? formatTime(cellValue) : '-'" align="center"></el-table-column>
    <el-table-column prop="" label="操作" width="260" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="editGoods(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          @click="addGoodsCount(scope.$index, scope.row)">添加数量</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="deleteGoods(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
  <el-dialog title="编辑仓库商品" :visible.sync="dialogFormVisible">
    <el-form :model="goodsForm" label-width="6em">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="商品名称：">
            <el-autocomplete
              style="width:100%"
              v-model="searchItem"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            >
            <template slot-scope="props">
              <div class="name">{{ props.item.name }}</div>
            </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="存储价格：">
            <el-input v-model="goodsForm.storePrice" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量：">
            <el-input v-model="goodsForm.numbers" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="goodsFormSubmit">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="编辑数量" :visible.sync="dialogCountVisible" width="520px">
    <el-form :model="goodsCountForm" label-width="6em">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="名称：">
            <el-input v-model="goodsCountForm.name" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="数量：">
            <el-input v-model="goodsCountForm.numbers" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogCountVisible = false">取 消</el-button>
      <el-button type="primary" @click="goodsCountSubmit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  Request
} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data() {
    return {
      tableData: [],
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      loading: true,
      searchItem:'',
      goodsForm:{
        id:'',
        storeId:'',
        productId:'',
        productName:'',
        maxPrice:'',
        minPrice:'',
        averageePrice:'',
        storePrice:'',
        numbers:''
      },
      dialogFormVisible : false,
      goodsCountForm:{
        name : '',
        numbers : 0,
        productId  : ''
      },
      dialogCountVisible : false
    }
  },
  created() {
    this.goodsForm.storeId = this.$route.query.storeId;
    this.queryGoodsList();
  },
  methods: {
    queryGoodsList(param) {
      let {currPage,pageSize,} = this;
      let storeId = this.goodsForm.storeId;
      this.loading = true;
      Request({
        url: `/platforms/platform/store/product`,
        data: Object.assign({}, {
          page: currPage,
          size: pageSize,
          storeId:storeId
        }, param),
        done: (res) => {
          if(res.data){
            this.tableData = res.data.result;
            this.tableRows = res.data.totalNum;
          }
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
            this.$message.error('列表获取失败！');
          }
        }
      });
    },
    deleteGoods(index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url : `/platforms/platform/store/product/${row.id}`,
          method : 'DELETE',
          data :{},
          done : (res)=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryGoodsList();
          },
          fail : (err)=>{
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('删除失败，请重试！');
            }
          }
        });
      }).catch(() => {

      });
    },
    editGoods(index, row){
      let oldRow = Object.assign({},this.goodsForm);
      this.dialogFormVisible = true;
      Object.keys(oldRow).forEach((key,idx)=>{
        if(index== -1 && row == -1){
          (key != 'storeId') && (oldRow[key] ='');
        }else{
          (key == 'averageePrice') ? (oldRow[key] = row['averagePrice'] || '') : (oldRow[key] = row[key] || '');
        }
      });
      this.searchItem = (index== -1 && row == -1) ? '' : row.productName;
      this.goodsForm = oldRow;
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.queryGoodsList();
    },
    querySearchAsync(queryString, cb){
      Request({
        url : `/platforms/platform/product`,
        data:{
          page:1,
          size:100,
          name : queryString || ''
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
            this.$message.error('获取商品列表失败!');
          }
        }
      });
    },
    handleSelect(item){
      this.goodsForm.productId = item.id;
      this.goodsForm.productName = item.name;
      this.searchItem = item.name;
    },
    goodsFormSubmit(){
      let sendData = Object.assign({},this.goodsForm);
      Request({
        url : `/platforms/platform/store/product`,
        method : 'POST',
        data :this.goodsForm,
        done : (res)=>{
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.queryGoodsList();
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
    addGoodsCount(index,row){
      this.dialogCountVisible = true;
      this.goodsCountForm = {
        name : row.productName,
        productId : row.productId
      }
    },
    goodsCountSubmit(){
      let storeId = this.goodsForm.storeId;
      Request({
        url : `/platforms/platform/store/product/${storeId}/${this.goodsCountForm.productId}`,
        method : 'PUT',
        data : {number : this.goodsCountForm.numbers},
        done : (res)=>{
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.dialogCountVisible = false;
          this.queryGoodsList();
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
    formatTime(date) {
      return moment(date).format("YYYY/MM/DD hh:mm")
    }
  }
}
</script>
<style>
.warehouse-goods {
  padding:1em;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .table-tool-bar {
    margin: 0 0 0.8em 0;
  }
  & .goods-photo {
    width: 3.6em;
    height: 3.6em;
  }
  & .table-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1em 0;
  }
}
</style>
