var sc = require('socket.io')
var _ = require('underscore')
class socket {
  
  constructor(server) {
    this.io = sc(server)
    this.list = []
  }
  
  _remove(array, data, type) {
    return array.filter(i=>i[type] !=data)
  }

  getSocket(id) {
    return _.findWhere(this.io.sockets.sockets, {id});
  }

  connection() {

    let user = ''
    let kefu = ''

    /**建立连接 */
    this.io.on('connection', (socket)=>{
      // console.log('a user connected', socket.id);

      /**断开连接移出队列 */
      socket.on('disconnect', ()=> {
        // console.log('a user disconnected', socket.id);
        this.list = this._remove(this.list, socket.id,'id')
        // console.log('after_remove_cur',this.list);
      })

      /**进入等待列表 */
      socket.on('waiting', (msg) => {
        this.list.push({id:socket.id,name:msg})
        // console.log('waiting', this.list);
        user = this.getSocket(socket.id)
        /**设置等待状态 */
        user.emit('status_'+msg,{status:1,kefu:''})   
        this.io.sockets.emit('waiting_count',this.list.length)
        /**实时更新客服看到的用户列表 */
        socket.broadcast.emit('tokefu',this.list)
      })
      
      
      socket.on('connectings', (conn) => {
        console.log('连接', conn);
        if (conn.type=="first_connect") {
            /**改变用户聊天状态，并广播更新用户排队列表*/
        var userSocket = this.getSocket(conn.userId)
        userSocket.emit('status_'+conn.userName,{status:2,kefu:conn.kefuName})  
        this.list = this._remove(this.list, conn.userId, 'id')
        this.io.sockets.emit('waiting_count',this.list.length)
        console.log('移除',this.list);
        this.io.sockets.emit('tokefu',[])
        }
        
        // var curSocket = this.getSocket(socket.id)
        socket.on(conn.userName, (msg) => {
          console.log('接收到发送', msg);
          
          this.io.sockets.emit(conn.userName,msg)
        })
      })

      
    });
  }
  getList() {
    return this.list
  }
}
 
module.exports  = socket