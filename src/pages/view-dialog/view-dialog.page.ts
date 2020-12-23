import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FolderPage } from './../../app/folder/folder.page';
import { API_URL, WS_URL } from '../../variables/constants';
import { User } from 'src/model/User';
import { AlertController } from '@ionic/angular';
import * as SockJS from '../../scripts/sockjs.min';
import * as StompModule from '../../scripts/stomp.umd.min';
import axios from 'axios';

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

  constructor(private alertCtrl: AlertController, private route: ActivatedRoute) {
    var name = route.snapshot.params.name;
    this.name = name;

    axios.get(`${API_URL}/users/getMessageKey/${localStorage.getItem('jwt')}`)
      .then(response => {
        this.messageKey = response.data.key;
        this.initWS();
      })
      .catch(err => this.showAlert(err));
  }

  ionViewWillLeave(): void {
    this.disconnect();
  }

  initWS(): void {
    if(FolderPage.user.dialogs[this.name].key != 0) {
      FolderPage.user.dialogs[this.name].key = 0;
      axios.post(`${API_URL}/users/markDialogAsSeen`, {
        jwt: localStorage.getItem('jwt'),
        dialogName: this.name
      })
      .catch(err => this.showAlert(err));
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

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
