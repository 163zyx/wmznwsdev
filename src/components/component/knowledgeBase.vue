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
              <el-radio-button label="pdf">PDF文件</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件状态：">
                <el-radio-group v-model="form.checkType">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="complete">上传成功</el-radio-button>
                  <el-radio-button label="fail">上传失败</el-radio-button>
                  <el-radio-button label="loading">向量化中</el-radio-button>
                  <el-radio-button label="noerror">向量化完成</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="文件状态：">
                <el-radio-group v-model="form.checkResult">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="loading">向量化中</el-radio-button>
                  <el-radio-button label="noerror">向量化完成</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="上传时间：">
                  <el-date-picker
                  v-model="form.uploadDate"
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
                <el-button type="primary" @click="uploadShow">上传文件</el-button>
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
          uploadDate: '',
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
      uploadShow() {
        this.$parent.updateDialog();
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
