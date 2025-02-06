<template>
  <div class="xzbox bin">
    <div class="xz-left">
      <div class="xz-left-title">
        <div class="xz-left-title-shuxian"></div>
        提问历史记录
      </div>
      <div class="xz-left-list">
        <div class="xz-left-list-item" v-for="(item,index) in jllist" :key="index" @click="huadong(item.query)">
          <p class="title">{{ item.query }}</p>
          <p class="time">{{ timestampToTime(item.queryId) }}</p>
        </div>
      </div>
    </div>
    <div class="xz-right">
      <div class="xz-right-main writer">
        <div class="dfxx">
          <img src="../img/kefu.jpg" class="img" alt="" />
          <div class="dfxx-right">
            <p class="dfxx-right-name">您好，我是写作小助手</p>
            <p class="dfxx-right-content">我可以帮您高效完成各类公文的撰写，助您省心省力，提升工作效率。</p>
            <div class="cnxw">
              <p class="cnxw-title">请试着这样问我</p>
              <div class="cnxw-content-box">
                <ul>
                  <li @click="send('你是教育公文写作专家，你的任务是基于问题进行不同类别公文的写作：写一篇教育部办公厅关于开展2023届高校毕业生秋季促就业攻坚行动的通知')">
                    写一篇教育部办公厅关于开展2023届高校毕业生秋季促就业攻坚行动的通知</li>
                  <li @click="send('你是教育公文写作专家，你的任务是基于问题进行不同类别公文的写作：写一篇教育部关于规范中小学生衣着规范的通知')">写一篇教育部关于规范中小学生衣着规范的通知</li>
                  <li @click="send('你是教育公文写作专家，你的任务是基于问题进行不同类别公文的写作：写一篇教育部办公厅关于做好2023年暑期校外培训治理有关工作的通知')">
                    写一篇教育部办公厅关于做好2023年暑期校外培训治理有关工作的通知
                  </li>
                  <li @click="send('你是教育公文写作专家，你的任务是基于问题进行不同类别公文的写作：写一篇关于举办2023年全国大学生校园足球夏令营活动的通知')">
                    写一篇关于举办2023年全国大学生校园足球夏令营活动的通知
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-if="ccloading" style="margin-top: 20px;" class="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <template v-if="xzlist.length">
          <div v-for="(item,index) in xzlist" :key="index">
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
                <img src="../img/kefu.jpg" class="img" alt="" />
                <div class="content" :class="'content-df'+ index"
                  style="display: flex;flex-direction: column;align-items: flex-start;">
                  <p>{{ item.response.output || '未找到该内容' }}</p>
                  <div style="width: 100%;display: flex;justify-content: flex-end;" class="duifangcontent"
                    v-if="item.copy">
                    <!-- <el-popover placement="top" trigger="hover">
                                                <p style="color: #ff7878;text-align: center;">做的不错</p>
                                                <div slot="reference" class="sjinfo-right-title-right-img"
                                                    :class="item.xiezuopj == 'good' ? 'sjinfo-right-title-right-img-active' : ''"
                                                    @click="xzhp(item,'good')" style="margin-top: 5px;">
                                                    <img src="img/haoping.png" alt="" />
                                                </div>
                                            </el-popover>
                                            <el-popover placement="top" trigger="hover"
                                                v-show="item.xiezuopj == 'bad'">
                                                <p style="color: #ff7878;text-align: center;max-width: 200px;">
                                                    {{ item.xiezuopjinfo.badReason || '' }}
                                                </p>
                                                <div slot="reference" class="sjinfo-right-title-right-img"
                                                    :class="item.xiezuopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''"
                                                    @click="xzcp(item,'bad')" style="margin-top: 5px;">
                                                    <img src="img/chaping.png" alt="" />
                                                </div>
                                            </el-popover>
                                            <el-popover placement="bottom-end" trigger="click"
                                                v-model="item.xiezuobadShow"
                                                v-show="item.xiezuopj == 'good' || item.xiezuopj == ''"
                                                @after-leave="xzcp(item,'bad')">
                                                <div class="cp-box" style="width: 425px;">
                                                    <div style="margin-bottom: 10px;">
                                                        <el-checkbox-group v-model="item.xiezuobadinfo.badxzinfo"
                                                            size="small">
                                                            <el-checkbox label="还不够好" border>还不够好</el-checkbox>
                                                            <el-checkbox label="与问题无关" border>与问题无关</el-checkbox>
                                                            <el-checkbox label="内容不准确" border>内容不准确</el-checkbox>
                                                            <el-checkbox label="没有帮助" border>没有帮助</el-checkbox>
                                                            <el-checkbox label="有害信息" border>有害信息</el-checkbox>
                                                            <el-checkbox label="我要吐槽" border>我要吐槽</el-checkbox>
                                                        </el-checkbox-group>
                                                    </div>
                                                    <el-input
                                                        :disabled="!item.xiezuobadinfo.badxzinfo.includes('我要吐槽')"
                                                        type="textarea" :autosize="{ minRows: 3, maxRows: 4}"
                                                        placeholder="请输入评价内容"
                                                        v-model="item.xiezuobadinfo.inputvalue">
                                                    </el-input>
                                                    <div
                                                        style="display: flex;justify-content: flex-end;margin-top: 10px;">
                                                        <el-button type="primary"
                                                            @click="item.xiezuobadShow = false">提交</el-button>
                                                    </div>
                                                </div>
                                                <div slot="reference" class="sjinfo-right-title-right-img"
                                                    :class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''"
                                                    style="margin-top: 5px;">
                                                    <img src="img/chaping.png" alt="" />
                                                </div>
                                            </el-popover>
                                            <el-tooltip content="一键复制" placement="top" effect="light">
                                                <div class="dfcontent-bot" @click="copydf(index)">
                                                    <img src="img/copy.png" alt=""
                                                        style="width: 21px;margin-right: 5px;" />
                                                </div>
                                            </el-tooltip> -->
                    <div class="sjinfo-right-title-right-img"
                      :class="item.xiezuopj == 'good' ? 'sjinfo-right-title-right-img-active' : ''"
                      @click="xzhp(item,'good')" style="margin-top: 5px;">
                      <img :src="item.xiezuopj == 'good' ? '../img/haoping-active.png' : '../img/haoping.png'" alt="" />
                    </div>
                    <div class="sjinfo-right-title-right-img" v-show="item.xiezuopj == 'bad'"
                      :class="item.xiezuopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''"
                      @click="xzcp(item,'bad')" style="margin-top: 5px;">
                      <img src="../img/chaping-active.png" alt="" />
                    </div>
                    <el-popover placement="bottom-end" trigger="click" v-model="item.xiezuobadShow"
                      v-show="item.xiezuopj == 'good' || item.xiezuopj == ''" @after-leave="xzcp(item,'bad')">
                      <div class="cp-box" style="width: 425px;">
                        <div style="margin-bottom: 10px;">
                          <el-checkbox-group v-model="item.xiezuobadinfo.badxzinfo" size="small">
                            <el-checkbox label="还不够好" border>还不够好</el-checkbox>
                            <el-checkbox label="与问题无关" border>与问题无关</el-checkbox>
                            <el-checkbox label="内容不准确" border>内容不准确</el-checkbox>
                            <el-checkbox label="没有帮助" border>没有帮助</el-checkbox>
                            <el-checkbox label="有害信息" border>有害信息</el-checkbox>
                            <el-checkbox label="我要吐槽" border>我要吐槽</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <el-input :disabled="!item.xiezuobadinfo.badxzinfo.includes('我要吐槽')" type="textarea"
                          :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入评价内容"
                          v-model="item.xiezuobadinfo.inputvalue">
                        </el-input>
                        <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                          <el-button type="primary" @click="item.xiezuobadShow = false">提交</el-button>
                        </div>
                      </div>
                      <div slot="reference" class="sjinfo-right-title-right-img"
                        :class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''"
                        style="margin-top: 5px;">
                        <img src="../img/chaping.png" alt="" />
                      </div>
                    </el-popover>
                    <div class="dfcontent-bot" @click="copydf(index)">
                      <img src="../img/copy.png" alt="" style="width: 21px;margin-right: 5px;" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
      <div class="xz-right-foot">
        <input v-model="questionValue" type="text" placeholder="请输入问题相关描述" @keydown.enter="send()" />
        <el-button :disabled="lock" @click="send()">发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  // import './../js/echarts.min.js';
  // import './../js/echarts-wordcloud.min.js';

  export default {
    data() {
      return {
        websocket: null,
        lock: false,
        xzlist: [],
        jllist: [],
        questionValue: '',
        ccloading: false,
        shenjiaopj: 'bad'
      }
    },
    created() {
      this.initWebSocket()
    },
    methods: {
      initWebSocket() {
        //初始化 
        this.ccloading = true
        this.websocket = new WebSocket('ws://10.40.241.6:7868/assistant');
        var that = this.websocket;
        that.onopen = this.websocketonopen;
        that.onerror = this.websocketonerror;
        that.onmessage = this.websocketonmessage;
        that.onclose = this.websocketclose;
      },
      websocketonopen() {
        console.log("WebSocket连接成功");
        this.ccloading = false
      },
      websocketonerror(e) {
        //错误
        console.log("WebSocket连接发生错误");
        this.ccloading = true
        this.initWebSocket()
      },
      websocketonmessage(e) {
        //数据接收  
        //处理逻辑
        var that = this
        that.xzlist[that.xzlist.length - 1].loading = false
        // console.log(e, JSON.parse(e.data))
        if (e.data) {
          const data = JSON.parse(e.data)
          if (data.msg == 'success') {
            that.lock = false
            that.xzlist[that.xzlist.length - 1].copy = true
            let info = new FormData();
            info.append('question', data.data.question);
            info.append('answer', data.data.output);
            // console.log(info)
            fetch('https://officechat.emic.edu.cn/education/insertQuestionAndAnswer', {
              // fetch('http://39.106.131.95:9002/education/insertQuestionAndAnswer', {
              method: 'PUT',
              body: info
            }).then(function (data) {
              return data.text()
            }).then(function (data) {
              var res = JSON.parse(data)
              that.xzlist[that.xzlist.length - 1].QuestionAndAnswer = res.data
            })
          }
          if (data.code == -1) {
            that.xzlist[that.xzlist.length - 1].response = null
          } else {
            that.xzlist[that.xzlist.length - 1].response = data.data
          }
        } else {
          that.xzlist[that.xzlist.length - 1].response = null
        }
        // 获取设置了滚动属性的div标签
        const div = document.getElementsByClassName('writer')[0];
        // 设置滚动的顶点坐标为滚动的总高度
        div.scrollTop = div.scrollHeight;
      },
      websocketclose(e) {
        //关闭 
        this.ccloading = true
        this.initWebSocket()
        console.log("connection closed (" + e.code + ")");
      },

      // 点击历史提问记录
      huadong(query) {
        var that = this
        const box1 = document.getElementsByClassName('writer')[0]
        const box = document.getElementsByClassName('writer')[0].getElementsByClassName('my-query')
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
      // 点击差评按钮
      xzcp(info, value) {
        var that = this
        console.log(info)
        info.xiezuobadShow = false
        if (info.xiezuopj == 'good') {
          let data = new FormData()
          data.append("id", info.xiezuopjinfo.id);
          data.append("feedback", value);
          if (info.xiezuobadinfo.badxzinfo.length > 0) {
            var yuanyin = []
            for (var i = 0; i < info.xiezuobadinfo.badxzinfo.length; i++) {
              if (info.xiezuobadinfo.badxzinfo[i] != '我要吐槽') {
                yuanyin.push(info.xiezuobadinfo.badxzinfo[i])
              }
            }
            if (info.xiezuobadinfo.inputvalue) {
              yuanyin.push(info.xiezuobadinfo.inputvalue)
            }
            data.append("badReason", yuanyin.join(';'))
          }
          fetch('https://officechat.emic.edu.cn/education/updateWriteFeedback', {
            // fetch('http://39.106.131.95:9002/education/updateWriteFeedback', {
            method: 'POST',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            info.xiezuopj = value
            info.xiezuopjinfo = res.data
          })
        } else if (info.xiezuopj == 'bad') {
          // var data = {
          // 	id: info.xiezuopjinfo.id,
          // }
          let data = new FormData()
          data.append("id", info.xiezuopjinfo.id)
          // fetch('http://39.106.131.95:9002/education/deleteWriteFeedback', {
          fetch('https://officechat.emic.edu.cn/education/deleteWriteFeedback', {
            method: 'DELETE',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            info.xiezuopj = ''
            info.xiezuopjinfo = {}
          })
        } else {
          let data = new FormData()
          data.append("questionId", info.QuestionAndAnswer.questionId)
          data.append("answerId", info.QuestionAndAnswer.answerId)
          data.append("feedback", value)
          if (info.xiezuobadinfo.badxzinfo.length > 0) {
            var yuanyin = []
            for (var i = 0; i < info.xiezuobadinfo.badxzinfo.length; i++) {
              if (info.xiezuobadinfo.badxzinfo[i] != '我要吐槽') {
                yuanyin.push(info.xiezuobadinfo.badxzinfo[i])
              }
            }
            if (info.xiezuobadinfo.inputvalue) {
              yuanyin.push(info.xiezuobadinfo.inputvalue)
            }
            data.append("badReason", yuanyin.join(';'))
          }
          fetch('https://officechat.emic.edu.cn/education/insertWriteFeedback', {
            // fetch('http://39.106.131.95:9002/education/insertWriteFeedback', {
            method: 'PUT',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            info.xiezuopj = value
            info.xiezuopjinfo = res.data
          })
        }
        info.xiezuobadinfo = {
          inputvalue: '',
          badxzinfo: [],
        }
        info.xiezuobadShow = false
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
      // 点击发送消息
      send(query) {
        let queryText = this.questionValue || query
        if (!queryText || this.lock || this.ccloading)
          return
        this.lock = true
        const that = this
        that.questionValue = ''
        let itemInfo = {
          query: queryText,
          loading: true,
          queryId: new Date().getTime(),
          response: null,
          copy: false,
          QuestionAndAnswer: {},
          xiezuopj: '',
          xiezuopjinfo: {},
          xiezuobadinfo: {
            inputvalue: '',
            badxzinfo: [],
          },
          xiezuobadShow: false,
        }
        that.xzlist.push(itemInfo)
        that.$nextTick(function () {
          const box = document.getElementsByClassName('writer')[0]
          console.log(box.clientHeight);
          box.scrollTop = box.scrollHeight
        })
        var jsondata = {
          "key": "af4dec3e015919abac0cd7390e16d5e3",
          "projectId": "1",
          "title": "tongzhi",
          "content_list": [queryText]
        }
        // jsondata.content_list.push(queryText)
        that.websocket.send(JSON.stringify(jsondata));
        if (!that.jllist.length) {
          that.jllist.push(itemInfo)
        } else {
          let item = that.jllist.find(item => {
            return item.query == itemInfo.query;
          });
          if (item == undefined) {
            that.jllist.push(itemInfo)
          }
        }
      },
    }
  }

</script>
<style>
  @import '../css/search.css';
  @import '../css/unpkg.com_element-ui@2.15.13_lib_theme-chalk_index.css';
/* 
  .xzbox {
    height: calc(100vh - 40px);
  } */

</style>
