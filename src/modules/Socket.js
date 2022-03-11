export class Socket {
    constructor(url){
        this.url = url;
        this.socket = new WebSocket(url)
    }

    send(data){
        this.socket.send(data);
    }

    onmessage(callback){
        this.socket.onmessage = (e) => {
            if(e) return callback(JSON.parse(e.data));
        } 
    }

    close(){
        this.socket.onclose = (e) => {
            if (e.wasClean) {
               console.log(`[close] Соединение закрыто чисто, код=${e.code} причина=${e.reason}`);
              } else {
               console.log('[close] Соединение прервано');
              }
        } 

    }

    open(callback){
        this.socket.onopen = (e) => {
            if(e) callback
        }
    }
    
}