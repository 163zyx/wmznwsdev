<template>
  <div class="xzbox bin">
    <div v-if="showHistory" class="xz-left">
      <div class="xz-left-title">
        <div class="left">
          <div class="xz-left-title-shuxian"></div>
          提问历史记录
        </div>
        <div v-if="false" class="right" @click="onHideHistory">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="xz-left-list">
        <div class="xz-left-list-item" v-for="(item,index) in chatData" :key="index" @click="clickChatText(item.query)">
          <p class="title">{{ item.query }}</p>
          <p class="time">{{ timestampToTime(item.time) }}</p>
        </div>
      </div>
    </div>
    <div v-if="!showHistory" class="btn-show-history" @click="onShowHistory">
      查看提问历史记录
    </div>
    <div class="xz-right">
      <div class="xz-right-main chat">
        <div class="dfxx">
          <img src="../img/avatar.png" class="img" alt="" />
          <div class="dfxx-right">
            <div class="flex-part">
              <p class="dfxx-right-name">您好，我是政策问答 Bot</p>
            </div>
            <p class="dfxx-right-content">我可以基于政策文库使用人工智能语言模型回答您的问题。</p>
            <div class="cnxw">
              <p class="cnxw-title">请试着这样问我</p>
              <div class="cnxw-content-box">
                <ul>
                  <li v-for="(item, index) in contentBox" :key="index"  @click="copyTemplate(item.name)">
                    {{item.name}}
                  </li>
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
                        <div class="reference_part" style="font-size: 15px;line-height: 27px;">
                            <div v-if="item.reference.length>0">已阅读{{item.reference.length}}篇本地咨询<i class="el-icon-arrow-down" v-if="!item.showReference" style="margin-left: 20px; cursor: pointer" @click="item.showReference = !item.showReference"></i><i class="el-icon-arrow-up" v-if="item.showReference" style="margin-left: 20px; cursor: pointer" @click="item.showReference = !item.showReference"></i>
                            </div>
                            <template v-if="item.showReference">
                                <div class="reference" v-for="referenceItem in item.reference" @click="handleDetail(referenceItem)">
                                    <span>{{referenceItem.order_number}} 、</span><span v-html="referenceItem.content"></span><span class="source_text">{{referenceItem.category}}</span> <span style="margin-left: 10px">{{referenceItem.create_time}}</span>
                                </div>
                            </template>
                        </div>
                        <br/>
                        <div v-if="item.contentLoading" class="loading">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <p v-if="item.showChart" style="font-size: 15px;line-height: 27px;"></p>
                        <template  v-else>
                            <div style="white-space: pre-wrap;">
<!--                                <p style="font-size: 15px;line-height: 27px;"  v-html="item.response || '未找到该内容'"></p>-->
                                <p style="font-size: 15px;line-height: 27px;"  v-html="item.response"></p>
                            </div>
                        </template>
                        <br/>
                        <div v-if="item.contentNoEnd" class="stop_event" @click="stopSSE">停止生成</div>
                    </div>
                  </div>

                  <div v-show="item.showChart && item.type === 'bar'" :id="`chart${index}`" style="width: 600px;height:400px;"></div>
                  <div v-show="item.showChart && item.type === 'line'" :id="`chart${index}` + '0'" style="width: 600px;height:400px;"></div>

                  <div class="tip" v-if="item.chartData && item.chartData[0].data.dataSource">
                    <span class="tip_text">数据来源：{{item.chartData[0].data.dataSource}}</span>
                  </div>
                  <div class="tip" v-show="item.showChart">
                    <span class="tip_text">根据你的需求，我为你生成了相应图表，也可以生成与本图表相关的一些分析。</span>
                    <el-button type="text" @click="handleNeedCommend(item)">需要分析</el-button>
                  </div>
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
        <el-input v-else v-model="chatText" type="text" placeholder="请输入问题相关描述" @keydown.enter="sendChatOther()">
