import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FolderPage } from './../../app/folder/folder.page';
import { API_URL, WS_URL } from '../../variables/constants';
import * as SockJS from '../../scripts/sockjs.min';
import * as StompModule from '../../scripts/stomp.umd.min';
import axios from 'axios';
import { User } from 'src/model/User';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.page.html',
  styleUrls: ['./view-dialog.page.scss'],
})

export class ViewDialogPage {
  name: string;
  stompClient: any;
  ws: any;
  messageKey: string;
  message: string = '';

  constructor(private route: ActivatedRoute) {
    var name = route.snapshot.params.name;
    this.name = name;

    axios.get(`${API_URL}/users/getMessageKey/${localStorage.getItem('jwt')}`)
      .then(response => {
        this.messageKey = response.data.key;
        this.initWS();
      });
  }

  initWS(): void {
    if(FolderPage.user.dialogs[this.name].key != 0) {
      FolderPage.user.dialogs[this.name].key = 0;
      axios.post(`${API_URL}/users/markDialogAsSeen`, {
        jwt: localStorage.getItem('jwt'),
        dialogName: this.name
      });
    }

    this.ws = new SockJS(WS_URL);
    this.stompClient = StompModule.Stomp.over(this.ws);

    this.stompClient.connect({}, frame => {
      this.stompClient.subscribe(`/topic/messages/${this.messageKey}`, (message) => {
        if (message.body) {
          const msg = JSON.parse(message.body);
          this.user.dialogs[this.name].value.push(msg);
        }
      });
    });
  }
  
  sendMessage(): void {
    this.stompClient.send("/app/messageTransmit", {}, JSON.stringify({'author': this.user.username, 'content': this.message, 'recipient':this.name, 'type':'REGULAR_MESSAGE'}));
    this.message = '';
  }

  disconnect(): void {
    this.ws.close();
  }

  get user(): User {
    return FolderPage.user;
  }
}