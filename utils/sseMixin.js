// sseMixin.js
import {SSE} from "sse.js";

export default {
  data() {
    return {
      sseMessages: [],
      eventSource: null,
      sseError: ''
    };
  },
  methods: {
    initSSE(url, data) {
      this.sseMessages = [];
      this.sseError = '';
      if (data) {
        console.log("data", data)
        this.eventSource = new SSE(url, {
          payload: JSON.stringify(data),
          debug: true,
          headers: {
            'Authorization': 'Bearer app-MZtc1HrKa4mPEYPJh1JaJHDB', // 替换为实际的授权令牌
            'Content-Type': 'application/json',
          }
        });
      } else {
        this.eventSource = new SSE(url, {
          debug: true,
          headers: {
            'Authorization': 'Bearer app-MZtc1HrKa4mPEYPJh1JaJHDB', // 替换为实际的授权令牌,
            'Content-Type': 'application/json',
          }
        });
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // console.log('---------------onmessage:', data)
          if (data) this.sseMessages.push(data);
            // console.log("data.answers",data.answer)
          // if (data) this.sseMessages.push(data);
        } catch (e) {
          // ignore
        }
      };

      this.eventSource.onopen = (event) => {
        // onopen
      };

      this.eventSource.onerror = (event) => {
        if (event.responseCode !== 200) {
          try {
            const errorData = JSON.parse(event.data) || {};
            this.sseError = errorData.detail;
          } catch (e) {
            this.sseError = 'http error: ' + event.responseCode;
          }
        }
        console.error('SSE error:', event);
        this.closeSSE();
      };
    },
    closeSSE() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  },
  beforeDestroy() {
    this.closeSSE();
  }
};
