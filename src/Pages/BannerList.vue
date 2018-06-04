<template>
<div class="banner-list-box">
  <div class="table-tool-bar">
    <div class="query-box">
      <div class="select-label">切换分类：</div>
      <el-select v-model="queryType" placeholder="请选择" @change="queryBannerList">
        <el-option label="乘客端" value="4"></el-option>
        <el-option label="司机端" value="5"></el-option>
      </el-select>
    </div>
    <el-button type="primary" @click="showDetails(-1,-1)">添加图片</el-button>
  </div>
  <el-table v-loading="loading" :data="tableData">
    <el-table-column prop="filePath" width="200" label="预览" align="center">
      <template slot-scope="scope"><img class="banner-thumb" :src="scope.row.filePath" alt=""></template>
    </el-table-column>
    <el-table-column prop="fileName" label="名称" align="center"></el-table-column>
    <el-table-column prop="type" label="类型" align="center" :formatter="bannerType"></el-table-column>
    <el-table-column prop="seq" label="顺序" align="center"></el-table-column>
    <el-table-column prop="fileUrl" label="链接" min-width="200"></el-table-column>
    <el-table-column prop="" label="操作" width="160" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="showDetails(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="轮播图编辑" :visible.sync="dialogVisible">
    <el-form label-width="4em">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="ID：">
            <el-input v-model="bannerForm.id" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型：">
            <el-select v-model="bannerForm.type" placeholder="请选择">
              <el-option label="乘客端" value="4"></el-option>
              <el-option label="司机端" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="链接：">
            <el-input v-model="bannerForm.fileUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序：">
            <el-input v-model.number="bannerForm.seq"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称：">
            <el-input v-model="bannerForm.fileName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="图片：">
            <el-upload class="upload-banner" :show-file-list="false" :on-success="handleUploadSuccess" :action="uploadurl">
              <img v-if="bannerForm.filePath" :src="bannerForm.filePath" class="banner-pvw">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitBannerForm">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>
<script>
import {
  Request
} from '../util.js';
export default {
  data() {
    return {
      queryType: '4',
      bannerForm: {
        id: '',
        type: '4',
        fileName: '',
        filePath: '',
        fileUrl: '',
        seq: ''
      },
      uploadurl: `${ApiPrefix}/systems/systemFile/upload`,
      tableData: [],
      dialogVisible: false,
      loading: false
    }
  },
  created() {
    this.queryBannerList();
  },
  methods: {
    showDetails(index, row) {
      if (index == -1 && row == -1) {
        this.bannerForm = {
          id: '',
          type: '4',
          fileName: '',
          filePath: '',
          fileUrl: '',
          seq: ''
        }
      } else {
        this.bannerForm = {
          id: row.id || '',
          type: (row.type || '') + '',
          fileName: row.fileName || '',
          filePath: row.filePath || '',
          fileUrl: row.fileUrl || '',
          seq: row.seq || ''
        }
      }
      this.dialogVisible = true;
    },
    delRow(index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request({
          url: `/systems/systemFile/saveFile`,
          method: 'POST',
          data: Object.assign({}, row, {type: -1}),
          done: (res) => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.queryBannerList();
            this.dialogVisible = false;
          },
          fail: (err) => {
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
    queryBannerList() {
      this.loading = true;
      Request({
        url: `/systems/systemFile/findFile`,
        data: {type:this.queryType},
        done: (res) => {
          this.tableData = res.data.result;
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
            this.$message.error('获取列表失败！');
          }
        }
      });
    },
    handleUploadSuccess(res, file) {
      this.bannerForm.filePath = res.urlList[0].split('?')[0];
    },
    bannerType(row, column, cellValue) {
      if (cellValue >= 1) {
        return ['审核图片', '商品描述', '优惠活动', '乘客端', '司机端'][cellValue - 1];
      } else {
        return cellValue
      }
    },
    submitBannerForm() {
      let sendData = Object.assign({}, this.bannerForm);
      Object.keys(sendData).forEach((key, index) => {
        if (sendData[key] == '') {
          delete sendData[key]
        }
      });
      console.log(sendData)
      // $.ajax({
      //   url: `http://192.168.31.225:8083/systemFile/saveFile`,
      //   method: 'POST',
      //   dataType: 'JSON',
      //   data: sendData
      // }).done((res) => {
      //   this.$message({
      //     message: '添加成功！',
      //     type: 'success'
      //   });
      //   this.queryBannerList();
      //   this.dialogVisible = false;
      // }).fail((err) => {
      //
      // });
      Request({
        url : `/systems/systemFile/saveFile`,
        method : 'POST',
        data : sendData,
        done : (res)=>{
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.queryBannerList();
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
            this.$message.error('添加失败！');
          }
        }
      });
    }
  }
}
</script>

<style>
.banner-list-box {
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
  & .upload-banner .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 9em;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  & .upload-banner .el-upload:hover {
    border-color: #f2c438;
    & .el-icon-plus {
      color: #f2c438;
    }
  }
  & .upload-banner .el-icon-plus {
    font-size: 2.1em;
    color: #999;
  }
  & .upload-banner .banner-pvw {
    position: relative;
    width: 100%;
    height: 100%;
  }
  & .banner-thumb {
    width: 100%;
    max-width: 13em;

  }
}
</style>
