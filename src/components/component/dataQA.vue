<template>
  <div class="xzbox bin">
    <div class="xz-left">
      <div class="xz-left-title">
        <div class="xz-left-title-shuxian"></div>
        提问历史记录
      </div>
      <div class="xz-left-list">
        <div class="xz-left-list-item" v-for="(item,index) in chatData" :key="index" @click="clickChatText(item.query)">
          <p class="title">{{ item.query }}</p>
          <p class="time">{{ timestampToTime(item.time) }}</p>
        </div>
      </div>
    </div>
    <div class="xz-right">
      <div class="xz-right-main chat">
        <div class="dfxx">
          <img src="../img/avatar.png" class="img" alt="" />
          <div class="dfxx-right">
            <div class="flex-part">
              <p class="dfxx-right-name">您好，我是智能问数 Bot</p>
              <!-- <el-button type="text" @click="showImg(require('../img/6.jpg'))">框架结构</el-button> 20240506暂时隐藏框架架构-->

            </div>


            <p class="dfxx-right-content">我拥有人工智能语言模型和BI双重能力，可以分析需求，并用可视化图表解答您的问题，也可以根据图表总结业务结论。</p>
            <!-- <p class="dfxx-right-content">目前我已经学习到的数据知识，包含： -->
              <!-- <el-button type="text" @click="showImg(require('../img/1.png'))">数据范围</el-button> 20240506暂时数据范围-->
            <!-- </p> -->
            <!-- <p class="dfxx-right-content">
              （1）2013-2022年度各级各类学生、教师及学校的部分综合统计数据；
            </p> -->
            <!-- <p class="dfxx-right-content">
              （2）2023-2024年各级各类学生教师及学校的部分业务统计数据；
            </p> -->
            <!-- <p class="dfxx-right-content">
              （3）2014-2023年的部分人口经济类数据；
            </p> -->

            <div class="cnxw">
              <p class="cnxw-title">请试着这样问我</p>
              <div class="cnxw-content-box">
                <ul>
                  <li v-for="(item, index) in contentBox" :key="index"  @click="copyTemplate(item.name)">
                    {{item.name}}
                  </li>
                  <!-- <li @click="copyTemplate('2016-2022北京高中教师人数')">
                    2016-2022年北京高中教师人数</li>
                  <li @click="copyTemplate('2022年各省幼儿园数量')">
                    2022年各省幼儿园数量</li>
                  <li @click="copyTemplate('2013-2022年全国小学阶段每年在校生数量')">
                    2013-2022年全国小学阶段每年在校生数量</li>
                  <li @click="copyTemplate('2022年小学阶段各省在校生数')">
                    2022年小学阶段各省在校生数</li>

                  <li @click="copyTemplate('2015至2022年北京、黑龙江省小学入学人数')">
                    2015至2022年北京、黑龙江省小学入学人数</li> -->
                </ul>
              </div>
            </div>
          </div>
        </div>
        <template v-if="chatData.length">
          <div v-for="(item,index) in chatData" :key="index">
            <div class="my-query">
              <p class="content">{{ item.query }}</p>
              <img src="../img/touxiang.png" alt="" class="img" />
            </div>
            <div v-if="item.loading" class="loading">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div v-if="!item.loading">
              <div class="dfquery">
                <img src="../img/avatar.png" class="img" alt="" />
                <div class="content" :class="'content-df'+ index"
                  style="display: flex;flex-direction: column;align-items: flex-start;">
                  <div style="width: 100%;display: flex;flex-direction: row;justify-content: space-between;">
                    <div>
                      <p style="font-size: 15px;line-height: 27px;"  v-html="item.responseMdText || '未找到该内容'"></p>
                    </div>
                    <!-- <div v-if="item.showChart" style="flex:1;display:flex;justify-content: flex-end;margin-top: -10px;">
                      <el-radio-group v-model="item.type" @change="handleRadioChange(item.type, item)">
                        <el-radio label="bar">
                          <img src="./../img/bar.svg" alt="" class="icon-img">
                          <div class="icon-font">柱状图</div>
                        </el-radio>
                        <el-radio  label="line">
                          <img src="./../img/line.svg" alt="" class="icon-img">
                          <div class="icon-font">折线图</div>
                        </el-radio>
                      </el-radio-group>
                    </div> -->
                  </div>

                  <!-- <div v-show="item.showChart" :id="`chart${index}`" style="width: 600px;height:400px;"></div> -->
                  <!-- <div v-show="item.showChart && item.type === 'line'" :id="`chart${index}` + '0'" style="width: 600px;height:400px;"></div> -->

                  <div class="tip" v-if="item.chartData && item.chartData[1].data.source">
                    <span class="tip_text">数据来源：{{item.chartData[1].data.source}}</span>
                  </div>
                  <div class="tip" v-show="item.showChart">
                    <!-- <span class="tip_text">根据你的需求，我为你生成了相应图表，也可以生成与本图表相关的一些分析。</span> -->
                    <span class="tip_text">根据你的需求，我为你生成了相应图表。</span>

                    <!-- <el-button type="text" @click="handleNeedCommend(item)">需要分析</el-button> -->
                  </div>
                  <!-- <div id="chart-text" style="width: 600px;height:400px;"></div> -->
                  <div v-show="item.showChart" :id="`chart${index}`" style="width: 600px;height:400px;"></div>
                  <div style="width: 100%;display: flex;justify-content: flex-end;" class="duifangcontent"
                    v-if="item.copy">
                    <div class="sjinfo-right-title-right-img"
                      :class="item.wdpj == 'good' ? 'sjinfo-right-title-right-img-active' : ''"
                      @click="xzcp(item,'good')" style="margin-top: 5px;">
                      <img
                        :src="item.wdpj == 'good' ? require('../img/haoping-active.png') : require('../img/haoping.png')"
                        alt="" />
                    </div>
                    <el-popover placement="bottom-end" trigger="click" v-model="item.wdbadShow"
                      v-show="item.wdpj == 'good' || item.wdpj == ''" @after-leave="xzcp(item,'bad')">
                      <div class="cp-box" style="width: 425px;">
                        <div style="margin-bottom: 10px;">
                          <el-checkbox-group v-model="item.wdbadpjinfo.badinfo" size="small">
                            <el-checkbox label="还不够好" border>还不够好</el-checkbox>
                            <el-checkbox label="与问题无关" border>与问题无关</el-checkbox>
                            <el-checkbox label="内容不准确" border>内容不准确</el-checkbox>
                            <el-checkbox label="没有帮助" border>没有帮助</el-checkbox>
                            <el-checkbox label="有害信息" border>有害信息</el-checkbox>
                            <el-checkbox label="我要吐槽" border>我要吐槽</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <el-input :disabled="!item.wdbadpjinfo.badinfo.includes('我要吐槽')" type="textarea"
                          :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入评价内容"
                          v-model="item.wdbadpjinfo.inputvalue">
                        </el-input>
                        <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                          <el-button type="primary" @click="item.wdbadShow = false">提交</el-button>
                        </div>
                      </div>
                      <div slot="reference" class="sjinfo-right-title-right-img"
                        :class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''"
                        style="margin-top: 5px;">
                        <img src="../img/chaping.png" alt="" />
                      </div>
                    </el-popover>
                    <div class="sjinfo-right-title-right-img" v-show="item.wdpj == 'bad'"
                      :class="item.wdpj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''" @click="xzcp(item,'bad')"
                      style="margin-top: 5px;">
                      <img src="../img/chaping-active.png" alt="" />
                    </div>
                    <div v-if="!item.showChart" class="dfcontent-bot" @click="copydf(index)">
                      <img src="../img/copy.png" alt="" style="width: 21px;margin-right: 5px;" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="dfquery-remark">
                <div v-if="item.loadings" class="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                <div v-else v-for="(i,index) in item.AIList" :key="index">
                  <div class="remark-line"  @click="copyQuestionTemplate(i)">
                    <div class="remark-box">
                      <svg t="1714026093887" class="icon svg-view" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="14238" width="200" height="200">
                        <path
                          d="M350.363319 367.77895l0-96.302227-224.738283 224.779215 224.738283 224.690187 0-96.316553-128.42173-128.374658L350.363319 367.77895zM542.983122 399.946548l0-128.468802-224.738283 224.779215 224.738283 224.690187 0-131.623652c160.486997 0 272.882745 51.394479 353.105777 163.696082C864.023632 592.565328 767.708102 432.024096 542.983122 399.946548"
                          p-id="14239" fill="#707070"></path>
                      </svg>
                      {{ i.content }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
      <div class="xz-right-foot">
        <div id="useTemplate" v-if="useTemplate"></div>
        <el-input v-else v-model="chatText" type="text" placeholder="请输入问题相关描述" @keydown.enter="sendChat()">
          <el-select class="select_url" v-model="selectUrl" slot="prepend" placeholder="请选择">
            <!-- <el-option label="年鉴数据" :value="getApiUrl('/glm/v2/chatdata?v=4&t=nj&q=')"></el-option> -->
            <el-option label="年鉴数据" :value="'https://map.data.moe.edu.cn/rest/glm/chatdata?t=nj&q='"></el-option>
            <el-option label="业务数据" value="https://map.data.moe.edu.cn/rest/glm/chatdata?t=jck&q="></el-option>
            <!-- <el-option label="经济人口" value="http://10.40.241.6:17862/glm/v2/chatdata?v=4&t=jr&q="></el-option>
            <el-option label="Auto" value="http://10.40.241.6:17862/glm/v3/chat?q="></el-option> -->
          </el-select>
        </el-input>
        <el-button :disabled="chatLock" @click="sendChat()">发送</el-button>
      </div>

    </div>
    <div id="imgScaleBox" v-if="dialogVisible" @click="dialogVisible = false">
      <img id="imgScale" :src="image" alt="">
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import Cookies from 'vue-cookies';
import ecStat from 'echarts-stat';
import MarkdownIt from 'markdown-it';
import sseMixin from "../../../utils/sseMixin";
import {getApiUrl} from "../../../utils";

export default {
    mixins: [sseMixin],
    data() {
      return {
        chatText: undefined,
        chatData: [],
        chatLock: false,
        useTemplate: false,
        shenjiaopj: '',
        // selectUrl: 'https://officechat.emic.edu.cn/glm/v2/chatdata?v=4&t=nj&q=',
        // selectUrl: 'https://map.data.moe.edu.cn/rest/glm/chatdata?t=nj&q=',
        // selectUrl: 'http://47.123.4.81:3389/glm/test?v=4&t=nj&q=',
        // selectUrl: getApiUrl('/glm/v2/chatdata?v=4&t=nj&q='),
        // selectUrl: 'https://map.data.moe.edu.cn/rest/glm/analyse',
        selectUrl: 'https://map.data.moe.edu.cn/rest/glm/chatdata?t=nj&q=',
        dialogVisible: false,
        image: '',
        AIList: [],
        contentBox: [{
              name: '2013-2022全国普通高校研究生招生人数',
            },
            // {
            //   name: '当前上海普通高中在校生人数',
            // }, {
            //   name: '近五年黑龙江省小学入学人数',
            // },
            {
              name: '2013-2022年北京、上海、广东高中毕业生数',
            },
],
        // type: 'bar',
        loading: false,

        /**
         * chat=正常对话 get_need_commend=需要分析获取分析结论
         * @type {'' | 'chat' | 'get_need_commend'}
         */
        chatQueryType: '',
        renderResponseInterval: null,
        renderResponseInx: 0,
        chart_data: null,
      }
    },
    computed: {
      latestChatResponse() {
        const item = this.chatData[this.chatData.length - 1] || {};
        return {
          response: item.response || '',
          response_status: item.response_status || '', // finish |  any other
        }
      }
    },
    watch: {
      sseMessages: {
        handler(val) {
          this.renderSseMessage(val);
        },
        deep: true,
      },
      latestChatResponse: {
        handler(val) {
          if (this.renderResponseInterval) {
            return;
          }
          const item = this.chatData[this.chatData.length - 1];
          if (val.response) {
            if (!item.responseText) {
              this.renderResponseInx = 0;
            }
            this.renderResponseInterval = setInterval(() => {
              const item = this.chatData[this.chatData.length - 1];
              if (this.renderResponseInx >= item.response.length) {
                clearInterval(this.renderResponseInterval);
                this.renderResponseInterval = null;
                if (item.response_status === 'finish') {
                  this.afterChatSuccess(item, this.sseMessages[this.sseMessages.length - 1]);
                }
              } else {
                item.responseText = item.responseText + item.response[this.renderResponseInx];
                item.responseMdText = this.getMarkdown().render(item.responseText);
                this.chatData[this.chatData.length - 1] = JSON.parse(JSON.stringify(item));
                this.chatData = JSON.parse(JSON.stringify(this.chatData));
                this.renderResponseInx++;
                this.$nextTick(() => {
                  document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
                    .scrollHeight
                })
              }
            }, 10)
          }
        },
        deep: true,
      },
      sseError(val) {
        // 如果sse有错误
        if (!!val) {
          const item = this.chatData[this.chatData.length - 1];
          item.loading = false;
          const response = '<span style="color: red;">系统异常，请稍后重试！</span>';
          item.response = response;
          item.responseText = response;
          item.responseMdText = response;
          item.loadings = false;
          this.chatData[this.chatData.length - 1] = JSON.parse(JSON.stringify(item));
          this.chatData = JSON.parse(JSON.stringify(this.chatData));
          this.chatLock = false;
          this.$nextTick(() => {
            document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
              .scrollHeight
          })
        }
      }
    },
    mounted() {
      this.getHistory()
    },
    methods: {
      getApiUrl,
      getMarkdown() {
        var md = new MarkdownIt({
          html: true,
          linkify: true,
          typographer: true,
        });
        // 禁用默认的列表解析器
        // md.disable('list');
        // 自定义表格渲染器
        function myTableRender(tokens, idx, options, env, self) {
          const token = tokens[idx];
          // 检查 token 是否是表格
          if (token.type === 'table_open') {
            // 添加一个自定义的类到 table 标签
            return '<table class="markdown-table">';
          }
          // 处理表格的其他部分，例如 th, td 等
          // ...
          // 表格结束标签
          if (token.type === 'table_close') {
            return '</table>';
          }
          // 默认行为
          return self.renderToken(tokens, idx, options);
        }
        // 注册自定义渲染器
        md.renderer.rules.table_open = myTableRender;
        return md;
      },
      renderEcharts(item, d) {
        item.showChart = true
        // item.chartData = d
        // this.chatData[this.chatData.length - 1] = JSON.parse(JSON.stringify(item))
        // this.chatData = JSON.parse(JSON.stringify(this.chatData));

        this.$nextTick(() => {
          document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
            .scrollHeight
          // if (!item.response) {
          //   let cData = [...d];
          //   if (typeof(cData[0].data) === 'string') {
          //     cData[0].data = {
          //       options: {
          //         showTitle: true,
          //         legend: {}
          //       },
          //       title: cData[0].data,
          //     }
          //   }
          //   cData[0].data.options.legend.bottom = 0

          //   if (cData[0].data.title === "高校在校生与gdp关系") {
          //     cData[0].data.options.yAxis.axisLabel.formatter = function (value, index) {
          //       return (value / 10000).toFixed(1) + "万元"
          //     }
          //   }

          //   this.initChart(`chart${this.chatData.length - 1}`, cData[0].data.options)
          //   // d[0].data.legend.bottom = 0
          //   // d[1].data.legend.bottom = 0
          //   // this.initChart(`chart${this.chatData.length -1}`, d[0].data)
          //   // this.initCharts(`chart${this.chatData.length -1 +'0'}`, d[1].data)
          // }
          // console.log("${this.chatData.length - 1}",this.chatData.length - 1)
          // console.log("d.option",d.options)
          this.initChart(`chart${this.chatData.length - 1}`, d.options)
        })
      },
      renderSseMessage(sseMessages) {
        console.log('sseMessages:', sseMessages)
        const d = JSON.parse(JSON.stringify(sseMessages));
        console.log("d", d)
        if (!d.length) return

        if (this.chatData.length > 0) {
          console.log('---------------chatdata:', this.chatData)
          let item = this.chatData[this.chatData.length - 1];
          item.loading = false;

          const latestRes = d[d.length - 1];
          console.log('---------------dddddd:', latestRes)
          let resType = '';
          if (latestRes.hasOwnProperty('message')) {
            resType = 'text'
            item.response = latestRes.message.content.text;
            item.response_status = latestRes.status;
            // 会在watch-latestChatResponse里面渲染text，并执行afterChatSuccess
            if (latestRes.status === 'finish') {
              let params = {
                question: item.query,
                answer: item.response,
                chat_no: 1,
              }
              this.addHistory(params)
              // 手动结束sse
              this.closeSSE();
              this.renderEcharts(item, this.chart_data);
            }
          } else {
            resType = 'echarts'
            item.response = '';
            item.loadings = false;
          }
          this.chatData[this.chatData.length - 1] = JSON.parse(JSON.stringify(item))
          this.chatData = JSON.parse(JSON.stringify(this.chatData));
          if (resType === 'echarts') {
            // 手动结束sse
            this.closeSSE();
            // 渲染表格
            this.renderEcharts(item, latestRes);
            this.afterChatSuccess(item, latestRes);
          }
        }
      },
      async afterChatSuccess(item, d) {
        try {
          // 保存问题和答案
          let params = new FormData()
          params.append('question', item.query)
          if (item.response === '') {
            params.append('answer', JSON.stringify(d))
          } else {
            params.append('answer', item.response)
          }
          await this.fetchWithTimeout(getApiUrl('/education/insertDataQuestionAndAnswer'), {
            method: 'PUT',
            body: params,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            item.QuestionAndAnswer = res.data
          })
        } catch (_e) {}

        item.copy = true
        this.chatText = null

        this.chatLock = false

        if (this.chatQueryType !== 'get_need_commend') {
          item.loadings = true
          try {
            const recommend = await fetch(getApiUrl('/question_recommendation'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8;',
              },
              body: JSON.stringify({
                text: item.query,
                uid: ''
              })
            }).then(response => response.json())
            if (recommend) item.AIList = recommend.response;
            item.loadings = false
          } catch (_e) {
            item.loadings = false
          }
        } else {
          this.chatQueryType = '';
        }
      },
      handleRadioChange(type, item) {
        item.chartData[0].data.legend.bottom = 0
        item.chartData[1].data.legend.bottom = 0
        if (type === 'bar') {
          this.$nextTick(() => {
            this.initChart(`chart${this.chatData.length -1}`, item.chartData[0].data)
          })
        } else if (type === 'line') {
          this.$nextTick(() => {
            this.initCharts(`chart${this.chatData.length -1 +'0'}`, item.chartData[1].data)
          })
        }
      },
      timeout(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("请求超时"))
          }, ms);
        });
      },
      /**
       * @param resource 请求url
       * @param options 请求参数 同时可手动传入超时时间timeout，不出如timeout就是默认5秒超时
       * @return {Promise<any>}
       */
      async fetchWithTimeout(resource, options) {
        const {
          timeout = 50000
        } = options;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await Promise.race([
          fetch(resource, {
            ...options,
            signal: controller.signal
          }),
          this.timeout(timeout)
        ]);

        clearTimeout(id);

        return response;
      },
      /**
       * @param src 传入图片地址，可打开图片
       * */
      showImg(src) {
        this.dialogVisible = true
        this.image = src
        this.$nextTick(() => {
          var scale = 0.5
          var img = document.getElementById('imgScale');
          var isDraggable = false;
          var startX, startY, imgX, imgY;
          img.onwheel = function (event) {
            event.preventDefault();
            // 计算缩放比例，deltaY < 0 表示向上滚动，也就是放大图片；反之则缩小图片
            scale += event.deltaY < 0 ? 0.1 : -0.1;
            // 限制缩放比例在0.1到2之间
            scale = Math.min(2, Math.max(0.3, scale));
            if (Number(img.style.top.replace('px', '')) > (document.getElementById('imgScaleBox').clientHeight *
                scale * 0.5)) {
              img.style.top = (document.getElementById('imgScaleBox').clientHeight * scale * 0.5) + 'px'
            } else if (Math.abs(Number(img.style.top.replace('px', ''))) > (document.getElementById('imgScaleBox')
                .clientHeight * scale * 0.5)) {
              img.style.top = (document.getElementById('imgScaleBox').clientHeight * scale * -0.5) + 'px'
            }
            // 更新图片的缩放级别
            img.style.transform = 'scale(' + scale + ')';
          };
          img.onmousedown = function (event) {
            isDraggable = true;
            event.preventDefault()
            // 记录鼠标按下的坐标和图片的位置
            startX = event.clientX;
            startY = event.clientY;
            imgX = img.offsetLeft;
            imgY = img.offsetTop;
          };
          img.onmousemove = function (event) {
            if (isDraggable) {
              event.preventDefault()
              // 计算鼠标移动的距离
              var dx = event.clientX - startX;
              var dy = event.clientY - startY;

              // 更新图片的位置
              img.style.left = imgX + dx + 'px';
              img.style.top = imgY + dy + 'px';
            }
          };
          img.onmouseup = function () {
            isDraggable = false;
          };
          img.addEventListener("click", function (event) {
            event.stopPropagation();
          });
        })
      },
      initChart(elId, option) {
        // if (echarts.getInstanceByDom(document.getElementById(elId))) {
        //   echarts.dispose(document.getElementById(elId));
        // }
        this.$nextTick(() => {
          var myChart = echarts.init(document.getElementById(elId));
          myChart.setOption(option);
        })
        // echarts.registerTransform(ecStat.transform.regression);
      },
      initCharts(elId, option) {
        if (echarts.getInstanceByDom(document.getElementById(elId))) {
          echarts.dispose(document.getElementById(elId));
        }
        var myChart = echarts.init(document.getElementById(elId));
        myChart.setOption(option);
      },
      // 时间戳转时间
      timestampToTime(timestamp) {
        // 时间戳为10位需*1000，时间戳为13位不需乘1000
        var date = new Date(timestamp);
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1) + "-";
        var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
        var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
        var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
      },
      // 点击历史提问记录
      clickChatText(query) {
        var that = this
        const box1 = document.getElementsByClassName('chat')[0]
        const box = document.getElementsByClassName('chat')[0].getElementsByClassName('my-query')
        if (box && box.length) {
          for (var i = 0; i < box.length; i++) {
            console.log(box[i].innerText, query)
            if (box[i].innerText == query) {
              console.log(box[i].offsetTop)
              box[i].scrollIntoView(true)
              break;
            }
          }
        }
      },
      async sendChat(chatText) {
        if (this.chatText === undefined || this.chatText === '' || this.chatText === null) return;
        const that = this
        let value
        that.chart_data = null;
        if (this.useTemplate) {
          let useTemplateEl = document.getElementById('useTemplate')
          let text = ""
          Array.from(useTemplateEl.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              // 如果是文本节点
              text += node.textContent
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // 如果是元素节点
              if (node.tagName === 'INPUT') {
                // 如果是input元素
                text += node.value
              } else {
                // 对于其他元素，获取内部文字
                text += node.innerText
              }
            }
          });
          value = text
        } else {
          value = chatText ? chatText : this.chatText
        }
        if (this.chatLock) {
          return
        }
        that.chatLock = true;
        fetch(that.selectUrl + this.chatText, {
          // fetch('http://39.106.131.95:9002/education/verify', {
          method: 'POST',
          headers: {
            'topsession': Cookies.get('topsession')
          },
        }).then(function (data) {
          return data.text();
        }).then(function (data) {
          var res = JSON.parse(data)
          let resData = res.result[1].data
          let item = {
            query: value,
            loading: true,
            loadings: true,
            time: new Date().getTime(),
            QuestionAndAnswer: {},
            wdbadShow: false,
            wdpj: '',
            wdpjinfo: {},
            showChart: false,
            wdbadpjinfo: {
              inputvalue: '',
              badinfo: [],
            },
            AIList: [],
            type: 'bar',
            responseText: '',
            responseMdText: '',
            response_status: '',
          }
          that.chatData.push(item)
          if(res.result[0] && res.result[0].type === "echart") {
            that.chart_data = res.result[0].data
          }
          console.log("resData", res.result[0])
          that.$nextTick(() => {
            document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
              .scrollHeight
          })
          that.useTemplate = false

          let d
          try {
            // sse请求
            that.initSSE('https://map.data.moe.edu.cn/rest/glm/analyse', {'data':JSON.stringify(resData)}, 'change');
            // this.initSSE(this.selectUrl + value);
            /*// 如果需要进行超时就在调用这个方法，fetchWithTimeout
            d = await this.fetchWithTimeout(this.selectUrl + value, {
              method: 'POST',
              timeout: 150000
            })
            d = await d.json()
            console.log(d)*/
          } catch (error) {
            console.error("超时错误：", error);
            item.loading = false
            this.$nextTick(() => {
              document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
                .scrollHeight
            })
            return
          }

          return;
        }).catch(err => {
          that.$message.error(err);
        });


        // fetch(`http://10.40.241.6:17862/glm/v2/recommend?q=${this.chatText}`, {
        //   method: 'POST'
        // }).then(function (data) {
        //     return data.text()
        // }).then(function (data) {
        //   var res = JSON.parse(data)
        //   item.AIList = res
        //   item.loadings = false
        // })
        /*var md = new MarkdownIt({
          html: true,
          linkify: true,
          typographer: true,
        });
        // 禁用默认的列表解析器
        md.disable('list');
        // 自定义表格渲染器
        function myTableRender(tokens, idx, options, env, self) {
          const token = tokens[idx];

          // 检查 token 是否是表格
          if (token.type === 'table_open') {
            // 添加一个自定义的类到 table 标签
            return '<table class="markdown-table">';
          }

          // 处理表格的其他部分，例如 th, td 等
          // ...

          // 表格结束标签
          if (token.type === 'table_close') {
            return '</table>';
          }

          // 默认行为
          return self.renderToken(tokens, idx, options);
        }

        // 注册自定义渲染器
        md.renderer.rules.table_open = myTableRender;
        // item.response = md.render(d.choices && d.choices.length > 0 ? d.choices[0].message.content : '')
        const aaa  = md.render(d.choices && d.choices.length > 0 ? d.choices[0].message.content : '')
        // const styledHtml = aaa.replace('<table>', '<table class="markdown-table">');
          // item.response = styledHtml
          item.response = aaa*/

        // const d = await (await fetch("http://47.123.4.81:3389/glm/chatdata?q=" + value, { method: 'POST' })).json()
        // item.response = d.choices && d.choices.length > 0 ? d.choices[0].message.content : ''
        // 保存问题和答案
        /*let params = new FormData()
        params.append('question', value)
        if (item.response === '') {
          params.append('answer', JSON.stringify(d))
        } else {
          params.append('answer', item.response)
        }
        const x = await (await fetch("https://officechat.emic.edu.cn/education/insertDataQuestionAndAnswer", {
          method: 'PUT',
          body: params,

        }).then(function (data) {
          return data.text()
        }).then(function (data) {
          var res = JSON.parse(data)
          item.QuestionAndAnswer = res.data
        }))
        if (item.response === '') {
          item.showChart = true
          item.chartData = d
        }
        item.copy = true
        item.loading = false
        this.chatText = null
        this.$nextTick(() => {
          document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
            .scrollHeight
          if (item.response === '') {

            d[0].data.options.legend.bottom = 0

            if (d[0].data.title === "高校在校生与gdp关系") {
              d[0].data.options.yAxis.axisLabel.formatter = function(value, index) {return (value / 10000).toFixed(1) + "万元"}
            }

            this.initChart(`chart${this.chatData.length -1}`, d[0].data.options)
            // d[0].data.legend.bottom = 0
            // d[1].data.legend.bottom = 0
            // this.initChart(`chart${this.chatData.length -1}`, d[0].data)
            // this.initCharts(`chart${this.chatData.length -1 +'0'}`, d[1].data)
          }
        })
        item.loadings = true
        const recommend = await fetch('https://officechat.emic.edu.cn/question_recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8;',
          },
          body: JSON.stringify({
            text: value,
            uid: ''
          })
        }).then(response => response.json())
        if (recommend) item.AIList = recommend.response;item.loadings = false

        this.chatLock = false*/
      },
      // 获取结论
      async handleNeedCommend(record) {
        console.log(record);
        let value = '数据解析：' + record.query
        let item = {
          query: value,
          loading: true,
          time: new Date().getTime(),
          QuestionAndAnswer: {},
          wdbadShow: false,
          wdpj: '',
          wdpjinfo: {},
          showChart: false,
          wdbadpjinfo: {
            inputvalue: '',
            badinfo: [],
          },
          responseText: '',
          responseMdText: '',
          response_status: '',
        }
        this.useTemplate = false
        this.chatData.push(item)
        this.$nextTick(() => {
          document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
            .scrollHeight
        })

        const timeout = (ms, promise) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error("请求超时"))
            }, ms)
            promise.then(resolve, reject)
          })
        }
        // 获取结论请求
        /*const d = await (await fetch(getApiUrl('/glm/analyse'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;',
          },
          body: JSON.stringify({
            data: record.chartData[record.chartData.length - 1].data,
          })
        })).json()*/
        // sse 获取结论请求
        this.chatQueryType = 'get_need_commend';
        this.initSSE(getApiUrl('/glm/analyse'), {data: record.chartData[record.chartData.length - 1].data})

        /*var md = new MarkdownIt({
          html: true,
          linkify: true,
          typographer: true,
        });
        // 禁用默认的列表解析器
        md.disable('list');
        // 自定义表格渲染器
        function myTableRender(tokens, idx, options, env, self) {
          const token = tokens[idx];
          // 检查 token 是否是表格
          if (token.type === 'table_open') {
            // 添加一个自定义的类到 table 标签
            return '<table class="markdown-table">';
          }
          // 处理表格的其他部分，例如 th, td 等
          // ...
          // 表格结束标签
          if (token.type === 'table_close') {
            return '</table>';
          }
          // 默认行为
          return self.renderToken(tokens, idx, options);
        }
        // 注册自定义渲染器
        md.renderer.rules.table_open = myTableRender;
        item.response = md.render(d.choices && d.choices.length > 0 ? d.choices[0].message.content : '')
        // 保存问题和答案
        let params = new FormData()
        params.append('question', value)
        if (item.response === '') {
          params.append('answer', JSON.stringify(d))
        } else {
          params.append('answer', item.response)
        }
        const x = await (await fetch("https://officechat.emic.edu.cn/education/insertDataQuestionAndAnswer", {
          method: 'PUT',
          body: params,

        }).then(function (data) {
          return data.text()
        }).then(function (data) {
          var res = JSON.parse(data)
          item.QuestionAndAnswer = res.data
        }))
        item.copy = true
        item.loading = false
        this.chatText = null
        this.$nextTick(() => {
          document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
            .scrollHeight
        })
        this.chatLock = false*/
      },
      // 点击差评按钮
      xzcp(info, value) {
        var that = this
        console.log(info)
        info.wdbadShow = false
        if (info.wdpj == 'good') {
          let data = new FormData()
          data.append("id", info.wdpjinfo.id);
          data.append("feedback", value);
          if (info.wdbadpjinfo.badinfo.length > 0) {
            var yuanyin = []
            for (var i = 0; i < info.wdbadpjinfo.badinfo.length; i++) {
              if (info.wdbadpjinfo.badinfo[i] != '我要吐槽') {
                yuanyin.push(info.wdbadpjinfo.badinfo[i])
              }
            }
            if (info.wdbadpjinfo.inputvalue) {
              yuanyin.push(info.wdbadpjinfo.inputvalue)
            }
            data.append("badReason", yuanyin.join(';'))
          }
          fetch('https://officechat.emic.edu.cn/education/updateDataFeedback', {
            // fetch('http://39.106.131.95:9002/education/updateWriteFeedback', {
            method: 'POST',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            info.wdpj = value
            info.wdpjinfo = res.data
          })
        } else if (info.wdpj == 'bad') {
          // var data = {
          //  id: info.wdpjinfo.id,
          // }
          let data = new FormData()
          data.append("id", info.wdpjinfo.id)
          // fetch('http://39.106.131.95:9002/education/deleteWriteFeedback', {
          fetch('https://officechat.emic.edu.cn/education/deleteDataFeedback', {
            method: 'DELETE',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            info.wdpj = ''
            info.wdpjinfo = {}
          })
        } else {
          let data = new FormData()
          data.append("questionId", info.QuestionAndAnswer.questionId)
          data.append("answerId", info.QuestionAndAnswer.answerId)
          data.append("feedback", value)
          if (info.wdbadpjinfo.badinfo.length > 0) {
            var yuanyin = []
            for (var i = 0; i < info.wdbadpjinfo.badinfo.length; i++) {
              if (info.wdbadpjinfo.badinfo[i] != '我要吐槽') {
                yuanyin.push(info.wdbadpjinfo.badinfo[i])
              }
            }
            if (info.wdbadpjinfo.inputvalue) {
              yuanyin.push(info.wdbadpjinfo.inputvalue)
            }
            data.append("badReason", yuanyin.join(';'))
          }
          fetch('https://officechat.emic.edu.cn/education/insertDataFeedback', {
            // fetch('http://39.106.131.95:9002/education/insertWriteFeedback', {
            method: 'PUT',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            info.wdpj = value
            info.wdpjinfo = res.data
          })
        }
        info.wdbadpjinfo = {
          inputvalue: '',
          badinfo: [],
        }
        info.wdbadShow = false
      },
      copydf(e) {
        const input = document.createElement('textarea') // 创建input对象
        const link = document.querySelector('.content-df' + e) // 获取需要复制文字的容器
        input.value = link.innerText // 设置复制内容
        document.body.appendChild(input) // 添加临时实例
        input.select() // 选择实例内容
        document.execCommand('Copy') // 执行复制
        document.body.removeChild(input) // 删除临时实例
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      copyTemplate(text) {
        this.useTemplate = false
        this.chatText = text
        // this.$nextTick(() => {
        //  const useTemplateEl = document.getElementById('useTemplate')
        //  useTemplateEl.innerHTML = ''
        //  let arrayText = text.split(/\[([^\]]*)\]/g);
        //  let result = [];
        //  for(let i=0; i<arrayText.length; i++){
        //    if(arrayText[i] !== ""){
        //      result.push(arrayText[i]);
        //    }
        //  }
        //  console.log(result, arrayText);
        //  if(text.indexOf("[") === 0) {
        //    result.forEach((item, i) => {
        //      const index = i + 1
        //      if(index%2 === 0) {
        //        const span = document.createElement('span')
        //        span.setAttribute('style', 'display: inline-block;')
        //        span.innerText = item;
        //        useTemplateEl.appendChild(span)
        //      } else {
        //        const input = document.createElement('input') // 创建input对象
        //        // 设置input的属性
        //        input.setAttribute('class', 'can-edit')
        //        input.value = item
        //        input.style.width = (input.value.length * 16 + 10) + 'px'
        //        useTemplateEl.appendChild(input)
        //      }
        //    })
        //  } else if(text.indexOf("[") > 0) {
        //    result.forEach((item, i) => {
        //      const index = i + 1
        //      if(index%2 === 0) {
        //        const input = document.createElement('input') // 创建input对象
        //        // 设置input的属性
        //        input.setAttribute('class', 'can-edit')
        //        input.value = item
        //        input.style.width = (input.value.length * 16 + 10) + 'px'
        //        useTemplateEl.appendChild(input)
        //      } else {
        //        const span = document.createElement('span')
        //        span.setAttribute('style', 'display: inline-block;')
        //        span.innerText = item;
        //        useTemplateEl.appendChild(span)
        //      }
        //    })
        //  }
        // })

      },
      copyQuestionTemplate(item) {
        if (item.url) {
          window.open(item.url,'_blank')
        } else {
          this.useTemplate = false
          this.chatText = item.content
        }
      },
      addHistory(data) {
        // 保存问题和答案

        // console.log("params", data)
        const x = fetch("http://10.20.13.201:80/smiling/education/add/history", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;',
            "X-User-ID": Cookies.get('user_id'),
          },
          body: JSON.stringify(data),
        }).then(res=>res.json()).then(data=> {
        })
      },
      getHistory() {
        let that = this
        // console.log(that.chatData)
        this.chatData = []
        let item = {
          query: '',
          loading: true,
          time: '',
          QuestionAndAnswer: {},
          wdbadShow: false,
          wdpj: '',
          wdpjinfo: {},
          showChart: false,
          wdbadpjinfo: {
            inputvalue: '',
            badinfo: [],
          },
          responseText: '',
          responseMdText: '',
          response_status: '',
        }
        const params = new URLSearchParams();
        params.append('chat_no', 1);
        fetch(`https://officechat.emic.edu.cn/smiling/education/list/history?${params}`, {
          // fetch('http://39.106.131.95:9002/education/insertWriteFeedback', {
          method: 'get',
          headers: {
            "X-User-ID": Cookies.get('user_id'),
          }
        }).then(response => response.json())
            .then(data =>{

              data.data.forEach((item2,index) => {
                item.responseMdText = this.getMarkdown().render(item2.answer) ;
                // item.responseMdText = item.responseMdText.replace(/<think>/g, '<think id="think-'+index+'" class="scroll tip"" >');
                // item.responseMdText = item.responseMdText.replace(/<\/think><\/p>/g, '</p></think>');
                item.responseText =item2.answer;
                item.time = item2.create_time;
                item.query = item2.question;
                item.loading = false;
                item.loadings = false;
                item.response_status = "loading";
                item.wdbadShow = false;
                that.chatData.push(item);
                that.chatData = JSON.parse(JSON.stringify(that.chatData));
                // console.log(that.chatData)
              })
            })
            .catch(error => console.error('Error:', error));
      },
    }
  }
