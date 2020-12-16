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
    });

    delete FolderPage.user.notifications.value[notification.key];
  }
}