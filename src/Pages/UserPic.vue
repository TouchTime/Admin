<template>
<div class="banner-list-box">
  <div class="table-tool-bar">
    <div class="query-box">
    </div>
    <el-button type="primary" @click="showDetails(-1,-1)">添加广告</el-button>
  </div>
  <el-table v-loading="loading" :data="tableData">
    <el-table-column prop="fileName" label="名称"></el-table-column>
    <el-table-column prop="filePath" width="200" label="图片" align="center">
      <template slot-scope="scope"><img class="banner-thumb" :src="scope.row.filePath" alt=""></template>
    </el-table-column>
    <el-table-column prop="fileUrl" label="链接" min-width="200" align="center"></el-table-column>
    <el-table-column prop="" label="操作" width="160" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="showDetails(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="轮播图编辑" :visible.sync="dialogVisible">
    <el-form label-width="5em"  ref="bannerForm" :model="bannerForm" :rules="dataFormRules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称：" prop="fileName">
            <el-input v-model="bannerForm.fileName" placeholder="请输入弹窗名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="图片：" prop="filePath">
            <el-upload class="upload-banner" :show-file-list="false" :on-success="handleUploadSuccess" :action="uploadurl"  :before-upload="beforeAvatarUpload">
              <img v-if="bannerForm.filePath" :src="bannerForm.filePath" class="banner-pvw">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="链接：" >
            <el-input v-model="bannerForm.fileUrl"></el-input>
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
      queryType: '255',  //广告弹窗
      bannerForm: {
        type: '255',
        fileName: '',
        filePath: '',
        fileUrl: '',
      },
      uploadurl: `${ApiPrefix}/systems/systemFile/upload`,
      tableData: [],
      dialogVisible: false,
      loading: false,
      dataFormRules:{
        fileName: [{ required: true, message: '名称不能为空', trigger: 'blur'},{ min:0, max:20, message: '长度在 0 到 20个字符', trigger: 'blur' }],
        filePath:[{ required: true, message: '上传图片不能为空'},{ min:0, max:4098, message: '长度在 0 到 4098个字符', trigger: 'blur' }]

      }
    }
  },
  created() {
    this.queryBannerList();
  },
  methods: {
    showDetails(index, row) {
      let just = (index == -1 && row == -1);
    if(this.tableData.length <1 ){
      if (just) {
        this.bannerForm = {
          type: '255',
          fileName: '',
          filePath: '',
          fileUrl: '',
        }
      } else {
        this.bannerForm = {
          type: (row.type || '') + '',
          fileName: row.fileName || '',
          filePath: row.filePath || '',
          fileUrl: row.fileUrl || '',
        }
      }
      this.dialogVisible = true;
    }else{
        if(!just) {
       this.bannerForm = {
          type: (row.type || '') + '',
          fileName: row.fileName || '',
          filePath: row.filePath || '',
          fileUrl: row.fileUrl || '',
        }
         this.dialogVisible = true;
      }else{
      this.$message.error('最多可添加一个广告');
       this.dialogVisible = false;
      }

    } 
      
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
    beforeAvatarUpload(file){
       const isJPG = file.type === 'image/jpg';
       const isPNG = file.type === 'image/png';
       const isLt500kb = file.size / 1024 < 500;

        if (isJPG || isJPG) {
          this.$message.error('图片格式只能是JPG、PNG');
        }
        if (!isLt500kb) {
          this.$message.error('上传图片大小不能超过 500kb!');
        }
        return isJPG || isPNG && isLt500kb;
      
    },
    handleUploadSuccess(res, file) {
      this.bannerForm.filePath = res.urlList[0].split('?')[0];
    },
    submitBannerForm() {
      let sendData = Object.assign({}, this.bannerForm);
       Object.keys(sendData).forEach((key, index) => {
        if (sendData[key] == '') {
          delete sendData[key]
        }
      });
       this.$refs['bannerForm'].validate((valid) => {
         console.log('valid',sendData)
          if (valid) {
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
          } else {
            this.$message.error('请填写相关信息!');
          }
        });
      
  
     
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
