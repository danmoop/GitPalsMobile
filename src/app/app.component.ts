import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FolderPage } from './folder/folder.page';
import { API_URL } from './../variables/constants';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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
    private alertCtrl: AlertController,
    private router: Router,
    private iab: InAppBrowser
  ) {
    this.initializeApp();
  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });

    var theme = localStorage.getItem('preferred-theme');

    if(theme == null) {
      localStorage.setItem('preferred-theme', 'light');
    }

    this.isDarkTheme = theme == 'dark';

    document.body.setAttribute('color-theme', theme);
  
    this.platform.backButton.subscribe(() => {
      if(this.router.url == '/') {
        this.alertCtrl.create({
          header: 'Exit',
          message: 'Are you sure you want to exit?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                navigator['app'].exitApp();
              }
            },
            {
              text: 'No'
            }
          ]
        }).then(alert => alert.present());
      }
    });
  }

  signIn(): void {
    this.alertCtrl.create({
      header: 'Sign In',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Github Username'
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

                axios.get(`${API_URL}/auth/getUserByJwt/${jwt}`)  
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
          text: 'Get Password',
          handler: () => {
            this.alertCtrl.create({
              header: 'Message',
              message: '1. Go to gitpals.com\n2. Sign in via Github\n3. Set up your password in dashboard',
              buttons: [
                {
                  text: 'Open Gitpals.com',
                  handler: () => {    
                    this.iab.create(`https://www.gitpals.com/`);
                  }
                }
              ]
            }).then(alert => alert.present());
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
    localStorage.removeItem('jwt');
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
