import { Component, OnInit } from '@angular/core';
import { FolderPage } from '../../app/folder/folder.page';
import { API_URL } from 'src/variables/constants';
import axios from 'axios';

@Component({
  selector: 'app-view-notifications',
  templateUrl: './view-notifications.page.html',
  styleUrls: ['./view-notifications.page.scss'],
})
export class ViewNotificationsPage implements OnInit {

  constructor() { }

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

  get notificationsLength() {
    return Object.keys(FolderPage.user.notifications.value);
  }

  deleteNotification(notification): void {

    axios.post(`${API_URL}/users/removeNotification`, {
      jwt: localStorage.getItem('jwt'),
      notificationKey: notification.key
    })
    // TODO: replace alert with AlertController
    .catch(err => alert(err));

    delete FolderPage.user.notifications.value[notification.key];
  }
}