<!--          <el-select class="select_url" v-model="selectUrl" slot="prepend" placeholder="请选择">-->
<!--            <el-option label="年鉴数据" value="http://10.40.241.6:17862/glm/v2/chatdata?v=4&t=nj&q="></el-option>-->
<!--            &lt;!&ndash; el-option label="业务数据" value="http://10.40.241.6:17862/glm/v2/chatdata?v=4&t=jck&q="></el-option>-->
<!--            <el-option label="经济人口" value="http://10.40.241.6:17862/glm/v2/chatdata?v=4&t=jr&q="></el-option&ndash;&gt;-->
<!--            <el-option label="Auto" value="http://10.40.241.6:17862/glm/v3/chat?q="></el-option>-->
<!--          </el-select>-->
        </el-input>
        <el-button :disabled="chatLock" @click="sendChatOther()">发送</el-button>
      </div>

    </div>
    <div id="imgScaleBox" v-if="dialogVisible" @click="dialogVisible = false">
      <img id="imgScale" :src="image" alt="">
    </div>
  </div>
</template>
<script>
  import * as echarts from 'echarts';
  import ecStat from 'echarts-stat';
  import MarkdownIt from 'markdown-it';
  import { fetchEventSource } from '@microsoft/fetch-event-source';

  export default {
    data() {
      return {
        chatText: undefined,
        chatData: [],
        chatLock: false,
        useTemplate: false,
        shenjiaopj: '',
        selectUrl: 'http://10.40.241.6:17862/glm/v2/chatdata?v=4&t=nj&q=',
        // selectUrl: 'http://47.123.4.81:3389/glm/test?v=4&t=nj&q=',
        dialogVisible: false,
        image: '',
        AIList: [],
        contentBox: [{
              name: '请检索双减相关的政策并分析具体有哪些主要举措',
            },
            // {
            //   name: '当前上海普通高中在校生人数',
            // }, {
            //   name: '近五年黑龙江省小学入学人数',
            // },
            {
              name: '请检索教育评价改革相关的政策并分析具体有哪些主要举措',
            },
],
        // type: 'bar',
          showReference: false,
          eventSource: null,
        loading: false,
        abortController: null,

        showHistory: true,
      }
    },
    mounted() {
      const referenceData = sessionStorage.getItem('reference')
      if(referenceData) {
          this.chatData = JSON.parse(referenceData)
      }
        this.$nextTick(() => {
            var ref_links = document.querySelectorAll('.ref_link');

            // 为每个具有class=ref_link的元素添加点击事件监听器
            ref_links.forEach((link) => {
                link.addEventListener('click', (event) => {
                    // 在这里编写点击事件处理函数
                    event.preventDefault(); // 阻止默认行为，例如打开新窗口
                    this.handleDetail({
                        doc_id: event.target.id.split('&')[0],
                        indic: event.target.id.split('&')[1]})
                });
            });
        })
    },
      destroyed() {
        this.stopSSE()
      },
      methods: {
        handleDetail(item) {
            const obj = {
                id: item.doc_id,
                indice: item.indic,
            }
            const url = 'https://officechat.emic.edu.cn/new-official/#/policyinquiry'+"?"+this.obj2String(obj)

            this.$emit('goSearch', url)
        },
        // 将对象整理成字符串
        obj2String(obj) {
            let str = ''
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str += `${key}=${obj[key]}&`
                }
            }
            return str.slice(0, -1)
        },
        sendChatOther() {
            console.log(this.chatText)
            const params = {
                query: this.chatText,
                stream: true,
            }
            this.chatLock = true
            this.chatData.push({
                loading: true,
                showChart: false,
                response: '',
                reference: [],
                showReference: false,
                contentLoading: true,
                query: this.chatText,
                contentNoEnd: true,
                time: new Date().getTime()
            })
            var md = new MarkdownIt({
                html: true,
                linkify: true,
                typographer: true,
            });
            // 禁用默认的列表解析器
            md.disable('list');
            // 注册自定义渲染器
            md.renderer.rules.table_open = myTableRender;
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
            this.$nextTick(() => {
                document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
                    .scrollHeight
            })
            if(this.abortController) {
                this.abortController.abort()
            }
            function containsBrackets(str) {
                return /\【.*?\】/.test(str);
            }
            function extractBrackets(str) {
                return str.match(/\【.*?\】/g);
            }
            function replaceBrackets(str, newContent) {
                return str.replace(/\【.*?\】/g, newContent);
            }
            this.abortController = new AbortController()
          try{
              this.eventSource = fetchEventSource('https://officechat.emic.edu.cn/search/query', {
                  method: 'POST',
                  headers: {
                      "Content-Type": 'application/json',
                  },
                  openWhenHidden: true,
                  signal: this.abortController.signal,
                  body: JSON.stringify(params),
                  onopen: (event) => {
                      console.log(event, 'SSE在连接打开时被调用')
                      if(!event.ok) {
                          this.$message.warning('服务遇到问题，请重试')
                          this.stopSSE()
                      }
                  },
                  onmessage: (event) => {
                      const eventData = JSON.parse(event.data)
                      if(eventData.event === 'start') {
                          this.chatData[this.chatData.length -1].reference = eventData.data.reference
                          this.chatData[this.chatData.length -1].loading = false
                          this.chatData[this.chatData.length -1].showReference = true
                          this.chatData[this.chatData.length -1].contentNoEnd= true
                      } else if(eventData.event === 'message') {
                          this.chatData[this.chatData.length -1].showChart = false
                          this.chatLock = false
                          this.chatData[this.chatData.length -1].contentLoading = false
                          this.chatData[this.chatData.length -1].showReference = false
                          this.chatData[this.chatData.length -1].contentNoEnd= true
                          this.chatData[this.chatData.length -1].response = md.render(eventData.data.answer)
                          // console.log(containsBrackets(this.chatData[this.chatData.length -1].response))
                          if(containsBrackets(this.chatData[this.chatData.length -1].response)) {
                              console.log(extractBrackets(this.chatData[this.chatData.length -1].response))
                              let textList = extractBrackets(this.chatData[this.chatData.length -1].response)
                              textList.forEach((item, index) => {
                                  // this.chatData[this.chatData.length -1].response = this.chatData[this.chatData.length -1].response.replace(textList[textList.length-1], `<span class="ref_link" id=${textList[textList.length-1].split("+")[1].slice(0, -1)}>${textList[textList.length-1].charAt(1)}</span>`)
                                  if(item.includes('code')) {
                                      this.chatData[this.chatData.length -1].response = this.chatData[this.chatData.length -1].response.replace(item, item)
                                  } else {
                                      if(item.includes('&')) {
                                          this.chatData[this.chatData.length -1].response = this.chatData[this.chatData.length -1].response.replace(item, `<span class="ref_link" id=${item.split("+")[1].slice(0, -1)}>${item.split("+")[0].slice(1)}</span>`)
                                      } else {
                                          if(item.includes('+')) {
                                              let reference = this.chatData[this.chatData.length -1].reference.find(it => it.doc_id === item.split("+")[1].slice(0, -1))
                                              console.log(reference)
                                              if(reference && reference.hasOwnProperty('indic')) {
                                                  let indice = reference.indic
                                                  console.log(indice)
                                                  this.chatData[this.chatData.length -1].response = this.chatData[this.chatData.length -1].response.replace(item, `<span class="ref_link" id=${item.split("+")[1].slice(0, -1)}&${indice}>${item.split("+")[0].slice(1)}</span>`)
                                              }
                                          }
                                      }
                                  }
                              })

                          }
                      } else if(eventData.event === 'end') {
                          let text = md.render(this.chatData[this.chatData.length -1].response)
                          this.chatData[this.chatData.length -1].response = text
                          this.chatData[this.chatData.length -1].contentNoEnd= false
                          sessionStorage.setItem('reference', JSON.stringify(this.chatData))
                          console.log(text, this.chatData[this.chatData.length -1].response)
                          this.$nextTick(() => {
                              var ref_links = document.querySelectorAll('.ref_link');

                              // 为每个具有class=ref_link的元素添加点击事件监听器
                              ref_links.forEach((link) => {
                                  link.addEventListener('click', (event) => {
                                      // 在这里编写点击事件处理函数
                                      event.preventDefault(); // 阻止默认行为，例如打开新窗口
                                      this.handleDetail({
                                          doc_id: event.target.id.split('&')[0],
                                          indic: event.target.id.split('&')[1]})
                                  });
                              });
                          })
                          this.chatLock = false
                          this.stopSSE()
                          this.eventSource.close()
                      }
                      console.log(event,eventData);
                  },
                  onerror: (error) => {
                      console.log(error)
                      console.log('SSE抛出异常onerror')
                      this.chatLock = false
                      this.chatData[this.chatData.length -1].loading = false
                      this.chatData[this.chatData.length -1].contentLoading = false
                      this.chatData[this.chatData.length -1].showChart = false
                      this.chatData[this.chatData.length -1].contentNoEnd= false
                      this.$message.warning('服务遇到问题，请重试')
                      this.stopSSE()
                      this.eventSource.close()
                      throw new Error('SSE连接关闭')
                  },
                  onclose: () => {
                      throw new Error('SSE连接关闭')
                  }
              })
          } catch (error) {
              this.chatLock = false
              this.chatData[this.chatData.length -1].loading = false
              this.chatData[this.chatData.length -1].contentLoading = false
              this.chatData[this.chatData.length -1].showChart = false
              this.stopSSE()
          }

        },
        async stopSSE () {
            // 关闭业务，执行关闭sse数据接口
            this.chatLock = false
            this.chatData[this.chatData.length -1].loading = false
            this.chatData[this.chatData.length -1].contentLoading = false
            this.chatData[this.chatData.length -1].showChart = false
            this.chatData[this.chatData.length -1].contentNoEnd= false
            if (this.abortController) {
                console.log('SSE结束会话了')
                this.abortController.abort() // 结束会话
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
        if (echarts.getInstanceByDom(document.getElementById(elId))) {
          echarts.dispose(document.getElementById(elId));
        }
        var myChart = echarts.init(document.getElementById(elId));
        echarts.registerTransform(ecStat.transform.regression);
        myChart.setOption(option);
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
        }
        this.chatData.push(item)
        this.$nextTick(() => {
          document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
            .scrollHeight
        })
        this.useTemplate = false

        let d
        try {
          // 如果需要进行超时就在调用这个方法，fetchWithTimeout
          d = await this.fetchWithTimeout(this.selectUrl + value, {
            method: 'POST',
            timeout: 150000
          })
          d = await d.json()
          console.log(d)
        } catch (error) {
          console.error("超时错误：", error);
          item.loading = false
          this.$nextTick(() => {
            document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0]
              .scrollHeight
          })
          return
        }
        // fetch(`http://10.40.241.6:17862/glm/v2/recommend?q=${this.chatText}`, {
        //   method: 'POST'
        // }).then(function (data) {
        //     return data.text()
        // }).then(function (data) {
        //   var res = JSON.parse(data)
        //   item.AIList = res
        //   item.loadings = false
        // })
        var md = new MarkdownIt({
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
          item.response = aaa

        // const d = await (await fetch("http://47.123.4.81:3389/glm/chatdata?q=" + value, { method: 'POST' })).json()
        // item.response = d.choices && d.choices.length > 0 ? d.choices[0].message.content : ''
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

        this.chatLock = false
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
          }
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
        const d = await (await fetch("http://10.40.241.6:17862/glm/analyse?data=" + JSON.stringify(record
          .chartData[record.chartData.length - 1].data), {
          method: 'POST'
        })).json()

        var md = new MarkdownIt({
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
        this.chatLock = false
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

      },
      copyQuestionTemplate(item) {
        if (item.url) {
          window.open(item.url,'_blank')
        } else {
          this.useTemplate = false
          this.chatText = item.content
        }
      },
      onShowHistory() {
        this.showHistory = true;
        this.$emit('showHistoryChange', this.showHistory)
      },
      onHideHistory() {
        this.showHistory = false;
        this.$emit('showHistoryChange', this.showHistory)
      }
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
  .reference{
      cursor: pointer;
      font-size: 14px;
      color: #409EFF;
      line-height: 1.5;
      margin-top: 5px;
  }
  .reference_part{
    display: block;
    /*background-color: #f1f1f1;*/
    /*padding: 10px;*/
  }
  .source_text{
      border: 1px solid #409EFF;
      border-radius: 3px;
      padding: 0 5px;
      margin-left: 10px;
      color: #409EFF;
  }
  .ref_link{
      display: inline-block;
      box-sizing: border-box;
      line-height: 13px;
      height: 16px;
      font-size: 12px;
      cursor: pointer;
      color: #409EFF;
      border-radius: 3px;
      margin-top: -10px;
      position: relative;
      margin-left: 5px;
      top: -10px;
  }
  .ref_link::before{
      content: "[";
      display: inline-block;
  }
  .ref_link::after{
      content: "]";
      display: inline-block;
  }
  .stop_event {
      text-align: left;
      color: #409EFF;
      cursor: pointer;
      font-size: 14px;
  }
</style>

<style scoped>
.btn-show-history {
  width: 20px;
  white-space: normal;
  text-align: center;
  flex-shrink: 0;
  background: #025098;
  color: #fff;
  font-size: 13px;
  padding: 5px 4px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.xz-left-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.xz-left-title .left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.xz-left-title .right {
  padding: 0 10px;
  cursor: pointer;
}
</style>
