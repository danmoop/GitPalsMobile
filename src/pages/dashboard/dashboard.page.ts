import { Component } from '@angular/core';
import { FolderPage } from './../../app/folder/folder.page';
import { AlertController } from '@ionic/angular';
import { API_URL } from 'src/variables/constants';
import { User } from 'src/model/User';
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {

  constructor(private alertCtrl: AlertController) {}

  get user(): User {
    return FolderPage.user;
  }

  addNewSkill(): void {
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
            if(data.skill.trim() == '') {
              this.showAlert("Skill text shouldn't be empty!");
            } else {
              var obj = {
                jwt: localStorage.getItem('jwt'),
                skill: data.skill
              }
  
              axios.post(`${API_URL}/users/addNewSkill`, obj) 
                .then(response => {
                  FolderPage.user.skillList.push(data.skill);
                })
                .catch(err => this.showAlert(err));
            }
          }
        },
        'Cancel'
      ]
    }).then(alert => alert.present());
  }

  removeSkill(_skill): void {
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
            }).then(response => {})
            .catch(err => this.showAlert(err));
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
