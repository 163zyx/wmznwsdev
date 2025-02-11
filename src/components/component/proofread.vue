<template>
  <div id="app">
    <!-- 判断fileInfo如果是空的话就显示上传文件组件 -->
    <template v-if="isEmpty(fileInfo)">
      <div class="sjbox bin" v-loading="loading">
        <el-upload class="upload-demo" drag accept=".doc, .docx, .txt" :http-request="uploadBpmn"
          :before-upload="beforeUpload" action="#" :show-file-list="false">
          <div class="el-upload__text"><em style="color: #0052D9;">点击上传</em> / 将文件拖入此区域</div>
          <div class="el-upload__tip" slot="tip">文件支持docx、doc、txt，大小不得超过9M<br>免责声明：审校功能使用的为外部网络接口，请勿上传涉密文件。</div>
        </el-upload>
      </div>
    </template>
    <!-- 判断fileInfo如果不是空的话就显示文件审校结果 -->
    <template v-else>
      <div class="sjinfo bin">
        <div class="sjinfo-left-box">
          <div class="sjinfo-left" v-html="fileInfo.content"></div>
          <div class="yjcopy" @click="yjcopy">一键复制</div>
        </div>
        <div class="sjinfo-right">
          <div class="sjinfo-right-title">
            <div class="sjinfo-right-title-left-box">
              <div class="sjinfo-right-title-left"></div>
              校对结果
            </div>
            <div class="sjinfo-right-title-right-box">
              <!-- <el-popover placement="top" trigger="hover">
								<p style="color: #ff7878;text-align: center;">做的不错</p>
								<div slot="reference" class="sjinfo-right-title-right-img"
									:class="shenjiaopj == 'good' ? 'sjinfo-right-title-right-img-active' : ''"
									@click="sjhp('good')">
									<img src="img/haoping.png" alt="" />
								</div>
							</el-popover>
							<el-popover placement="top" trigger="hover" v-show="shenjiaopj == 'bad'">
								<p style="color: #ff7878;text-align: center;max-width: 200px;">
									{{ shenjiaopjinfo.badReason || '' }}
								</p>
								<div slot="reference" class="sjinfo-right-title-right-img"
									:class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''"
									@click="sjcp('bad')">
									<img src="img/chaping.png" alt="" />
								</div>
							</el-popover>
							<el-popover placement="bottom-end" trigger="click" v-model="badShow"
								v-show="shenjiaopj == 'good' || shenjiaopj == ''" @after-leave="sjcp('bad')">
								<div class="cp-box">
									<div style="margin-bottom: 10px;">
										<el-checkbox-group v-model="badinfo.badxzinfo" size="small">
											<el-checkbox label="还不够好" border>还不够好</el-checkbox>
											<el-checkbox label="内容不准确" border>内容不准确</el-checkbox>
											<el-checkbox label="没有帮助" border>没有帮助</el-checkbox>
											<el-checkbox label="我要吐槽" border>我要吐槽</el-checkbox>
										</el-checkbox-group>
									</div>
									<el-input :disabled="!badinfo.badxzinfo.includes('我要吐槽')" type="textarea"
										:autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入评价内容"
										v-model="badinfo.inputvalue">
									</el-input>
									<div style="display: flex;justify-content: flex-end;margin-top: 10px;">
										<el-button type="primary" @click="badShow = false">提交</el-button>
									</div>
								</div>
								<div slot="reference" class="sjinfo-right-title-right-img"
									:class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''">
									<img src="img/chaping.png" alt="" />
								</div>
							</el-popover> -->
              <div slot="reference" class="sjinfo-right-title-right-img"
                :class="shenjiaopj == 'good' ? 'sjinfo-right-title-right-img-active' : ''" @click="sjhp('good')">
                <img :src="shenjiaopj == 'good' ? require('../img/haoping-active.png') : require('../img/haoping.png')" alt="" />
              </div>
              <div class="sjinfo-right-title-right-img" v-show="shenjiaopj == 'bad'"
                :class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''" @click="sjcp('bad')">
                <img src="../img/chaping-active.png" alt="" />
              </div>
              <el-popover placement="bottom-end" trigger="click" v-model="badShow"
                v-show="shenjiaopj == 'good' || shenjiaopj == ''" @after-leave="sjcp('bad')">
                <div class="cp-box">
                  <div style="margin-bottom: 10px;">
                    <el-checkbox-group v-model="badinfo.badxzinfo" size="small">
                      <el-checkbox label="还不够好" border>还不够好</el-checkbox>
                      <el-checkbox label="内容不准确" border>内容不准确</el-checkbox>
                      <el-checkbox label="没有帮助" border>没有帮助</el-checkbox>
                      <el-checkbox label="我要吐槽" border>我要吐槽</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-input :disabled="!badinfo.badxzinfo.includes('我要吐槽')" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入评价内容" v-model="badinfo.inputvalue">
                  </el-input>
                  <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                    <el-button type="primary" @click="badShow = false">提交</el-button>
                  </div>
                </div>
                <div slot="reference" class="sjinfo-right-title-right-img"
                  :class="shenjiaopj == 'bad' ? 'sjinfo-right-title-right-img-active' : ''">
                  <img src="../img/chaping.png" alt="" />
                </div>
              </el-popover>
            </div>
          </div>
          <div class="sjinfo-yscw" v-if="yscwList && yscwList.length">
            <div class="sjinfo-yscw-title">
              <p>疑似错误（{{yscwList.length}}）</p>
              <el-select size="small" @change="yscwchange" style="width: 140px;" v-model="yscwValue" placeholder="请选择">
                <el-option v-for="item in yscwOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="background: #FFF9F9;" class="sjinfo-yscw-item" v-for="(item,index) in yscwList"
              :key="'ys'+index" @click="selectTs(item,'red')">
              <div style="background: rgba(255, 0, 0, 0.21);color: #FF0000;" class="sjinfo-yscw-item-errorci">
                {{ item.errWord }}</div>
              <p style="margin-right: 20px;">建议：{{ item.corWord.join(',') }}</p>
              <p><span style="color: #FF0000;">*</span>{{ item.inspectType }}</p>
              <div class="sjinfo-yscw-item-right">
                <img src="../img/tongbu.png" alt="" @click.stop="tongbu(item,'yscw')" />
                <img src="../img/del.png" alt="" @click.stop="delte(item,'yscw')" />
              </div>
            </div>
          </div>
          <div class="sjinfo-yscw" v-if="gztsList && gztsList.length">
            <div class="sjinfo-yscw-title">
              <p>关注提示（{{gztsList.length}}）</p>
              <el-select @change="gztschange" size="small" style="width: 140px;" v-model="gztsValue" placeholder="请选择">
                <el-option v-for="item in gztsOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="background: #F9FCFF;" class="sjinfo-yscw-item" v-for="(item,index) in gztsList"
              :key="'ys'+index" @click="selectTs(item,'blue')">
              <div style="background: rgba(77, 193, 244, 0.21);color: #4DC1F4;" class="sjinfo-yscw-item-errorci">
                {{ item.errWord }}</div>
              <p style="margin-right: 20px;">建议：{{ item.corWord.join(',') }}</p>
              <p><span style="color: #FF0000;">*</span>{{ item.inspectType }}</p>
              <div class="sjinfo-yscw-item-right">
                <img src="../img/tongbu.png" alt="" @click.stop="tongbu(item,'gzts')" />
                <img src="../img/del.png" alt="" @click.stop="delte(item,'gzts')" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        yscwOption: [],
        gztsOption: [],
        yscwList: [],
        gztsList: [],
        yscwValue: '',
        gztsValue: '',
        shenjiaopj: '',
        shenjiaopjinfo: {},
        badinfo: {
          inputvalue: '',
          badxzinfo: [],
        },
        badShow: false,
        fileInfo: {},
      }
    },
    mounted() {
      this.fileInfo = {}
      this.shenjiaopj = ''
      this.shenjiaopjinfo = {}
      this.badinfo = {
        inputvalue: '',
        badxzinfo: [],
      }
      this.badShow = false
    },
    methods: {
      // 判断对象是否为空
      isEmpty(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            return false;
          }
        }
        return true;
      },
      beforeUpload(file) { // 上传文件之前钩子
        if (file.size > 1024 * 1024 * 9) {
          this.$message({
            type: 'error',
            message: '文件大小不得超过9M！'
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
        // https://officechat.emic.edu.cn 正式
        // http://39.106.131.95:9002 测试
        fetch('https://officechat.emic.edu.cn/education/verify', {
          // fetch('http://39.106.131.95:9002/education/verify', {
          method: 'POST',
          body: formData,
        }).then(function (data) {
          that.loading = false
          return data.text()
        }).then(function (data) {
          that.loading = false
          var res = JSON.parse(data)
          if (res.code === 1001) {
            console.log(res)
            that.fileInfo = res.data
            that.gztsList = that.fileInfo.tipResult
            that.yscwList = that.fileInfo.wordResult
            if (that.gztsList && that.gztsList.length) {
              that.$nextTick(() => {
                that.gztsAddStyle()
              })
            }
            if (that.yscwList && that.yscwList.length) {
              that.$nextTick(() => {
                that.yscwAddStyle()
              })
            }
            if (that.fileInfo.wordViolateTypeList && that.fileInfo.wordViolateTypeList
              .length) {
              that.yscwOption = [{
                value: '全部',
                label: '全部提示（' + that.fileInfo.wordResult.length + '）',
              }]
              that.fileInfo.wordViolateTypeList.map(item => {
                that.yscwOption.push({
                  value: item,
                  label: item,
                })
              })
              that.yscwValue = that.yscwOption[0].value
            }
            if (that.fileInfo.tipViolateTypeList && that.fileInfo.tipViolateTypeList.length) {
              that.gztsOption = [{
                value: '全部',
                label: '全部提示（' + that.fileInfo.tipResult.length + '）',
              }]
              that.fileInfo.tipViolateTypeList.map(item => {
                that.gztsOption.push({
                  value: item,
                  label: item,
                })
              })
              that.gztsValue = that.gztsOption[0].value
            }
          } else {
            that.$message.error(res.msg);
          }
        }).catch(err => {
          that.$message.error(err);
        })
      },
      yjcopy() {
        const input = document.createElement('textarea') // 创建input对象
        const link = document.querySelector('.sjinfo-left') // 获取需要复制文字的容器
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
      // 点击好评按钮
      sjhp(value) {
        var that = this
        if (that.shenjiaopj == 'bad') {
          // var data = {
          // 	id: that.shenjiaopjinfo.id,
          // 	feedback: value
          // }
          let data = new FormData();
          data.append('id', that.shenjiaopjinfo.id);
          data.append('feedback', value);
          fetch('https://officechat.emic.edu.cn/education/updateShenJiaoFeedback', {
            // fetch('http://39.106.131.95:9002/education/updateShenJiaoFeedback', {
            method: 'POST',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            that.shenjiaopj = value
            that.shenjiaopjinfo = res.data
          })
        } else if (that.shenjiaopj == 'good') {
          // var data = {
          // 	id: that.shenjiaopjinfo.id,
          // }
          let data = new FormData();
          data.append('id', that.shenjiaopjinfo.id);
          fetch('https://officechat.emic.edu.cn/education/deleteShenJiaoFeedBack', {
            // fetch('http://39.106.131.95:9002/education/deleteShenJiaoFeedBack', {
            method: 'DELETE',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            that.shenjiaopj = ''
            that.shenjiaopjinfo = {}
          })
        } else {
          // var data = {
          // 	fileId: that.shenjiaopjinfo.id,
          // 	feedback: value
          // }
          let data = new FormData();
          data.append('fileId', that.fileInfo.id);
          data.append('feedback', value);
          fetch('https://officechat.emic.edu.cn/education/insertShenJiaoFeedback', {
            // fetch('http://39.106.131.95:9002/education/insertShenJiaoFeedback', {
            method: 'PUT',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            that.shenjiaopj = value
            that.shenjiaopjinfo = res.data
          })
        }
        that.badinfo = {
          inputvalue: '',
          badxzinfo: [],
        }
        that.badShow = false
      },
      // 点击差评按钮
      sjcp(value) {
        var that = this
        that.badShow = false
        if (that.shenjiaopj == 'good') {
          let data = new FormData()
          data.append('id', that.shenjiaopjinfo.id);
          data.append('feedback', value);
          if (that.badinfo.badxzinfo.length > 0) {
            var yuanyin = []
            for (var i = 0; i < that.badinfo.badxzinfo.length; i++) {
              if (that.badinfo.badxzinfo[i] != '我要吐槽') {
                yuanyin.push(that.badinfo.badxzinfo[i])
              }
            }
            if (that.badinfo.inputvalue) {
              yuanyin.push(that.badinfo.inputvalue)
            }
            data.append('badReason', yuanyin.join(';'));
          }
          // fetch('http://39.106.131.95:9002/education/updateShenJiaoFeedback', {
          fetch('https://officechat.emic.edu.cn/education/updateShenJiaoFeedback', {
            method: 'POST',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            that.shenjiaopj = value
            that.shenjiaopjinfo = res.data
          })
        } else if (that.shenjiaopj == 'bad') {
          // var data = {
          // 	id: that.shenjiaopjinfo.id,
          // }
          let data = new FormData();
          data.append('id', that.shenjiaopjinfo.id);
          fetch('https://officechat.emic.edu.cn/education/deleteShenJiaoFeedBack', {
            // fetch('http://39.106.131.95:9002/education/deleteShenJiaoFeedBack', {
            method: 'DELETE',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            that.shenjiaopj = ''
            that.shenjiaopjinfo = {}
          })
        } else {
          let data = new FormData()
          data.append('fileId', that.fileInfo.id);
          data.append('feedback', value);
          if (that.badinfo.badxzinfo.length > 0) {
            var yuanyin = []
            for (var i = 0; i < that.badinfo.badxzinfo.length; i++) {
              if (that.badinfo.badxzinfo[i] != '我要吐槽') {
                yuanyin.push(that.badinfo.badxzinfo[i])
              }
            }
            if (that.badinfo.inputvalue) {
              yuanyin.push(that.badinfo.inputvalue)
            }
            data.append('badReason', yuanyin.join(';'));
          }
          fetch('https://officechat.emic.edu.cn/education/insertShenJiaoFeedback', {
            // fetch('http://39.106.131.95:9002/education/insertShenJiaoFeedback', {
            method: 'PUT',
            body: data,
          }).then(function (data) {
            return data.text()
          }).then(function (data) {
            var res = JSON.parse(data)
            that.shenjiaopj = value
            that.shenjiaopjinfo = res.data
          })
        }
        that.badinfo = {
          inputvalue: '',
          badxzinfo: [],
        }
        that.badShow = false
      },
      // 点击删除
      delte(data, type) {
        var that = this;
        if (type == 'gzts') {
          for (var i = 0; i < that.gztsList.length; i++) {
            if (that.gztsList[i].pos == data.pos) {
              that.gztsList.splice(i, 1)
            }
          }
          for (var i = 0; i < that.fileInfo.tipResult.length; i++) {
            if (that.fileInfo.tipResult[i].pos == data.pos) {
              that.fileInfo.tipResult.splice(i, 1)
            }
          }
          var linkList = document.getElementsByTagName('a')
          for (var i = 0; i < linkList.length; i++) {
            if (data.pos == linkList[i].getAttribute('href')) {
              linkList[i].removeAttribute("style");
            }
          }
          that.gztsOption[0].label = '全部提示（' + that.fileInfo.tipResult.length + '）'
        }
        if (type == 'yscw') {
          for (var i = 0; i < that.yscwList.length; i++) {
            if (that.yscwList[i].pos == data.pos) {
              that.yscwList.splice(i, 1)
            }
          }
          for (var i = 0; i < that.fileInfo.wordResult.length; i++) {
            if (that.fileInfo.wordResult[i].pos == data.pos) {
              that.fileInfo.wordResult.splice(i, 1)
            }
          }
          var linkList = document.getElementsByTagName('a')
          for (var i = 0; i < linkList.length; i++) {
            if (data.pos == linkList[i].getAttribute('href')) {
              linkList[i].removeAttribute("style");
            }
          }
          that.yscwOption[0].label = '全部提示（' + that.fileInfo.wordResult.length + '）'
        }
      },
      // 点击页面上的校对结果
      selectTs(data, type) {
        console.log(data, type)
        var linkList = document.getElementsByTagName('a')
        for (var i = 0; i < linkList.length; i++) {
          if (data.pos == linkList[i].getAttribute('href')) {
            linkList[i].scrollIntoView({
              behavior: 'smooth'
            });
            if (type == 'red') {
              linkList[i].style.backgroundColor = 'rgba(255, 0, 0, 0.21)';
            } else {
              linkList[i].style.backgroundColor = 'rgba(255, 0, 0, 0.21)'
            }
          } else {
            linkList[i].style.backgroundColor = '#ffffff';
          }
        }
      },
      // 点击同步
      tongbu(data, type) {
        var that = this;
        var linkList = document.getElementsByTagName('a')
        for (var i = 0; i < linkList.length; i++) {
          if (data.pos == linkList[i].getAttribute('href') && data.corWord && data.corWord.length) {
            linkList[i].innerText = data.corWord[0];
          }
        }
        that.delte(data, type)
      },
      // 疑似错误下拉框点击选择
      yscwchange(e) {
        var that = this
        that.selectTs('', 'red')
        console.log(e)
        that.yscwList = []
        if (e == '全部') {
          that.yscwList = that.fileInfo.wordResult
        } else {
          that.fileInfo.wordResult.map(item => {
            if (item.inspectType == e) {
              that.yscwList.push(item)
            }
          })
        }
      },
      // 关注提示下拉框点击选择
      gztschange(e) {
        var that = this
        that.selectTs('', 'red')
        console.log(e)
        that.gztsList = []
        if (e == '全部') {
          that.gztsList = that.fileInfo.tipResult
        } else {
          that.fileInfo.tipResult.map(item => {
            if (item.inspectType == e) {
              that.gztsList.push(item)
            }
          })
        }
      },
      // 为有关注提示错误的正文添加样式
      gztsAddStyle() {
        var that = this
        var linkList = document.getElementsByTagName('a')
        for (var i = 0; i < that.gztsList.length; i++) {
          for (var a = 0; a < linkList.length; a++) {
            if (that.gztsList[i].pos == linkList[a].getAttribute('href')) {
              linkList[a].style.color = '#FF0000'
            }
          }
        }
      },
      // 为有疑似错误的正文添加样式
      yscwAddStyle() {
        var that = this
        var linkList = document.getElementsByTagName('a')
        for (var i = 0; i < that.yscwList.length; i++) {
          for (var a = 0; a < linkList.length; a++) {
            if (that.yscwList[i].pos == linkList[a].getAttribute('href')) {
              linkList[a].style.color = '#FF0000'
            }
          }
        }
      },
    }
  }

</script>
<style>
  @import '../css/search.css';
  @import '../css/unpkg.com_element-ui@2.15.13_lib_theme-chalk_index.css';

  .sjinfo {
    height: calc(100vh - 40px);
  }

</style>
