import { Component } from '@angular/core';
import axios from 'axios';
import { API_URL } from './../../variables/constants';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {

  projects = [];
  static user: any;

  constructor(
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    axios.get(`${API_URL}/projects/getAll`)
      .then(response => {
        this.projects = response.data;
      });

    if(localStorage.getItem('jwt') != null) {
      axios.post(`${API_URL}/auth/get`, {
        token: localStorage.getItem('jwt')
      })
      .then(response => {
        var user = response.data;

        if (!user.banned) {
          localStorage.setItem('user', JSON.stringify(user));
          FolderPage.user = user;
        } else {
          this.showAlert('You are banned');
        }
      })
      .catch(err => this.showAlert(err));
    }
  }

  get getUser() {
    return FolderPage.user;
  }

  alertCard(name) {
    console.log(name);
  }

  showAlert(msg) {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}