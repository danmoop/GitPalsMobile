import { Component } from '@angular/core';
import { API_URL } from './../../variables/constants';
import { AlertController, LoadingController } from '@ionic/angular';
import { Project } from 'src/model/Project';
import { User } from 'src/model/User';
import axios from 'axios';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {

  projects: Array<Project> = [];
  static user: User;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}

  ionViewDidEnter(): void {
    this.refreshData(null);
  }

  get user(): User {
    return FolderPage.user;
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  getProjects(): void {
    axios.get(`${API_URL}/projects/getAll`)
      .then(response => {
        this.projects = response.data.reverse();
      })
      .catch(err => this.showAlert(err));
  }

  getUser(): void {
    if(localStorage.getItem('jwt') != null) {
      axios.get(`${API_URL}/auth/getUserByJwt/${localStorage.getItem('jwt')}`)
      .then(response => {
        var user = response.data;

        if (!user.banned) {
          FolderPage.user = user;
        } else {
          this.showAlert('You are banned');
          localStorage.clear();
          FolderPage.user = null;
        }
      })
      .catch(err => {
        localStorage.removeItem('jwt');
        this.showAlert('Please sign in again');
      });
    }
  }

  refreshData(event): void {
    this.getUser();
    this.getProjects();
        
    if(event != null) {
      event.target.complete();
    }
  }
}