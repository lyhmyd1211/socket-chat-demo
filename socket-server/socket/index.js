var sc = require('socket.io')
class socket {
  
  constructor(server) {
    this.io = sc(server)
    this.list = []
  }
  
  _remove(array, data, type) {
    return array.filter(i=>i[type] !=data)
  }

  connection() {
    this.io.on('connection', (socket)=>{
      console.log('a user connected', socket.id);

      socket.on('disconnect', ()=> {
        console.log('a user disconnected', socket.id);
        this.list = this._remove(this.list, socket.id,id)
        console.log('cur',this.list);
      })


      socket.on('waiting', (msg)=> {
        this.list.push({id:socket.id,name:msg})
        console.log('cur', this.list);
      })
      if (this.list.length>0) {
        socket.on(this.list[0].name, (msg) => {
          this.io.emit()
        })
      }
    });
  }
}
 
module.exports  = socket