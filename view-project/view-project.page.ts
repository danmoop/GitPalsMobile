import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from './../src/variables/constants';
import { AlertController } from '@ionic/angular';
import { FolderPage } from './../src/app/folder/folder.page';
import axios from 'axios';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.page.html',
  styleUrls: ['./view-project.page.scss'],
})
export class ViewProjectPage {

  project = null;

  constructor(private route: ActivatedRoute, private alertCtrl: AlertController) {
    var projectName = route.snapshot.params.project;

    axios.get(`${API_URL}/search/findByTitle/${projectName}`)
      .then(response => this.project = response.data)
      .catch(err => this.showAlert(err));
  }

  showAlert(msg) {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  get user() {
    return FolderPage.user;
  }

  apply() {
    axios.post(`${API_URL}/projects/changeApplicationToAProject`, {
      jwt: localStorage.getItem('jwt'),
      projectName: this.project.title
    }).then(response => {
      var index = this.project.usersSubmitted.indexOf(this.user.username);
      if(index == -1) {
        this.project.usersSubmitted.push(this.user.username);
      } else {
        this.project.usersSubmitted.splice(index, 1);
      }
    })
    .catch(err => this.showAlert(err));
  }
}