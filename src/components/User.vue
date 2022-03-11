<template>
  <div class="user">
    <button class="item" @click="openSocket">Open Socket</button>
    <input  class="item" type="text" v-model="inputValue"/>
    <button class="item" @click="sendMessage">Send message</button>
    <div :class="[showMessage ? 'visible' : 'hidden', 'message']">
        <div class="date">{{receiptTime}}</div>
        <div>{{message}}</div>
    </div>
  </div>
</template>

<script>
import {sendRequest} from '@/helpers/api';
import {Socket} from '@/modules/Socket'
import Toastify from 'toastify-js';
export default {
    /* eslint-disable */
  name: 'User',
  data: () => ({
    ws : null,
    accessToken: '',
    inputValue: '',
    showMessage: '',
    message: '',
    receiptTime: ''
  }),
  methods: {
    handleType(data){
        let {type,ok} = data

        if( type === "response" && ok ){
            this.createToastify('сервис по WebSocket',3000,'info');
        } else if(type === "inbox"){
           this.createToastify('Поступило новое сообщение (Открыть)',5000,'info',data.type);
        } else if(!ok){
           this.createToastify('Произошла ошибка при работе с сокетом',3000,'error');
        }
       
    },

    closeSocket(){
      this.ws.close()
    },
     openSocket () {
      let data = JSON.stringify({
       "id": 1,
       "access_token": this.accessToken
      })
      this.ws.send(data);
      this.ws.onmessage(this.handleType);
    },
    async sendMessage(){
    let data = {
    "message": this.inputValue,
    "recipient": "Wpt9X9N5t8K7",
    "subject": "test"
    };

    let response  = await sendRequest('noty/api/private/putInboxMessage',data);
    if(response.data.ok) this.createToastify("Сообщение отправлено",3000,"sucess");

  },

  async getLastMessage(){
    let data = {
    "access_token": this.accessToken,
    "unread_only": "false"
    };
    let response = await sendRequest('noty/api/v1/getInboxMessages',data);
    if(response) return response;
  },

  async getToken(){
    
    let data = {"credential": "79191234567","password": "test"};

    let response = await sendRequest('auth-back/api/v2/login', data);
    if ( response ) {
      this.accessToken = response.data.accessToken;
    } else {
      this.createToastify("Ошибка на сервере при получении токена",3000,'error');
    }

  }, 

  createToastify(text,time,type,options){

    let colors = {"info": "#d1e635","sucess" : "#90e33d",'error': "#e63737" };

    Toastify({
    text: text,
    close: true,
    duration: time,
    stopOnFocus: false,
    style: {
    background: colors[type] || "#d1e635",
     position:'absolute',
     right: '30px',
     top  :'0px',
     padding: '5px',
     width: '300px',
  },

  onClick: async () => {

      if(options && options === "inbox" ){
        let response =  await this.getLastMessage();
        if(response) {
          let {msg,dt} = response?.data?.items[0];
          this.message = msg;
          this.receiptTime = this.dateFormat(dt);
          this.showMessage = true;
          this.createToastify("Сообщение успешно загружено",2000,"sucess");
        }
        
      }
  } 
}).showToast();
  },

  dateFormat(date){
    let time = new Date(date)
    return `${time.toLocaleDateString('ru')}  ${time.getHours() + ':' + time.getMinutes()}` 
  }
    
  },
  mounted() {
      this.getToken();
  },

  created () {
    this.ws = new Socket("wss://charmium.ru/noty/notifications");
    this.ws.open(this.createToastify("Соединение c web sockets установленно",2000,'info'));
    this.ws.close();
  },

  
};
</script>

<style>
.item {
  margin-bottom: 20px;
}

.date {
  margin-bottom: 10px;
}

.message {
    width: 400px;
    height: 15vh;
    margin-top: 20px;
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;
}

.visible {
  visibility: visible;
}

.hidden {
  visibility: hidden;
}

.user {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
