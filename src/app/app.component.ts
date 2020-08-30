import { Component, ViewChild } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FolderPage } from './folder/folder.page';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user: any;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    var user = JSON.parse(localStorage.getItem('user'));

    if(user != null) {
      this.user = user;
    }
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
            axios.post('https://www.gitpals.com/api/auth/login', {
              username: data.username,
              password: data.key
            }).then(response => {
              if(response.data.status != null && response.data.status == 'FAILED') {
                this.showAlert('Invalid Credentials');
              } else {
                const jwt = response.data.jwt;
                this.showAlert('Authorized!');
                localStorage.setItem('jwt', jwt);

                axios.post('https://www.gitpals.com/api/auth/get', {token: jwt})  
                  .then(response => {
                    var user = response.data;

                    if(!user.banned) {
                      localStorage.setItem('user', JSON.stringify(user));
                      this.user = user;
                      FolderPage.user = user;
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
    this.user = null;
    FolderPage.user = null;

    this.showAlert('You logged out');
  }

  showAlert(msg) {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['Ok']
    }).then(alertMsg => alertMsg.present());
  }
}