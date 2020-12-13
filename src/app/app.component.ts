import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FolderPage } from './folder/folder.page';
import { API_URL } from './../variables/constants';

import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

   constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.splashScreen.hide();
    });
  }

  signIn() {
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
          placeholder: 'Auth key'
        }
      ],
      buttons: [
        {
          text: 'Ok',
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
                      localStorage.setItem('user', JSON.stringify(user));
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

  logOut() {
    localStorage.clear();
    FolderPage.user = null;

    this.router.navigateByUrl('/', { replaceUrl: true });

    this.showAlert('You logged out');
  }

  showAlert(msg) {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['Ok']
    }).then(alertMsg => alertMsg.present());
  }

  get user() {
    return FolderPage.user;
  }

  get numberOfUnreadMessages() {
    var res = 0;
    var dialogs = Object.keys(FolderPage.user.dialogs);

    for(var i = 0; i < dialogs.length; i++) {
      res += FolderPage.user.dialogs[dialogs[i]].key;
    }
    
    return res;
  }

  get numberOfUnreadNotifications() {
    return FolderPage.user.notifications.key;
  }
}