<template>
  <div class="passenger-operate-detail">
    <div class="po-block">
      <h3>编辑活动</h3>
      <el-form class="editForm" :model="editForm" ref="editForm" label-width="7em">
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
        <el-row v-if="editForm.status != null" :gutter="20">
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
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item>
              <el-button @click="goBack">取 消</el-button>
              <el-button type="primary" @click="submitEditForm">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="po-block">
      <h3>折扣对象</h3>
      <el-form class="discountForm" :model="discountForm" ref="discountForm" label-width="7em">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="折扣名称：" prop="name" :rules="[{ required: true, message: '请输入活动名称'}]">
              <el-input v-model="discountForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠类型：" >
              <el-select v-model="discountForm.type" placeholder="请选择">
                <el-option label="平台优惠活动" value="0"></el-option>
                <el-option label="店铺优惠活动" value="1"></el-option>
                <el-option label="类目优惠" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否可共用：" >
              <el-select v-model="discountForm.isShare" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="折扣描述：" prop="desc" :rules="[{ required: true, message: '请输入折扣描述'}]">
              <el-input v-model="discountForm.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="htmlCode：" prop="desc" :rules="[{ required: true, message: '请输入htmlCode'}]">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="discountForm.htmlCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="折扣时间：" prop="datetimerange" :rules="[{ required: true, message: '请选择活动时间'}]">
              <el-date-picker
                v-model="discountForm.datetimerange"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="被动接受：">
              <el-select v-model="discountForm.forceAccept" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="是否显示：">
              <el-select v-model="discountForm.isShow" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="强制使用：">
              <el-select v-model="discountForm.forceUse" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="discountForm.status != null" :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动状态：">
              <el-select v-model="discountForm.status" placeholder="请选择">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item>
              <el-button @click="goBack">取 消</el-button>
              <el-button type="primary" @click="submitDiscountForm">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="po-block">
      <h3>
        <span>折扣因子</span>
        <el-button type="primary" size="mini" @click="addFactor(-1,-1)">添加</el-button>
      </h3>
      <el-table :data="factorListData" style="width:100%">
        <el-table-column prop="discountId" label="折扣ID" width="180" align="center"></el-table-column>
        <el-table-column prop="discountSum" label="折扣金额" width="180" align="center"></el-table-column>
        <el-table-column prop="factorType" label="类型" width="180" align="center" :formatter="(row, column, cellValue)=> ['加','减','乘','除'][cellValue] "></el-table-column>
        <el-table-column prop="factorValue" label="因子值" width="180" align="center"></el-table-column>
        <el-table-column prop="" label="操作" align="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addFactor(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="po-block">
      <h3>
        <span>折扣条件</span>
        <el-button type="primary" size="mini" @click="addCondition(-1,-1)">添加</el-button>
      </h3>
      <el-table :data="conditionListData" style="width:100%">
        <el-table-column prop="discountId" label="折扣ID" width="180" align="center"></el-table-column>
        <el-table-column prop="type" label="优惠类型" width="180" align="center" :formatter="(row, column, cellValue)=> ['平台优惠活动','店铺优惠活动'][cellValue] "></el-table-column>
        <el-table-column prop="shopId" label="商家ID" width="180" align="center"></el-table-column>
        <el-table-column prop="ownerId" label="店主ID" width="180" align="center"></el-table-column>
        <el-table-column prop="cartId" label="类目ID" width="180" align="center"></el-table-column>
        <el-table-column prop="shopCartId" label="自定义类目ID" width="180" align="center"></el-table-column>
        <el-table-column prop="downLimitSum" label="金额下限" width="180" align="center"></el-table-column>
        <el-table-column prop="upLimitSum" label="金额上限" width="180" align="center"></el-table-column>
        <el-table-column prop="productId" label="商品ID" width="180" align="center"></el-table-column>
        <el-table-column prop="userMark" label="用户评分" width="180" align="center"></el-table-column>
        <el-table-column prop="shopMark" label="商家得分" width="180" align="center"></el-table-column>
        <el-table-column prop="isNew" label="是否新用户" width="180" align="center" :formatter="(row, column, cellValue)=> ['否','是'][cellValue] "></el-table-column>
        <el-table-column prop="isNewShop" label="是否新店" width="180" align="center" :formatter="(row, column, cellValue)=> ['否','是'][cellValue] "></el-table-column>
        <el-table-column prop="isGroup" label="是否组合" width="180" align="center" :formatter="(row, column, cellValue)=> ['否','是'][cellValue] "></el-table-column>
        <el-table-column prop="" label="操作" align="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addCondition(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="po-block">
      <h3>活动约束</h3>
      <el-form class="activityProtoForm" :model="activityProtoForm" ref="activityProtoForm" label-width="7em">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="折扣对象ID：" >
              <el-input v-model="activityProtoForm.discountId" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动编码：">
              <el-input v-model="activityProtoForm.promotionCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商铺ID：">
              <el-input v-model="activityProtoForm.shopId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="店主ID：">
              <el-input v-model="activityProtoForm.ownerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类目ID：">
              <el-input v-model="activityProtoForm.cartId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商铺类目ID：">
              <el-input v-model="activityProtoForm.shopCartId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品ID：">
              <el-input v-model="activityProtoForm.productId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动类型：">
              <el-select v-model="activityProtoForm.type" placeholder="请选择">
                <el-option label="通知类" value="0"></el-option>
                <el-option label="参加类" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户得分：">
              <el-input v-model="activityProtoForm.userMark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="店主得分：">
              <el-input v-model="activityProtoForm.shopMark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否新用户：" >
              <el-select v-model="activityProtoForm.isNew" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否新店铺：" >
              <el-select v-model="activityProtoForm.isNewShop" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="activityProtoForm.status !=null" :gutter="20">
          <el-col :span="8">
            <el-form-item label="状态：">
              <el-select v-model="activityProtoForm.status" placeholder="请选择">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="可用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item>
              <el-button @click="goBack">取 消</el-button>
              <el-button type="primary" @click="submitActivityProtoForm">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog  title="编辑折扣因子" :visible.sync="dialogfFactorVisible">
      <el-form class="factorForm" :model="factorForm" ref="factorForm" label-width="7em">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="折扣ID：">
              <el-input v-model="factorForm.discountId" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折扣金额：" prop="discountSum" :rules="[{ required: true, message: '请输入折扣金额'}]">
              <el-input v-model="factorForm.discountSum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型：" prop="factorType" :rules="[{ required: true, message: '请选择'}]" >
              <el-select v-model="factorForm.factorType" placeholder="请选择">
                <el-option label="加" value="0"></el-option>
                <el-option label="减" value="1"></el-option>
                <el-option label="乘" value="2"></el-option>
                <el-option label="除" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子值：" prop="factorValue" :rules="[{ required: true, message: '请输入因子值'}]" >
              <el-input v-model="factorForm.factorValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogfFactorVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFactorForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog  title="编辑折扣条件" :visible.sync="dialogConditionVisible">
      <el-form class="conditionForm" :model="conditionForm" ref="conditionForm" label-width="8em">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="折扣ID：">
              <el-input v-model="conditionForm.discountId" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠类型：" prop="type" :rules="[{ required: true, message: '请选择'}]">
              <el-select v-model="conditionForm.type" placeholder="请选择">
                <el-option label="平台优惠活动" value="0"></el-option>
                <el-option label="店铺优惠活动" value="1"></el-option>
                <el-option label="类目优惠" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商家ID：" >
              <el-input v-model="conditionForm.shopId" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店主ID：">
              <el-input v-model="conditionForm.ownerId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类目ID：">
              <el-select v-model="conditionForm.cartId" placeholder="请选择">
                <el-option
                  v-for="item in productTypeList"
                  :key="item.id"
                  :label="item.cateName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义类目ID：" >
              <el-input v-model="conditionForm.shopCartId" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="金额下限：">
              <el-input v-model="conditionForm.downLimitSum "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额上限：">
              <el-input v-model="conditionForm.upLimitSum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品ID：">
              <el-input v-model="conditionForm.productId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户评分：">
              <el-input v-model="conditionForm.userMark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商家得分：" >
              <el-input v-model="conditionForm.shopMark" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否新用户：" >
              <el-select v-model="conditionForm.isNew" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否新店：" >
              <el-select v-model="conditionForm.isNewShop" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否组合：" >
              <el-select v-model="conditionForm.isGroup" placeholder="请选择">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConditionVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitConditionFormForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Request } from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
  export default {
    data(){
      return {
        activityId : '',
        discountId : '',
        editForm : {
          id:'',
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
        },
        activityProtoForm:{
          discountId : '',
          promotionCode : '',
          shopId : '',
          ownerId : '',
          cartId : '',
          shopCartId : '',
          productId : '',
          type : '',
          userMark : '',
          shopMark : '',
          isNew : '',
          isNewShop : ''
        },
        discountForm:{
          name: '',
          desc : '',
          htmlCode : '',
          datetimerange : '',
          isShare : '',
          type : '',
          forceAccept : '',
          isShow : '',
          forceUse : ''
        },
        factorListData:[],
        dialogfFactorVisible : false,
        factorForm : {
          discountId : '',
          discountSum : '',
          factorType : '',
          factorValue : ''
        },
        conditionListData:[],
        dialogConditionVisible : false,
        conditionForm : {
          discountId : '',
          type : '',
          shopId : '',
          ownerId : '',
          cartId : '',
          shopCartId : '',
          productId : '',
          userMark : '',
          shopMark : '',
          isNew : '',
          isNewShop : '',
          isGroup : '',
          downLimitSum :'',
          upLimitSum:''
        },
        productTypeList:[]
      }
    },
    created(){
      if(this.$route.query.activityId){
        this.activityId = this.$route.query.activityId;
        this.promotionId = this.$route.query.activityId;
        this.queryActivityDetail();
      }
      this.getProductType();
    },
    methods : {
      getProductType(){
        Request({
          url : `/platforms/platform/product/cate?page=1&size=10000`,
          done : (res)=>{
            this.productTypeList = res.data.result.filter((item,index)=>item.status);
          },
          fail : (err)=>{
            this.$message.error('获取列表失败!');
          }
        });
      },
      queryActivityDetail(){
        Request({
          url : `/promotions/promotion/${this.activityId}`,
          data : {},
          done : (res)=>{
            const activityInfo = Object.assign({},res.data);
            const discountInfo = Object.assign({},res.data.discountList[0]);
            const conditionInfo = Object.assign({},res.data.conditionList[0]);
            this.editForm  = {
              id : activityInfo.id  || '',
              html : activityInfo.promotionHtml || '-',
              h5Html : activityInfo.promotionHtmlH5 || '-',
              img : activityInfo.promotionImg,
              h5Img : activityInfo.promotionImgH5,
              name : activityInfo.promotionName,
              desc : activityInfo.promotionDesc,
              adminId : activityInfo.adminId,
              userId : activityInfo.userId,
              type : activityInfo.promotionType+'',
              datetimerange:[activityInfo.startTime,activityInfo.endTime],
              status : activityInfo.status != null ? activityInfo.status+'' : '',
              conditionIds : [],
              discountIds : []
            };
            if(discountInfo.id){
              this.discountForm = {
                id : discountInfo.id || '',
                name: discountInfo.discountName || '',
                desc : discountInfo.discountDesc || '',
                htmlCode : discountInfo.discountHtml || '-',
                datetimerange : [discountInfo.startTime || '' , discountInfo.endTime || ''],
                isShare :  discountInfo.isShare !=null ? discountInfo.isShare+'' : '',
                type :  discountInfo.type !=null ? discountInfo.type+'' : '',
                forceAccept : discountInfo.forceAccept !=null ? discountInfo.forceAccept+'' : '',
                isShow : discountInfo.isShow !=null ? discountInfo.isShow+'' : '',
                forceUse : discountInfo.forceUse != null ? discountInfo.forceUse+'' : '',
                status : discountInfo.status != null ? discountInfo.status+'' : ''
              };
              this.conditionForm.discountId = this.discountForm.id || '';
              this.factorForm.discountId = this.discountForm.id || '';
              this.discountId = this.discountForm.id;
            }
            this.factorListData = discountInfo.factorList || [];
            this.conditionListData = discountInfo.conditionList || [];

            if(conditionInfo.id){
              console.log(conditionInfo);
              this.activityProtoForm = {
                id : conditionInfo.id,
                discountId : conditionInfo.discountId,
                promotionCode : conditionInfo.promotionCode,
                shopId : conditionInfo.shopId || '',
                ownerId : conditionInfo.ownerId || '',
                cartId : conditionInfo.cartId || '',
                shopCartId : conditionInfo.shopCartId || '',
                productId : conditionInfo.productId || '',
                type : conditionInfo.type !=null ? conditionInfo.type+'' : '',
                downLimitSum :conditionInfo.downLimitSum || 0,
                upLimitSum:conditionInfo.upLimitSum || 0,
                userMark : conditionInfo.userMark,
                shopMark : conditionInfo.shopMark,
                isNew : conditionInfo.isNew !=null? conditionInfo.isNew+'' : '',
                isNewShop : conditionInfo.isNewShop !=null ? conditionInfo.isNewShop+''  : '',
                status : conditionInfo.isNew !=null ? conditionInfo.isNew+'' : '',
              };
            }else{
              this.activityProtoForm = {
                discountId : this.discountId,
                promotionCode : activityInfo.promotionCode,
              }
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
              this.$message.error('获取详情失败!');
            }
          }
        });
      },
      handleImgSuccess(res, file) {
        this.editForm.img = res.urlList[0].split('?')[0];
      },
      handleH5ImgSuccess(res, file) {
        this.editForm.h5Img = res.urlList[0].split('?')[0];
      },
      beforeAvatarUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isLt5M;
      },
      submitEditForm(){
        this.$refs['editForm'].validate((valid) => {
          if(valid){
            let sendData = Object.assign({},this.editForm);
            sendData.startTime = this.formatTime(sendData.datetimerange[0]);
            sendData.endTime = this.formatTime(sendData.datetimerange[1]);
            delete sendData.datetimerange;
            Request({
              url : this.editForm.id ? `/promotions/promotion/update/${this.editForm.id}` : `/promotions/promotion/create`,
              method : this.editForm.id ? 'PUT' : 'POST',
              data : sendData,
              done : (res)=>{
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                this.activityId = res.data.id;
                this.activityProtoForm.promotionCode = res.data.promotionCode;
              },
              fail : (err)=>{
                if (err.responseJSON) {
                  if (err.responseJSON.error_mesg) {
                    this.$message.error(err.responseJSON.error_mesg);
                  } else if (err.responseJSON.error) {
                    this.$message.error(err.responseJSON.error);
                  }
                } else {
                  this.$message.error('保存失败!');
                }
              }
            });
          }else{
            this.$message.error('请填写相关信息!');
          }
        });
      },
      submitActivityProtoForm(){
        Request({
          url :   this.activityProtoForm.id ? `/promotions/promotion/updateCondition/${this.activityProtoForm.id}` : `/promotions/promotion/createCondition`,
          method : this.activityProtoForm.id ? 'PUT' : 'POST',
          data : Object.assign({},this.activityProtoForm,{
            promotionId : this.activityId
          }),
          done : (res)=>{
            this.$message({
              message: '保存成功！',
              type: 'success'
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
              this.$message.error('保存失败!');
            }
          }
        });
      },
      submitDiscountForm(){
        this.$refs['discountForm'].validate((valid) => {
          if(valid){
            let sendData = Object.assign({},this.discountForm);
            sendData.startDate = this.formatTime(sendData.datetimerange[0]);
            sendData.endDate = this.formatTime(sendData.datetimerange[1]);
            delete sendData.datetimerange;
            Request({
              url : this.discountForm.id ? `/promotions/discount/update` : `/promotions/discount/create`,
              method : 'POST',
              data : {
                id : this.discountForm.id || '',
                promotionId : this.activityId,
                htmlCode : sendData.htmlCode,
                name : sendData.name,
                desc : sendData.desc,
                startDate : sendData.startDate,
                endDate :sendData.endDate,
                isShare : sendData.isShare,
                type :sendData.type,
                forceAccept : sendData.forceAccept,
                isShow : sendData.isShow,
                forceUse : sendData.forceUse
              },
              done : (res)=>{
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                this.activityId && this.queryActivityDetail();
                this.factorForm.discountId = res.data.id;
                this.conditionForm.discountId = res.data.id;
                this.discountId = res.data.id;
                this.activityProtoForm.discountId = res.data.id;
              },
              fail : (err)=>{
                if (err.responseJSON) {
                  if (err.responseJSON.error_mesg) {
                    this.$message.error(err.responseJSON.error_mesg);
                  } else if (err.responseJSON.error) {
                    this.$message.error(err.responseJSON.error);
                  }
                } else {
                  this.$message.error('保存失败!');
                }
              }
            });
          }
        });
      },
      addFactor(index,row){
        if(index == -1  && row == -1){
          this.$refs['factorForm'] && this.$refs['factorForm'].resetFields();
          this.factorForm = {
            id : '',
            discountId : this.factorForm.discountId,
            discountSum : '',
            factorType : '',
            factorValue : ''
          };
        }else{
          this.factorForm = {
            id : row.id,
            discountId : row.discountId,
            discountSum : row.discountSum,
            factorType : row.factorType + '',
            factorValue : row.factorValue
          };
        }
        this.dialogfFactorVisible = true;
      },
      submitFactorForm(){
        this.$refs['factorForm'].validate((valid) => {
          if(valid){
            Request({
              url : this.factorForm.id ? `/promotions/discount/updateFactor` : `/promotions/discount/createFactor`,
              method : 'POST',
              data : this.factorForm.id  ? this.factorForm : Object.assign({},this.factorForm,{promotionId:this.activityId}),
              done : (res)=>{
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                this.activityId && this.queryActivityDetail();
                this.dialogfFactorVisible = false;
              },
              fail : (err)=>{
                if (err.responseJSON) {
                  if (err.responseJSON.error_mesg) {
                    this.$message.error(err.responseJSON.error_mesg);
                  } else if (err.responseJSON.error) {
                    this.$message.error(err.responseJSON.error);
                  }
                } else {
                  this.$message.error('保存失败!');
                }
              }
            });
          }
        });
      },
      addCondition(index,row){
        if(index == -1  && row == -1){
          this.$refs['conditionForm'] && this.$refs['conditionForm'].resetFields();
          this.conditionForm = {
            discountId : this.discountId,
            type : '',
            shopId : '',
            ownerId : '',
            cartId : '',
            shopCartId : '',
            productId : '',
            userMark : '',
            shopMark : '',
            isNew : '',
            isNewShop : '',
            isGroup : ''
          }
        }else{
          this.conditionForm = {
            id : row.id,
            discountId : row.discountId,
            type : row.type ? row.type+'' : '',
            shopId : row.shopId || '',
            ownerId : row.ownerId || '',
            cartId : row.cartId || '',
            shopCartId : row.shopCartId || '',
            productId : row.productId || '',
            downLimitSum :row.downLimitSum || 0,
            upLimitSum:row.upLimitSum || 0,
            userMark : row.userMark  ? row.userMark : '',
            shopMark :  row.shopMark ? row.shopMark : '',
            isNew : row.isNew ? row.isNew+'' : '',
            isNewShop : row.isNewShop ? row.isNewShop+'' : '',
            isGroup : row.isGroup ? row.isGroup+'' : '',
          }
        }
        this.dialogConditionVisible = true;
      },
      submitConditionFormForm(){
        this.$refs['conditionForm'].validate((valid) => {
          if(valid){
            let sendData = Object.assign({},this.conditionForm);
            Request({
              url : this.conditionForm.id ? `/promotions/discount/updateCondition` : `/promotions/discount/createCondition`,
              method : 'POST',
              data : sendData,
              done : (res)=>{
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                this.activityId && this.queryActivityDetail();
                this.dialogConditionVisible = false;
              },
              fail : (err)=>{
                if (err.responseJSON) {
                  if (err.responseJSON.error_mesg) {
                    this.$message.error(err.responseJSON.error_mesg);
                  } else if (err.responseJSON.error) {
                    this.$message.error(err.responseJSON.error);
                  }
                } else {
                  this.$message.error('保存失败!');
                }
              }
            });
          }
        });
      },
      goBack(){
        this.$router.go(-1);
      },
      formatTime(date){
        return moment(date).format("YYYY-MM-DD HH:mm:ss")
      }
    }
  }
</script>
<style>
  .passenger-operate-detail{
    padding: 1em;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    }
    & .editForm{
      max-width: 720px;
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
    & .el-date-editor{
      width: 100% !important;
    }
    & h3{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    & table{
      width: 100%!important;
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
