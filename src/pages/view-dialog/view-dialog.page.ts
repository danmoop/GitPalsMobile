import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FolderPage } from './../../app/folder/folder.page';
import { WS_URL } from '../../variables/constants';
import * as SockJS from '../../scripts/sockjs.min';
import * as StompModule from '../../scripts/stomp.umd.min'

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.page.html',
  styleUrls: ['./view-dialog.page.scss'],
})

export class ViewDialogPage {
  name: string;
  stompClient: any;
  ws: any;
  message: string = '';

  constructor(private route: ActivatedRoute) {
    var name = route.snapshot.params.name;
    this.name = name;
    this.initWS();
  }

  initWS() {
    const serverUrl = WS_URL;
    this.ws = new SockJS(serverUrl);
    this.stompClient = StompModule.Stomp.over(this.ws);
    const that = this;

    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe(`/topic/messages/${localStorage.getItem('authKey')}`, (message) => {
        if (message.body) {
          const msg = JSON.parse(message.body);
          that.user.dialogs[that.name].value.push(msg);
        }
      });
    });
  }
  
  sendMessage() {
    this.stompClient.send("/app/messageTransmit", {}, JSON.stringify({'author': this.user.username, 'content': this.message, 'recipient':this.name, 'type':'REGULAR_MESSAGE'}));
    this.message = '';
  }

  get user() {
    return FolderPage.user;
  }
}