import { Component, OnInit } from '@angular/core';
import { FolderPage } from './../src/app/folder/folder.page';
import { AlertController } from '@ionic/angular';
import axios from 'axios';
import { API_URL } from 'src/variables/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {

  constructor(
    private alertCtrl: AlertController
  ) { }

  get user() {
    return FolderPage.user;
  }

  addNewSkill() {
    this.alertCtrl.create({
      header: 'Add New Skill',
      inputs: [
        {
          name: 'skill',
          placeholder: 'New Skill'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            var obj = {
              jwt: localStorage.getItem('jwt'),
              skill: data.skill
            }

            axios.post(`${API_URL}/users/addNewSkill`, obj) 
              .then(response => {
                this.showAlert(response.data.status);
                FolderPage.user.skillList.push(data.skill);
              })
              .catch(err => this.showAlert(err));
          }
        },
        'Cancel'
      ]
    }).then(alert => alert.present());
  }

  removeSkill(_skill) {
    this.alertCtrl.create({
      message: `Are you sure you want to remove ${_skill}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            FolderPage.user.skillList.splice(FolderPage.user.skillList.indexOf(_skill), 1);

            axios.post(`${API_URL}/users/removeSkill`, {
              skill: _skill,
              jwt: localStorage.getItem('jwt')
            }).then(response => this.showAlert(response.data.status))
            .catch(err => this.showAlert(err));
          }
        },
        'No'
      ]
    }).then(alert => alert.present());
  }

  showAlert(msg) {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}