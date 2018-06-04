<template>
  <div class="passenger-operate-box">
    <div class="table-tool-bar">
      <el-button type="primary" @click="handleEdit(-1,-1)">添加活动</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" stripe >
      <el-table-column prop="promotionName" label="活动名称" min-width="120" align="center"></el-table-column>
      <el-table-column prop="promotionDesc" label="描述" min-width="120"></el-table-column>
      <el-table-column prop="promotionType" label="类型" align="center" :formatter="(row, column, cellValue)=>['说明活动','参与活动'][cellValue]"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" :formatter="(row, column, cellValue)=>['禁用','可用'][cellValue]"></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180" align="center" :formatter="(row, column, cellValue)=>formatTime(cellValue)"></el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-size="pageSize" :total="tableRows">
      </el-pagination>
    </div>
    <!-- <el-dialog title="活动编辑" :visible.sync="dialogVisible">
      <el-form :model="editForm" ref="editForm" label-width="7em">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称：" prop="name" :rules="[{ required: true, message: '请输入活动名称'}]">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型：" >
              <el-select v-model="editForm.type" placeholder="请选择">
                <el-option label="说明活动" value="0"></el-option>
                <el-option label="参与活动" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="活动描述：" prop="desc" :rules="[{ required: true, message: '请输入活动描述'}]">
              <el-input v-model="editForm.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="活动图片：" prop="img" :rules="[{ required: true, message: '请上传图片'}]">
              <el-upload
                class="img-uploader"
                action="https://cartmall.net/systems/systemFile/upload"
                :show-file-list="false"
                :on-success="handleImgSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="editForm.img" :src="editForm.img" class="activity-pwd">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="html内容：" prop="html" :rules="[{ required: true, message: '请输入html内容'}]">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.html"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="H5图片：" prop="h5Img" :rules="[{ required: true, message: '请上传H5图片'}]">
              <el-upload
                class="img-uploader"
                action="https://cartmall.net/systems/systemFile/upload"
                :show-file-list="false"
                :on-success="handleH5ImgSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="editForm.h5Img" :src="editForm.h5Img" class="activity-pwd">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="html5内容：" prop="h5Html" :rules="[{ required: true, message: '请输入h5Html内容'}]">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.h5Html"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="editForm.status >= 0" :gutter="20">
          <el-col :span="24">
            <el-form-item label="活动状态：">
              <el-select v-model="editForm.status" placeholder="请选择">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="活动时间：" prop="datetimerange" :rules="[{ required: true, message: '请选择活动时间'}]">
              <el-date-picker
                v-model="editForm.datetimerange"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import { Request } from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
export default {
  data(){
    return {
      tableData: [],
      page : 1,
      currPage: 1,
      pageSize: 10,
      tableRows: 1,
      loading : false,
      dialogVisible : false,
      editForm : {
        html : '',
        h5Html : '',
        img : '',
        h5Img : '',
        name : '',
        desc : '',
        adminId : '',
        userId : '',
        type : '0',
        datetimerange:[],
        conditionIds : [],
        discountIds : []
      }
    }
  },
  created(){
    this.queryActivityList();
  },
  methods : {
    queryActivityList(){
      this.loading = true;
      Request({
        url : `/promotions/promotion/promotionList`,
        data : {
          page : this.currPage,
          pageSize : this.pageSize
        },
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
            this.$message.error('获取列表失败!');
          }
        }
      });
    },
    handleEdit(index,row){
      // this.$message.error('开发中暂时不无法使用!');
      if(index == -1 && row == -1){
        this.$router.push({
          name : 'passOperatDetail',
        });
      }else{
        this.$router.push({
          name : 'passOperatDetail',
          query:{
            activityId : row.id
          }
        });
      }
    },
    handleCurrentChange(val){
      this.currPage = val;
      this.queryActivityList();
    },
    formatTime(date){
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }
  }
}
</script>
<style>
.passenger-operate-box{
  & .do-title{
    font-weight: normal;
  }
  & .table-tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 0 0 1em 0;
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
  & .img-uploader .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 65px;
    & :hover{
      border-color : #f2c438;
    }
  }
  & .el-icon-plus{
    width: 120px;
  }
  & .el-icon-plus:before{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
