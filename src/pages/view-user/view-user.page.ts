import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/User';
import { API_URL } from '../../variables/constants';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FolderPage } from 'src/app/folder/folder.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import axios from 'axios';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.page.html',
  styleUrls: ['./view-user.page.scss'],
})
export class ViewUserPage {

  user: User;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private iab: InAppBrowser,
    private actionCtrl: ActionSheetController) {
    let username = route.snapshot.params.username;

    axios.get(`${API_URL}/users/get/${username}`)
      .then(response => this.user = response.data)
      .catch(err => this.showAlert(err));
  }

  showAlert(msg: string): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  get auth(): User {
    return FolderPage.user;
  }

  viewGithubProfile(): void {
    this.iab.create(`https://github.com/${this.user.username}`);
  }
}
