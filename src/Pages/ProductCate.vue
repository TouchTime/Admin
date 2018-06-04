<template>
<div class="proCate-list-box">
  <div class="table-tool-bar">
    <el-button type="primary" @click="handleAddShow()">添加</el-button>
  </div>
  <el-table v-loading="loading" ref="multipleTable" :data="tableData" stripe >
    <el-table-column prop="cateName" label="名称" width="150"></el-table-column>
    <el-table-column prop="cateLevel" label="等级" align="center" ></el-table-column>
    <el-table-column prop="seq" label="排序" align="center" ></el-table-column>
    <el-table-column prop="status" label="状态" align="center" :formatter="(row, column, cellValue)=>formatStatus(cellValue)"></el-table-column>
    <el-table-column prop="" label="操作" align="center" fixed="right">
      <template slot-scope="scope">
	      <el-button size="mini" @click="handleShow(scope.$index, scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
    <div class="batch-btn"></div>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
  <el-dialog title="分类详情" :visible.sync="dialogFormVisible" width="30%">
    <el-form :model="detailForm" label-width="5em">
      <el-form-item label="名称：">
        <el-input v-model="detailForm.cateName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="等级：">
        <el-input v-model="detailForm.cateLevel" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="detailForm.seq" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="detailForm.status" placeholder="请选择">
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleClose(),dialogFormVisible=false">确 定</el-button>
    </div>
  </el-dialog>
</div>

</template>
<script>
import {Request,OrgRequest} from '../util.js';
export default {
  data() {
    return {
      queryForm: {
        realname: '',
        idCard: ''
      },
      detailForm:{
        id:'',
        cateName:'',
        description:'',
        cateIcon:'',
        cateLevel:'',
        parentId:'',
        status: 1,
        seq : ''
      },
      tableData: [],
      loading:false,
      cateDataList:[],
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      dialogFormVisible:false,
      multipleSelection: []
    };
  },

  created (){
  	this.shopListData();
  },

  methods: {
  	shopListData(param){
      let { currPage, pageSize } = this;
      this.loading = true;
      Request({
        url: `/platforms/platform/product/cate`,
        data: Object.assign({}, {
          page: currPage,
          size: pageSize
        }, param),
        done: (res) => {
          this.tableData = res.data.result;
          this.tableRows = res.data.totalNum;
          this.loading = false;
        },
        fail: (err) => {
          console.log(err);
        }
      });
  	},
    handleShow(index,row) {
      this.detailForm.id = row.id;
      this.detailForm.cateName = row.cateName;
      this.detailForm.cateLevel = row.cateLevel;
      this.detailForm.status = row.status;
      this.detailForm.parentId = row.parentId;
      this.detailForm.cateIcon = row.cateIcon;
      this.detailForm.description = row.description;
      this.detailForm.seq = row.seq;
      this.dialogFormVisible=true;
    },
    handleAddShow(){
      Object.keys(this.detailForm).forEach((keyName, index) => {
        if(keyName == 'status'){
          this.detailForm[keyName] = 1;
        }else{
          this.detailForm[keyName] = '';
        }
      });
      this.dialogFormVisible=true;
    },
    handleClose() {
      OrgRequest({
        url: `/platform/product/cate`,
        method:'POST',
        data: this.detailForm,
        done: (res) => {
          this.shopListData();
          Object.keys(this.detailForm).forEach((keyName, index) => {
            this.detailForm[keyName] = '';
          });
        },
        fail: (err) => {
          console.log(err);
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
      this.shopListData();
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD hh:mm")
    },
    formatStatus(cellValue){
      return ['禁用','可用'][cellValue];
    }
  }
};
</script>
<style>
.proCate-list-box{
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
