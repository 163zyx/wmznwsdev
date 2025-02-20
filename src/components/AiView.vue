<template>
  <div id="app">
    <header>
      <div class="header_box bin">
        <div class="left">
          <img src="./img/logo2.png" alt="" />
          <div class="left_zi">
            <p class="p1">AI助手</p>
            <!-- <p class="p2">OFFICE ASSISTANT</p> -->
          </div>
        </div>
        <div class="right">
          <ul>
            <li v-if="false" :class="tabSelected == 2 ? 'active' : ''" @click="tabSelectedChange(2)">
								<div>
<!--									<span class="btn">点击跳转外部链接</span>-->
									<span>
										<img  src="./img/policy.jpg" alt="" />
										政策问答
									</span>
								</div>

							</li>
            <li :class="tabSelected == 0 ? 'active' : ''" @click="tabSelectedChange(0)">
              <img v-if="tabSelected == 0" src="./img/edu-active.jpg" alt="" />
              <img v-else src="./img/edu.jpg" alt="" />
              问数
            </li>
            <li :class="tabSelected == 5 ? 'active' : ''" @click="tabSelectedChange(5)" style="position: relative;">
                <div class="fire-tips"></div>
                <!-- <el-badge value="deepseek" class="fire" type="primary"> -->
                  <img v-if="tabSelected == 5" src="./img/edu-active.jpg" alt="" />
                  <img v-else src="./img/edu.jpg" alt="" />
                  写作
                <!-- </el-badge> -->
            </li>
            <li :class="tabSelected == 1 ? 'active' : ''" @click="tabSelectedChange(1)">
              <img v-if="tabSelected == 1" src="./img/ss.png" alt="" />
              <img v-else src="./img/wxz-ss.png" alt="" />
              问政
            </li>
            <!-- <li :class="tabSelected == 2 ? 'active' : ''" @click="tabSelectedChange(2)">
								<img v-if="tabSelected == 2" src="./img/xiezuo-active.png" alt="" />
								<img v-else src="./img/xiezuo.png" alt="" />
								写作
							</li> -->
            <li :class="tabSelected == 3 ? 'active' : ''" @click="tabSelectedChange(3)">
              <img v-if="tabSelected == 3" src="./img/sj-active.png" alt="" />
              <img v-else src="./img/sj.png" alt="" />
              审校
            </li>
          </ul>
        </div>
        <div class="login-right">
            <img src="../components/img/touxiang.png" alt="" />
            <div class="user-menu">
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ info.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="tabSelectedChange(4)" icon="el-icon-reading">个人知识库</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-close" @click.native="exit">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
        </div>
      </div>
    </header>

    <!-- 搜索部分 -->
    <template v-if="tabSelected == 1">
      <iframe id="iframe" :src="searchUrl" style="height: calc(100% - 80px);"
        width="100%" frameborder="0"></iframe>
      <reference-qa-drawer @go-search="handleGoSearch" />
    </template>
    <!-- 写作部分 -->
    <template v-if="tabSelected == 2">
      <referenceQA @goSearch="handleGoSearch" />
    </template>
    <!-- 审校部分 -->
    <template v-if="tabSelected == 3">
      <proofread />
    </template>
    <!-- 数据查询部分 -->
    <template v-if="tabSelected == 0">
      <dataQA />
    </template>
    <!-- 个人知识库部分 -->
    <template v-if="tabSelected == 4">
      <KnowledgeBase ref="baseRef"></KnowledgeBase>
    </template>
    <!-- 知识库问答部分 -->
    <template v-if="tabSelected == 5">
      <KnowledgeQA />
    </template>
    <footer v-if="tabSelected === 0 || tabSelected === 4 || tabSelected === 5">
      <p>业务指导单位：
        <!--span style="margin-right: 36px;">科学技术与信息化司</span-->
        <span>科学技术与信息化司    发展规划司 </span>
        </p>
      <p>
        <span>技术支持单位：教育管理信息中心</span>
      </p>
    </footer>
    <el-dialog
        title="使用说明"
        :visible.sync="dialogVisible"
        width="45%"
        :before-close="dialogBeforeClose">
        <div style="font-size: 14px;line-height: 26px;">
          <p style="font-weight: bold;">1.数据范围：</p>
          <p>（1）教育事业统计数据：全国及各省2013年至2022年的42张表的教育事业统计数据，主要包括各级各类学校机构、教师、学生的统计数据。</p>
          <p>（2）教育管理信息系统数据：全国及各省2023年（时间节点为2023年12月30日）及2024年（时间节点为昨日）的信息系统业务统计数据，主要包括各级各类学校（机构）、教师、学生（不含高等教育阶段）的统计数据。</p>
          <p style="font-weight: bold;">2.使用模式：提问前请选择输入框前的下拉选项选择数据范围</p>
          <p>（1）“年鉴数据”来源于教育事业统计数据源；</p>
          <p>（2）“业务数据”来源于教育管理信息系统数据源；</p>
          <p>（3）“Auto”可自动识别用户问题，从对应的数据源查询数据，进行综合反馈，本模式仍在完善中。</p>

        </div>
    </el-dialog>
    <el-dialog
        title="上传文件"
        :visible.sync="uploadVisible"
        width="60%"
        :before-close="handleClose">
        <div style="display: flex;flex-direction: row-reverse;">
          <el-button type="primary" @click="toKnowleageBase">前往知识库</el-button>
        </div>
        <div class="baseBox bin" v-loading="uploading">
          <el-upload class="upload-demo" drag accept=".docx, .txt, .pdf, .csv" :http-request="uploadBpmn"
            :before-upload="beforeUpload" action="#" :show-file-list="false">
            <div class="el-upload__text"><em style="color: #0052D9;">点击上传</em> / 将文件拖入此区域</div>
            <div class="el-upload__tip" slot="tip">文件支持docx、pdf、 csv、txt，大小不得超过15M<br>免责声明：1，本系统上传文件均保存在部内私有云环境的个人目录下，请放心使用。<br>2，切勿上传<span style="color: red">涉密</span>文件，后果自负，与本平台无关。</div>
          </el-upload>
      </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadVisible = false">确 定</el-button>
          <el-button @click="uploadVisible = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import Cookies from 'vue-cookies';
  import proofread from './component/proofread.vue';
  import dataQA from './component/dataQA.vue';
  import writ from './component/writ.vue'
  import referenceQA from "./component/referenceQA.vue";
  import ReferenceQaDrawer from "./component/ReferenceQaDrawer.vue";
  import KnowledgeBase from '../components/component/knowledgeBase.vue';
  import KnowledgeQA from '../components/component/knowledgeQA.vue';
  import { eventBus } from '../../utils/eventBus';

  export default {
    name: '',
    data() {
      return {
        tabSelected: 0,
        dialogVisible: false,
        searchUrl: 'https://officechat.emic.edu.cn/new-official/#/policyinquiry',
        uploadVisible: false,
        loading: false,
        uploading: false,
        token: null,
        info:'',
        cookieUid:'',
      }
    },
    components: {
      ReferenceQaDrawer,
      proofread,
      dataQA,
      writ,
      referenceQA,
      KnowledgeBase,
      KnowledgeQA,
    },
    created() {
      // if(Cookies.get('topsession')) return
      // this.getTopSession()

    },
     mounted(){
      // 从网页地址中判断是否有token，如果有则直接跳转到个人知识库
       this.initApp()
      // if (url.indexOf('token') === -1) {
      //   // 往地址跳转
      //   window.location.href = 'https://user.moe.edu.cn/www/public/home/login?url=%2Fwww%2Fuc%2Fcas%2Findex%3Fservice=http://localhost:8080'
      // }
    },
    watch: {
      tabSelected(val) {
        this.loading = false
      }
    },
    methods: {
      async initApp() {
        if (!Cookies.get('topsession')) {
          await this.getTopSession();
        }
        this.getUserInfo();
      },
       getTopSession() {
         let self = this
         return new Promise((resolve, reject) => {
           let url = window.location.href
           // let url = 'https://officechat.emic.edu.cn/analyse/#/?token=d7c7dae20c155b8de73a45c23beee362';
           let token = url.split('=')[1];
           fetch(`https://map.data.moe.edu.cn/rest/cas/validate?ticket=${token}`, {
             method: 'GET',
           })
               .then(data => data.text())
               .then(data => {
                 let res = JSON.parse(data);
                 console.log("res",res)
                 if (res.status === 'success') {
                   let result = res.result;
                   self.token = result.token;
                   self.cookieUid = result.user_id;
                   eventBus.$emit('cookieUid', self.cookieUid);

                   Cookies.set('user_id', decodeURIComponent(result.user_id));
                   Cookies.set('topsession', decodeURIComponent(result.token));
                   resolve();
                 } else {
                   if (Cookies.get('topsession')) {
                     self.token = Cookies.get('topsession');
                     self.textGet();
                     resolve();
                   } else {

                     window.location.href ='https://user.moe.edu.cn/www/uc/cas/logout?url=%2Fwww%2Fuc%2Fcas%2Findex%3Fservice%3Dhttps%253A%252F%252Fmap.data.moe.edu.cn%252Fchat%252F'
                     reject(new Error('Failed to get top session'));
                   }
                 }
               })
               .catch(err => {
                 console.log(err);
                 reject(err);
               });
         });
      },
      textGet() {
        let self = this
        // fetch(`https://map.data.moe.edu.cn/page`, {
        //   method: 'GET',
        //   headers: {
        //     'topsession': self.token,
        //   },
        // }).then(function (data) {
        //   return data.text()
        // }).then(function (data) {
        //   let res = JSON.parse(data)
        //   // console.log("datares",res)
        // }).catch(err => {
        //   console.log(err)
        // })
      },
      handleGoSearch(url){
          this.searchUrl = url
          this.tabSelected = 1
      },
      // 点击顶部tab
      tabSelectedChange(val) {
        // console.log(val)
        if (this.tabSelected === val) {
          var iframe = document.getElementById('iframe'); // 获取iframe元素，'iframeId'是你的iframe的id
          this.searchUrl = 'https://officechat.emic.edu.cn/new-official/#/policyinquiry'
          // iframe.src = iframe.src 控制台报错删除
        } else {
          this.tabSelected = val
        } 
      },
      dialogBeforeClose() {
        this.dialogVisible = false
      },
      beforeUpload(file) { // 上传文件之前钩子
        let type = file.name.split('.')[1]
        if (type !== 'docx' && type !== 'txt' && type !== 'pdf' && type !== 'csv') {
          this.$message({
            type: 'error',
            message: '文件格式错误！文件仅支持docx、pdf、 csv、txt！！！！'
          })
          return false
        }
        if (file.size > 1024 * 1024 * 15) {
          this.$message({
            type: 'error',
            message: '文件大小不得超过15M！'
          })
          return false
        }
      },
      uploadBpmn(param) { // 部署流程定义（点击按钮，上传文件，上传成功后部署，然后重新加载列表）
        var that = this
        that.uploading = true
        const formData = new FormData()
        formData.append('file', param.file) // 传入文件
        // console.log("formdata1", formData)
        // let url = "https://officechat.emic.edu.cn/smiling/knowledge/file/upload"
        // https://officechat.emic.edu.cn 正式
        // http://39.106.131.95:9002 测试
        fetch('https://officechat.emic.edu.cn/smiling/knowledge/file/upload', {
          // fetch('http://39.106.131.95:9002/education/verify', {
          method: 'POST',
          body:formData,
          headers: {
              'X-User-ID': Cookies.get('user_id'),
          },
        }).then(function (data) {
          return data.text();
        }).then(function (data) {
          var res = JSON.parse(data)
          if (res.status === 1000) {
            that.$message.success(res.message);
          } else {
            that.$message.error(res.message);
          }
          that.uploading = false;
          that.uploadVisible = false;
          if(that.$refs.baseRef){
            that.$refs.baseRef.getBaseList()
          }
        }).catch(err => {
          that.$message.error(err);
        })
      },
      updateDialog(){
        this.uploadVisible = true
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      exit() {
        this.$confirm('确认退出？')
          .then(_ => {
            Cookies.remove('topsession'); // 删除cookie
            Cookies.remove('user_id'); // 删除user_id
            window.location.href = 'https://user.moe.edu.cn/www/uc/cas/logout?url=%2Fwww%2Fuc%2Fcas%2Findex%3Fservice%3Dhttps%253A%252F%252Fmap.data.moe.edu.cn%252Fchat%252F'
          })
          .catch(_ => {});
      },
      toKnowleageBase() {
        this.uploadVisible = false
        this.tabSelected = 4
      },
       getUserInfo() {
        let self = this
        console.log('self.token1',self.token)
        console.log('topsession',Cookies.get('topsession'))
         fetch('https://map.data.moe.edu.cn/rest/user/info',{
          method: 'GET',
          headers: {
            'topsession': Cookies.get('topsession')?Cookies.get('topsession'):self.token,
          },
        }).then(function (data) {
          return data.text();
        })  .then(function (data) {
          var res = JSON.parse(data)
          self.info = res.result
        })
      }
    }
  }

</script>


<style scoped>
  @import './css/search.css';
  @import './css/unpkg.com_element-ui@2.15.13_lib_theme-chalk_index.css';
  .el-dialog__header {
    border-bottom: 1px solid #e9eae9;
  }
</style>
