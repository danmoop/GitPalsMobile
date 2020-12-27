import { Component, OnInit } from '@angular/core';
import { FolderPage } from '../../app/folder/folder.page';
import { API_URL } from 'src/variables/constants';
import { AlertController } from '@ionic/angular';
import { User } from 'src/model/User';
import axios from 'axios';

@Component({
  selector: 'app-view-notifications',
  templateUrl: './view-notifications.page.html',
  styleUrls: ['./view-notifications.page.scss'],
})
export class ViewNotificationsPage implements OnInit {

  constructor(private alertCtrl: AlertController) { }

  ngOnInit(): void {

    /* If user has new unread messages, send a message to the server
       to tell that now they are read, so the badge with messages
       counter would dissapear from the notifications page
    */
    if(FolderPage.user.notifications.key != 0) {
      FolderPage.user.notifications.key = 0;

      axios.post(`${API_URL}/users/markNotificationsAsSeen`, {
        jwt: localStorage.getItem('jwt')
      });
    }
  }

  get notifications(): object[] {
    var res = [];
    
    var notifications = Object.keys(FolderPage.user.notifications.value);
    
    for(var i = 0; i < notifications.length; i++) {
      res.push(FolderPage.user.notifications.value[notifications[i]]);
    }

    // Show latest notification on top
    res.reverse();

    return res;
  }

  get notificationsLength(): number {
    return Object.keys(FolderPage.user.notifications.value).length;
  }

  deleteNotification(notification): void {

    axios.post(`${API_URL}/users/removeNotification`, {
      jwt: localStorage.getItem('jwt'),
      notificationKey: notification.key
    })
    .then(response => {
      if(response.data.status != 'OK') {
        this.showAlert(response.data.status);
      }
    })
    .catch(err => this.showAlert(err));

    delete FolderPage.user.notifications.value[notification.key];
  }

  showAlert(msg: string): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
