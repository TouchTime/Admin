<template>
<div class="user-list-box">
  <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
    <el-form-item label="名称：">
      <el-input v-model="queryForm.name" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态：">
      <el-select v-model="queryForm.status" placeholder="状态">
        <el-option label="可用" value=1>可用</el-option>
        <el-option label="禁用" value=0>禁用</el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="handleAddShow(),dialogFormVisible=true">添加</el-button>
  <el-table v-loading="loading"  ref="multipleTable" :data="tableData" style="width: 100%" stripe>
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column prop="productImgUrl" label="图片" >
      <template slot-scope="scope"><img class="user-avatar" :src="scope.row.productImgUrl" alt=""></template>
    </el-table-column>
    <el-table-column prop="name" label="名称" width="150"></el-table-column>
    <el-table-column prop="cateId" label="类别" align="center" :formatter="formatCateId"></el-table-column>
    <el-table-column prop="unit" label="规格" align="center" ></el-table-column>
    <el-table-column prop="displayPrice" label="展示价" align="center"></el-table-column>
    <el-table-column prop="actualPrice" label="实际价" align="center"></el-table-column>
    <el-table-column prop="shopActualPrice" label="实际进货价" width="100" align="center"></el-table-column>
    <el-table-column prop="limitNumber" label="限购数量" align="center"></el-table-column>
    <el-table-column prop="status" label="状态" align="center" :formatter="(row, column, cellValue)=>cellValue == 1 ? '可用':'禁用'"></el-table-column>
    <el-table-column prop="" label="操作" align="center" fixed="right">
      <template slot-scope="scope">
	      <el-button size="mini" type="primary" @click="handleShow(scope.$index, scope.row),dialogFormVisible=true">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="商品详情" :visible.sync="dialogFormVisible" width="920px">
    <el-form :model="detailForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="detailForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-select v-model="detailForm.cateId" placeholder="请选择店铺类型">
              <el-option :label="cate.cateName" :value="cate.id" v-for="cate in cateData" :key="cate.id">{{cate.cateName}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格" :label-width="formLabelWidth">
            <el-input v-model="detailForm.unit" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="限购数量" :label-width="formLabelWidth">
            <el-input v-model="detailForm.limitNumber" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth">
            <!-- <el-input v-model="detailForm.productImgUrl" auto-complete="off"></el-input> -->
            <el-upload
              class="avatar-uploader"
              action="https://cartmall.net/systems/systemFile/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="detailForm.productImgUrl" :src="detailForm.productImgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="detailForm.productContent" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" :label-width="formLabelWidth1">
            <el-select v-model="detailForm.status" placeholder="请选择状态">
              <el-option label="可用" value=1>可用</el-option>
              <el-option label="禁用" value=0>禁用</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示零售价" :label-width="formLabelWidth1">
            <el-input v-model="detailForm.displayPrice" auto-complete="off" placeholder="0为不显示"></el-input>
          </el-form-item>
          <el-form-item label="实际零售价" :label-width="formLabelWidth1">
            <el-input v-model="detailForm.actualPrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="实际进货价" :label-width="formLabelWidth1">
            <el-input v-model="detailForm.shopActualPrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth1">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="detailForm.description" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleClose(),dialogFormVisible=false">确 定</el-button>
    </div>
  </el-dialog>

  <div class="table-footer">
    <div class="batch-btn">
      <!-- <el-button @click="toggleSelection()">全部取消</el-button> -->
    </div>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
    </el-pagination>
  </div>
</div>

</template>
<script>
import {Request,OrgRequest} from '../util.js';
export default {
  data() {
    return {
      queryForm: {
        name: '',
        status: ''
      },
      detailForm:{
        id:'',
        name:'',
        cateId:'',
        productContent:'',
        unit:'',
        companyId:'0',
        profit:'0',
        shopProfit:'0',
        limitNumber:'',
        productImgUrl:'',
        description:'',
        status:'',
        price:0,
        sellPrice:0,
        displayPrice:'',
        actualPrice:'',
        shopPrice:0,
        shopDisplayPrice:0,
        shopActualPrice:''
      },
      tableData: [],
      cateData:[],
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      dialogFormVisible:false,
      multipleSelection: [],
      formLabelWidth: '80px',
      formLabelWidth1: '120px',
      loading : false
    };
  },

  created (){
  	this.shopListData();
    this.getCateDataList();
  },

  methods: {
  	shopListData(param){
      let {
        currPage,
        pageSize
      } = this;
      this.loading = true;
      OrgRequest({
        url: `/platform/product`,
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
          this.loading = false;
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }
          } else {
            alert('请求失败，请重试！');
          }
        }
      });
  	},

    handleShow(index,row) {
      console.log(row);
      Object.keys(this.detailForm).forEach((keyName, index) => {
        if(keyName == 'status'){
          this.detailForm[keyName] = row[keyName].toString() || '1';
        }else{
          this.detailForm[keyName] = row[keyName] || '';
        }
      });
    },
    handleAddShow(){
      Object.keys(this.detailForm).forEach((keyName, index) => {
        this.detailForm[keyName] = '';
      });
    },
    handleClose() {
      this.cateData.forEach((item,index)=>{
        if(this.detailForm.cateId == item.id){
          this.detailForm.cateName = item.cateName;
        }
      });
      OrgRequest({
        url: `/platform/product`,
        method:'POST',
        data: this.detailForm,
        done: (res) => {
          this.shopListData(this.queryForm);
          Object.keys(this.detailForm).forEach((keyName, index) => {
            this.detailForm[keyName] = '';
          });
        },
        fail: (err) => {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }
          } else {
            alert('请求失败，请重试！');
          }
        }
      });
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    resetForm() {
      this.queryForm = {
        realname: '',
        idCard: ''
      };
      this.shopListData();
    },
    onSubmit() {
      this.shopListData(this.queryForm);
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.onSubmit();
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD hh:mm")
    },
    getCateDataList(){
      OrgRequest({
        url: `/platform/product/cate`,
        data: {
          status : 1
        },
        done: (res) => {
          this.cateData = res.data.result;
        },
        fail: (err) => {
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
    formatCateId(row, column, cellValue){
      let cateName = ''
      this.cateData.forEach((cate, index) => {
        if(cellValue == cate.id){
          cateName = cate.cateName;
        }
      });
      return cateName
    },
    //图片操作
    handleAvatarSuccess(res, file) {
      this.detailForm.productImgUrl = res.urlList[0].split('?')[0];
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      return isLt5M;
    }
  }
};
</script>
<style>
.user-list-box {
  padding: 1em;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  }
  & .user-avatar {
    width: 2.4em;
  }
  & .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em 0;
  }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 50px;
    line-height: 40px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
