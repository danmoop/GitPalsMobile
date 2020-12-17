import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FolderPage } from './folder/folder.page';
import { API_URL } from './../variables/constants';
import { Router } from '@angular/router';
import { User } from '../model/User';

import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isDarkTheme: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.splashScreen.hide();
    });

    var theme = localStorage.getItem('preferred-theme');

    this.isDarkTheme = theme == 'dark';

    if(localStorage.getItem('preferred-theme') == null) {
      localStorage.setItem('preferred-theme', 'light');
    }

    document.body.setAttribute('color-theme', theme);
  }

  signIn(): void {
    this.alertCtrl.create({
      header: 'Sign In',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username'
        },
        {
          name: 'key',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            axios.post(`${API_URL}/auth/login`, {
              username: data.username,
              password: data.key
            }).then(response => {
              if(response.data.status != null && response.data.status == 'FAILED') {
                this.showAlert('Invalid Credentials');
              } else {
                const jwt = response.data.jwt;
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('authKey', data.key);

                axios.post(`${API_URL}/auth/get`, {token: jwt})  
                  .then(response => {
                    var user = response.data;

                    if(!user.banned) {
                      FolderPage.user = user;
                      this.showAlert('Authenticated!');
                    } else {
                      this.showAlert('You are banned');
                    }
                  })
                  .catch(err => this.showAlert(err));
              }
            })
            .catch(err => this.showAlert(err));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).then(alert => alert.present());
  }

  logOut(): void {
    localStorage.clear();
    FolderPage.user = null;

    this.router.navigateByUrl('/', { replaceUrl: true });

    this.showAlert('You logged out');
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['Ok']
    }).then(alertMsg => alertMsg.present());
  }

  changeTheme(event): void {
    if(event.target.checked) {
      localStorage.setItem('preferred-theme', 'dark');
    } else {
      localStorage.setItem('preferred-theme', 'light');
    }
    document.body.setAttribute('color-theme', localStorage.getItem('preferred-theme'));
  }

  get user(): User {
    return FolderPage.user;
  }

  get numberOfUnreadMessages(): number {
    var res = 0;
    var dialogs = Object.keys(FolderPage.user.dialogs);

    for(var i = 0; i < dialogs.length; i++) {
      res += FolderPage.user.dialogs[dialogs[i]].key;
    }

    return res;
  }

  get numberOfUnreadNotifications(): number {
    return FolderPage.user.notifications.key;
  }
}