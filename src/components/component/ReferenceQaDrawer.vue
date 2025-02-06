<script>
import {nextTick, reactive, ref} from '@vue/composition-api'
import {useDraggable, useWindowSize} from '@vueuse/core'
import referenceQA from "./referenceQA.vue";
import ReferenceQaNew from "./ReferenceQaNew.vue";

export default {
  components: {referenceQA, ReferenceQaNew},
  setup() {
    const {width, height} = useWindowSize()
    const rightEntryEl = ref(null)
    const {x, y, style} = useDraggable(rightEntryEl, {
      initialValue: {x: width.value - 100, y: height.value / 2 - 116 / 2},
    });
    const beforeTouchPos = reactive({
      x: 0,
      y: 0
    });
    const drawerVisible = ref(false);
    const showHistory = ref(true);
    const detailDialogVisible = ref(false);
    const detailUrl = ref('');

    const showDrawer = () => {
      drawerVisible.value = true;
    };
    const closeDrawer = () => {
      drawerVisible.value = false;
    };
    const handleGoSearch = (url) => {
      detailUrl.value = url;
      detailDialogVisible.value = true;
      nextTick(() => {
        // 获取 iframe 元素
        const iframe = document.querySelector('#detail-iframe');
        // 确保 iframe 加载完成后再操作其内容
        iframe.onload = function () {
          // 获取 iframe 内部的文档对象
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          // 获取 iframe 内部的特定类名元素
          const elementToHide = iframeDocument.querySelector('.el-page-header_back');
          // 隐藏该元素
          if (elementToHide) {
            elementToHide.style.display = 'none';
          }
        };
      })
    };
    const onShowHistoryChange = (val) => {
      showHistory.value = val;
    }
    const onMouseDown = () => {
      beforeTouchPos.x = x.value;
      beforeTouchPos.y = y.value;
    }
    const onMouseUp = () => {
      if (beforeTouchPos.x === x.value && beforeTouchPos.y === y.value) {
        showDrawer();
      }
    };

    return {
      rightEntryEl,
      drawerVisible,
      showHistory,
      detailDialogVisible,
      detailUrl,
      style,
      showDrawer,
      closeDrawer,
      handleGoSearch,
      onShowHistoryChange,
      onMouseUp,
      onMouseDown,
    }
  }
}
</script>

<template>
  <div class="container">
    <!--  左侧入口-->
    <div
      ref="rightEntryEl"
      :style="style"
      v-if="!drawerVisible"
      class="right-entry"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <img src="../img/chat-ai.png" alt=""/>
      <div>政 策</div>
      <div>问 答</div>
    </div>
    <el-drawer
      custom-class="reference-qa-drawer"
      title="政策问答"
      :visible.sync="drawerVisible"
      direction="rtl"
      :before-close="closeDrawer"
      :size="!showHistory ? 893 : 1230"
      append-to-body
      modal-append-to-body
    >
      <template v-slot:title>
        <span class="reference-qa-drawer-title">政策问答</span>
      </template>
      <div class="content-box">
        <reference-qa-new
          @goSearch="handleGoSearch"
          @showHistoryChange="onShowHistoryChange"
        />
      </div>
    </el-drawer>

    <el-dialog
      title="详情"
      :visible.sync="detailDialogVisible"
      destroy-on-close
      close-on-press-escape
      close-on-click-modal
      width="1200px"
      top="5vh"
      custom-class="reference-qa-detail-dialog"
    >
      <div v-if="detailDialogVisible" class="dialog-body">
        <iframe id="detail-iframe" :src="detailUrl"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.right-entry {
  position: fixed;
  width: 80px;
  font-size: 16px;
  font-weight: bold;
  white-space: normal;
  background: rgb(64, 7, 255);
  color: #fff;
  border-radius: 4px;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  z-index: 9999;
}

.right-entry img {
  width: 50px;
  object-fit: cover;
  display: block;
  margin: 0 auto 5px;
}

.content-box {
  padding: 15px;
  background: #F7F8FF;
  height: 100%;
}

.content-box >>> .xzbox {
  margin: 0;
  width: 100%;
  height: 100%;
}

.reference-qa-drawer-title {
  font-weight: bold;
  color: red;
}

#detail-iframe {
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 0;
}

.dialog-body {
  height: calc(90vh - 110px);
}
</style>
<style>
.reference-qa-drawer .el-drawer__header {
  height: 40px;
  margin-bottom: 20px;
}

.reference-qa-detail-dialog {
  max-width: 90%;
}
</style>
