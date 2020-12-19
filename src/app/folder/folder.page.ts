import { Component } from '@angular/core';
import { API_URL } from './../../variables/constants';
import { AlertController } from '@ionic/angular';
import { Project } from 'src/model/Project';
import axios from 'axios';
import { User } from 'src/model/User';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {

  projects: Array<Project> = [];
  static user: User;

  constructor(
    private alertCtrl: AlertController
  ) {}

  ionViewDidEnter(): void {
    this.getProjects();
    this.getUser();
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
      .catch(err => this.showAlert(err));
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