</script>
<style>
  @import '../css/search.css';
  @import '../css/unpkg.com_element-ui@2.15.13_lib_theme-chalk_index.css';
  #useTemplate {
    width: 100%;
    margin-right: 10px;
    height: 44px;
    border: 1px solid #ccc;
    border-radius: 4px;
    line-height: 44px;
    padding: 0 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  #useTemplate .can-edit {
    display: inline-block;
    width: 100%;
    border: 0;
    height: 30px;
    background-color: #E5F9FE;
  }

  #useTemplate .can-edit:focus-visible {
    border: none;
    outline: none;
  }

  .tip .tip_text {
    color: #aaa;
    font-size: 14px;
  }

  .select_url {
    /* width: 100px; */
    width: 108px;
  }

  .select_url .el-input__inner {
    /* width: 100px; */
    width: 108px;
  }

  #imgScaleBox {
    /* 使用绝对定位实现垂直水平居中 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }

  #imgScale {
    position: relative;
    z-index: 9999;
    max-width: 1920px;
    transform: scale(0.5)
  }

  .flex-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon-img {
    width: 35px;
  }
  .icon-font {
    text-align:right;
    font-size:12px;
  }
  .markdown-table {
      width: 100%;
      border-collapse: collapse;
  }
  .markdown-table th, .markdown-table td {
      border: 1px solid #ddd; /* 灰色边框 */
      text-align: left;
      padding: 8px;
  }
  .markdown-table th {
      background-color: #ecf3fc; /* 表格头部背景色 */
  }
</style>
