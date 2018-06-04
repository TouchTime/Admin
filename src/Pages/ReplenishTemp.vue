<template>
  <div class="replenish-list-box">
    <div class="table-tool-bar">
      <div class="query-box">
        <div class="select-label">切换类型：</div>
        <el-select v-model="queryType" placeholder="请选择" @change="queryTempList">
          <el-option label="一键补货" value="1"></el-option>
          <el-option label="申请补货" value="2"></el-option>
          <!-- <el-option label="自定义补货模板" value="3"></el-option> -->
        </el-select>
      </div>
      <el-button type="primary" @click="showDetails(-1,-1)">添加商品</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="cmProduct.id" label="商品ID" width="100" align="center"></el-table-column>
      <el-table-column prop="cmProduct.productImgUrl" label="商品图片" align="center">
        <template slot-scope="scope"><img class="goods-thumb" :src="scope.row.cmProduct.productImgUrl" alt=""></template>
      </el-table-column>
      <el-table-column prop="cmProduct.name" label="商品名称" width="200" align="center"></el-table-column>
      <el-table-column prop="cmProduct.unit" label="规格/单位" width="120" align="center"></el-table-column>
      <el-table-column prop="type" label="模版类型" align="center" :formatter="(row, column, cellValue)=>['一键补货','申请补货'][cellValue-1]"></el-table-column>
      <el-table-column prop="number" label="数量" width="120" align="center"></el-table-column>
      <el-table-column prop="" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showDetails(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="640px">
      <el-form label-width="6em">
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
            <el-form-item label="模版类型：">
              <el-select v-model="tempForm.type" placeholder="请选择">
                <el-option label="一键补货" value="1"></el-option>
                <el-option label="申请补货" value="2"></el-option>
                <!-- <el-option label="自定义补货模板" value="3"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量：">
              <el-input v-model.number="tempForm.number" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import { Request } from '../util.js';
export default {
  data() {
    return {
      queryType: '1',
      searchItem:'',
      tableData:[],
      dialogVisible:false,
      tempForm : {
        productId : '',
        type : '1',
        isSystem : 1,
        number : ''
      },
      loading: false
    }
  },
  created(){
    this.queryTempList();
  },
  methods : {
    queryTempList(){
      this.loading = true;
      Request({
        url : '/platforms/platform/shoptemplate',
        data : {type:this.queryType},
        done : (res)=>{
          this.tableData = res.data.result;
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
    showDetails(index,row){
      if(index == -1 && row == -1){
        this.tempForm = {
          productId : '',
          type : '1',
          isSystem : 1,
          number : ''
        }
        this.searchItem = ''
      }else{
        this.tempForm = {
          id : row.id,
          productId : row.productId,
          type : String(row.type),
          isSystem : 1,
          number : row.number
        };
        this.searchItem = row.cmProduct.name;
      }
      this.dialogVisible = true;
    },
    delRow(index,row){
      this.$confirm('您确定要执行改操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // $.ajax({
        //   url : `http://192.168.31.225:8087/platform/shoptemplate/${row.id}`,
        //   method : 'DELETE',
        //   dataType : 'JSON',
        //   data : this.tempForm
        // }).done((res)=>{
        //   this.$message({
        //     type: 'success',
        //     message: '保存成功!'
        //   });
        //   this.queryTempList();
        // }).fail((err)=>{
        //   this.$message({
        //     type: 'error',
        //     message: '删除失败!'
        //   });
        // });
        Request({
          url : `/platforms/platform/shoptemplate/${row.id}`,
          method : 'DELETE',
          data : this.tempForm,
          done : (res)=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryTempList();
          },
          fail : (err)=>{
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        });
      }).catch(() => {

      });
    },
    submitForm(){
      // $.ajax({
      //   url : `http://192.168.31.225:8087/platform/shoptemplate`,
      //   method : 'POST',
      //   dataType : 'JSON',
      //   data : this.tempForm
      // }).done((res)=>{
      //   this.$message({
      //     type: 'success',
      //     message: '添加成功!'
      //   });
      //   this.queryTempList();
      //   this.dialogVisible = false;
      // }).fail((err)=>{
      //   this.$message({
      //     type: 'error',
      //     message: err.responseJSON.error_mesg
      //   });
      // });
      Request({
        url : `/platforms/platform/shoptemplate`,
        method : 'POST',
        data : this.tempForm,
        done : (res)=>{
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.queryTempList();
          this.dialogVisible = false;
        },
        fail : (err)=>{
          this.$message({
            type: 'error',
            message: err.responseJSON.error_mesg
          });
        }
      });
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
          this.$message.error('获取商品列表失败!');
        }
      });
    },
    handleSelect(item){
      this.tempForm.productId = item.id;
      this.searchItem = item.name;
    },
  }
}
</script>
<style>
.replenish-list-box{
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .table-tool-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 22px 0;
    & .query-box {
      display: flex;
      align-items: center;
    }
    & .el-select {
      width: 12em;
    }
  }
  & .goods-thumb{
    width: 3em;
    margin: 0 auto;
  }
}
</style>
