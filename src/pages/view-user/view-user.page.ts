import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../model/User';
import { API_URL } from '../../variables/constants';
import { ActionSheetController, AlertController } from '@ionic/angular';
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
    private actionSheetCtrl: ActionSheetController) {
    let username = route.snapshot.params.username;

    axios.get(`${API_URL}/users/get/${username}`)
      .then(response => this.user = response.data)
      .catch(err => this.showAlert(err));
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}