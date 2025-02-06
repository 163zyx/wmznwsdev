<template>
  <div id="app">
    <header>
      <div class="header_box bin">
        <div class="left">
          <img src="./img/logo2.png" alt="" />
          <div class="left_zi">
            <p class="p1">智能问数</p>
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
            <li :class="tabSelected == 1 ? 'active' : ''" @click="tabSelectedChange(1)">
              <img v-if="tabSelected == 1" src="./img/ss.png" alt="" />
              <img v-else src="./img/wxz-ss.png" alt="" />
              搜索
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
                  智能问数用户<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-reading">个人知识库</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-close">退出</el-dropdown-item>
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
    <footer v-if="tabSelected === 0">
      <p>业务指导单位：
        <!--span style="margin-right: 36px;">科学技术与信息化司</span-->
        <span>发展规划司</span>
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

  </div>
</template>

<script>
  import proofread from './component/proofread.vue';
  import dataQA from './component/dataQA.vue';
  import writ from './component/writ.vue'
  import referenceQA from "./component/referenceQA.vue";
  import ReferenceQaDrawer from "./component/ReferenceQaDrawer.vue";

  export default {
    name: '',
    data() {
      return {
        loading: false,
        tabSelected: 0,
        dialogVisible: false,
        searchUrl: 'https://officechat.emic.edu.cn/new-official/#/policyinquiry'
      }
    },
    components: {
      ReferenceQaDrawer,
      proofread,
      dataQA,
      writ,
      referenceQA
    },
    watch: {
      tabSelected(val) {
        this.loading = false
      }
    },
    methods: {
        handleGoSearch(url){
            this.searchUrl = url
            this.tabSelected = 1
        },
      // 点击顶部tab
      tabSelectedChange(val) {
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
