<template>
  <div id="app">
    <ul id="messages"></ul>
    <div class="box">
      <div>
        <input placeholder="请输入用户名" v-model="userName" />
        <button @click="start" v-if="status ==0">咨询</button>
        <button @click="breakClick">断开</button>
      </div>
      <div>
        <div v-for="(item, index) in chatList" :key="index">
          {{item.from}}:
          {{item.message}}
        </div>
      </div>
    </div>
    <div>
      <label>状态:</label>
      <span>{{status==0?'未连接':status==1?`排队中,当前还有${waiting_count}人正在排队`:`与客服: ${kefuName} 聊天中`}}</span>
    </div>
    <form v-if="status==2">
      <input id="m" autocomplete="off" v-model="inputData" />
      <button @click="submit">Send</button>
    </form>
  </div>
</template>


<script>
import io from 'socket.io-client'
const socket = io('http://localhost:8082');
export default {
  data() {
    return {
      userName: '',
      inputData: '',
      status: 0,
      kefuName: '',
      chatList: [],
      waiting_count: 0
    }
  },
  beforeCreate() {

  },
  methods: {
    submit() {
      let content = { from: this.userName, message: this.inputData }

      console.log('发送', this.userName, this.inputData);
      socket.emit(this.userName, content)
      // this.chatList.push(content)
    },
    breakClick() {

    },
    start() {
      socket.emit('waiting', this.userName)
      /**状态通信 */
      socket.on('status_' + this.userName, (data) => {
        this.status = data.status
        this.kefuName = data.kefu

        if (data.status == 2) {
          socket.emit('connectings', { kefuName: this.kefuName, userName: this.userName, userId: '', type: 'user_connect' })
          /**消息通信 */
          socket.on(this.userName, (msg) => {
            console.log('msg', msg);
            this.chatList.push(msg)
          })
        }

      })
      socket.on('waiting_count', (count) => {
        this.waiting_count = count
      })
    },

  },
  mounted() {



  }
}
</script>
<style lang="scss" scoped>
#app {
  .box {
    display: flex;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font: 13px Helvetica, Arial;
  }
  form {
    background: #000;
    padding: 3px;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  form input {
    border: 0;
    padding: 10px;
    width: 90%;
    margin-right: 0.5%;
  }
  form button {
    width: 9%;
    background: rgb(130, 224, 255);
    border: none;
    padding: 10px;
  }
  #messages {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  #messages li {
    padding: 5px 10px;
  }
  #messages li:nth-child(odd) {
    background: #eee;
  }
}
</style>
