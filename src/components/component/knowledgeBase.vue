<template>
  <div class="app-container">
    <div style="width: 100%;">
      <div style="margin-bottom: 20px;">
        <el-page-header @back="goBack" content="个人知识库">
        </el-page-header>
      </div>
      <div class="search-container">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="名称搜索：">
            <el-row>
              <el-col :span="8">
                <el-input v-model="form.name"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button>搜索</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="文件类型：">
            <el-radio-group v-model="form.docType">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="word">Word文件</el-radio-button>
              <el-radio-button label="txt">txt文件</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审校状态：">
                <el-radio-group v-model="form.checkType">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="review">审校中</el-radio-button>
                  <el-radio-button label="complete">审校完成</el-radio-button>
                  <el-radio-button label="fail">审校失败</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审校结果：">
                <el-radio-group v-model="form.checkResult">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="haserror">无错误</el-radio-button>
                  <el-radio-button label="noerror">有错误</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审校时间：">
                  <el-date-picker
                  v-model="form.date1"
                  type="daterange"
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="updateDialog">上传文件</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table-container">
        <template>
          <el-table
            ref="dataTable"
            :data="baseDataList"
            style="width: 100%"
            max-height="330"
            >
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </template>
      </div>
      <el-dialog
        title="上传文件"
        :visible.sync="uploadVisible"
        width="60%"
        :before-close="handleClose">
        <div class="baseBox bin" v-loading="loading">
          <el-upload class="upload-demo" drag accept=".doc, .docx, .txt" :http-request="uploadBpmn"
            :before-upload="beforeUpload" action="#" :show-file-list="false">
            <div class="el-upload__text"><em style="color: #0052D9;">点击上传</em> / 将文件拖入此区域</div>
            <div class="el-upload__tip" slot="tip">文件支持docx、doc、txt，大小不得超过50M</div>
          </el-upload>
      </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {getApiUrl} from "../../../utils";

export default {
    name: 'knowledgeBase',
    data() {
      return {
        form: {
          name: '',
          docType: 'all',
          checkType: 'all',
          checkResult: 'all',
          date1: '',
        },
        baseDataList: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        currentPage: 1,
        uploadVisible: false,
        loading: false,
      }
    },
    computed: {

    },
    watch: {
      sseMessages: {
        handler(val) {
          this.renderSseMessage(val);
        },
        deep: true,
      },

    },
    mounted() {

    },
    methods: {
      getApiUrl,
      updateDialog(){
        this.uploadVisible = true
        console.log(this.form)
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      goBack() {
        this.$parent.tabSelectedChange(0);
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      beforeUpload(file) { // 上传文件之前钩子
        if (file.size > 1024 * 1024 * 50) {
          this.$message({
            type: 'error',
            message: '文件大小不得超过50M！'
          })
          return false
        }
      },
      uploadBpmn(param) { // 部署流程定义（点击按钮，上传文件，上传成功后部署，然后重新加载列表）
        var that = this
        that.loading = true
        const formData = new FormData()
        console.log(param)
        formData.append('file', param.file) // 传入文件
        that.loading = false
        console.log("formdata", this.formData)
        that.$message.success('上传成功')
        // https://officechat.emic.edu.cn 正式
        // http://39.106.131.95:9002 测试
        // fetch('https://officechat.emic.edu.cn/education/verify', {
        //   // fetch('http://39.106.131.95:9002/education/verify', {
        //   method: 'POST',
        //   body: formData,
        // }).then(function (data) {
        //   that.loading = false
        //   return data.text()
        // }).then(function (data) {
        //   that.loading = false
        //   var res = JSON.parse(data)
        //   if (res.code === 1001) {
        //     console.log(res)
        //     that.fileInfo = res.data
        //     that.gztsList = that.fileInfo.tipResult
        //     that.yscwList = that.fileInfo.wordResult
        //     if (that.gztsList && that.gztsList.length) {
        //       that.$nextTick(() => {
        //         that.gztsAddStyle()
        //       })
        //     }
        //     if (that.yscwList && that.yscwList.length) {
        //       that.$nextTick(() => {
        //         that.yscwAddStyle()
        //       })
        //     }
        //     if (that.fileInfo.wordViolateTypeList && that.fileInfo.wordViolateTypeList
        //       .length) {
        //       that.yscwOption = [{
        //         value: '全部',
        //         label: '全部提示（' + that.fileInfo.wordResult.length + '）',
        //       }]
        //       that.fileInfo.wordViolateTypeList.map(item => {
        //         that.yscwOption.push({
        //           value: item,
        //           label: item,
        //         })
        //       })
        //       that.yscwValue = that.yscwOption[0].value
        //     }
        //     if (that.fileInfo.tipViolateTypeList && that.fileInfo.tipViolateTypeList.length) {
        //       that.gztsOption = [{
        //         value: '全部',
        //         label: '全部提示（' + that.fileInfo.tipResult.length + '）',
        //       }]
        //       that.fileInfo.tipViolateTypeList.map(item => {
        //         that.gztsOption.push({
        //           value: item,
        //           label: item,
        //         })
        //       })
        //       that.gztsValue = that.gztsOption[0].value
        //     }
        //   } else {
        //     that.$message.error(res.msg);
        //   }
        // }).catch(err => {
        //   that.$message.error(err);
        // })
      },
    }
  }
</script>
<style>
  @import '../css/search.css';
  @import '../css/unpkg.com_element-ui@2.15.13_lib_theme-chalk_index.css';
  .app-container {
    padding: 38px 40px;
    max-width: 1340px;
    margin: 0 auto;
    .search-container {
      margin-bottom: 10px;
      background-color: #FFFFFF;
      padding: 20px 30px;
    }
    .table-container {
      width: 100%;
      height: 45vh;
      margin: 0 auto;
      background-color: #FFFFFF;
      padding: 20px 30px;
    }
  }
</style>
