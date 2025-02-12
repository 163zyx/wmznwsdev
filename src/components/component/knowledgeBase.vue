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
                <el-button @click="getBaseList">搜索</el-button>
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
            <!-- <el-col :span="12">
              <el-form-item label="文件状态：">
                <el-radio-group v-model="form.checkType">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="complete">上传成功</el-radio-button>
                  <el-radio-button label="fail">上传失败</el-radio-button>
                  <el-radio-button label="loading">向量化中</el-radio-button>
                  <el-radio-button label="noerror">向量化完成</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
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
              prop="id"
              label="编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="文件名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="update_time"
              label="上传时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="文件类型"
              width="100">
            </el-table-column>
            <el-table-column
              prop="checktype"
              label="上传状态"
              width="100">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="uploadShow"
                  v-if="scope.row.status!== 'SUCCESS'">重新上传</el-button>
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
            :total="pageTotal">
          </el-pagination>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import {getApiUrl} from "../../../utils";
import Cookies from 'vue-cookies';

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
        baseDataList: [],
        currentPage: 1,
        pageTotal: 0,
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
      this.getBaseList();
    },
    methods: {
      getApiUrl,
      getBaseList() {
        let self = this;
        let param = {
          'page': self.currentPage,
          'size': 10,
        }
        fetch('https://officechat.emic.edu.cn/smiling/knowledge/file/list', {
          // fetch('http://39.106.131.95:9002/education/verify', {
          method: 'GET',
          query: param,
          headers: {
            'X-User-ID': Cookies.get('user_id'),
          },
        }).then(function (data) {
          return data.text();
        }).then(function (data) {
          var res = JSON.parse(data)
          if (res.status === 1000) {
            self.$message.success('查询成功');
            self.baseDataList =  res.data.records.map(record => {
              record.checktype = record.status === 'SUCCESS' ? '√' : 'X';
              return record;
            });
            self.pageTotal = res.data.total;
            
          } else {
            self.$message.error(res.message);
          }
          // if (res.status === 1000) {
          //   that.$message.success(res.message);
          // } else {
          //   that.$message.error(res.message);
          // }
        }).catch(err => {
          self.$message.error(err);
        })
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        let self = this
        let url = `https://officechat.emic.edu.cn/smiling/knowledge/file/delete/${row.id}`;
        fetch(url, {
          method: 'DELETE',
        }).then(function (data) {
          return data.text();
        }).then(function (data) {
          var res = JSON.parse(data)
          if (res.status === 1000) {
            self.$message.success('删除成功');
            self.getBaseList();
          } else {
            self.$message.error(res.message);
          }
        }).catch(err => {
          self.$message.error(err);
        })
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
