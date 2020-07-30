<template>
  <div id="app">
    <ul id="messages"></ul>
    <button @click="breakClick">断开</button>
    <div class="box">
      <input placeholder="请输入用户名" v-model="kefuName" />

      <div>
        <div v-for="(item, index) in chatList" :key="index">
          {{item.from}}:
          {{item.message}}
        </div>
      </div>
    </div>
    <div v-if="curUser">与用户： {{curUser}} 聊天中</div>
    <!-- <button @click="start">登记客服</button> -->
    <div
      v-for="(item, index) in waitingList"
      :key="index"
      class="list"
      @click="wClick(item)"
    >{{item.name}}</div>
    <form v-if="curUser">
      <input id="m" autocomplete="off" v-model="inputData" />
      <button @click="submit">Send</button>
    </form>
  </div>
</template>


<script>
import io from 'socket.io-client'
const socket = io('http://localhost:8082');
import Axios from 'axios'
export default {
  data() {
    return {
      kefuName: '',
      inputData: '',
      curUser: '',
      waitingList: [],
      chatList: [],
    }
  },
  beforeCreate() {

  },
  methods: {
    breakClick() {

    },
    submit() {
      let content = { from: this.kefuName, message: this.inputData }
      socket.emit(this.curUser, content)
      // this.chatList.push(content)
    },
    initData() {
      Axios.get('/socket/getWaitingList').then(res => {
        this.waitingList = res.data.list
      })
    },
    fetchData() {
      socket.on('tokefu', (msg) => {
        console.log('list', msg);
        this.waitingList = msg
      })

    },
    wClick(data) {
      this.curUser = data.name

      socket.emit('connectings', { kefuName: this.kefuName, userName: data.name, userId: data.id, type: 'first_connect' })
      socket.on(this.curUser, (msg) => {
        console.log('msg', msg);
        this.chatList.push(msg)
      })
    }
  },
  created() {
    this.initData()
    this.fetchData()
  }
}
</script>
<style lang="scss" scoped>
#app {
  .box {
    display: flex;
  }
  .list {
    cursor: pointer;
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
