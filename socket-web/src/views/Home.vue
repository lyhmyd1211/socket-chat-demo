<template>
  <div id="app">
    <ul id="messages"></ul>
    <input placeholder="请输入用户名" v-model="userName" />
    <button @click="start">咨询</button>
    <form>
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
      inputData: ''
    }
  },
  beforeCreate() {

  },
  methods: {
    start() {

      socket.emit('waiting', this.userName)
    },
    submit() {
      socket.emit(this.userName, this.inputData)
    }
  }
}
</script>
<style lang="scss" scoped>
#app {
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
