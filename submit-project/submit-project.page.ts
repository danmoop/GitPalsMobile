import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FolderPage } from 'src/app/folder/folder.page';
import { API_URL } from 'src/variables/constants';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-project',
  templateUrl: './submit-project.page.html',
  styleUrls: ['./submit-project.page.scss'],
})
export class SubmitProjectPage {

  project = {
    title: '',
    description: '',
    githubProjectLink: '',
    authorName: '',
    requirements: [],
    usersSubmitted: [],
    comments: [],
    requiredRoles: [],
    isPromoted: false
  };

  constructor(
    private alertCtrl: AlertController,
    private route: Router
  ) {}

  submit() {
    if(this.areFieldsValid()) {
      this.project.authorName = FolderPage.user.username;

      axios.post(`${API_URL}/projects/submitProject`, this.project)
        .then(response => {
          if(response.data.status == 'OK') {
            this.route.navigateByUrl(`/view-project/${this.project.title}`);
          }
        });
    } else {
      this.showAlert();
    }
  }

  addTech() {
    this.alertCtrl.create({
      header: 'Add',
      inputs: [
        {
          placeholder: 'Technology',
          name: 'tech'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            this.project.requirements.push(data.tech);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  addRole() {
    this.alertCtrl.create({
      header: 'Add',
      inputs: [
        {
          placeholder: 'Role',
          name: 'role'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            this.project.requiredRoles.push(data.role);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  showAlert() {
    this.alertCtrl.create({
      header: 'All fields are required',
      message: 'You should fill all the requirements!',
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  areFieldsValid() {
    if(this.project.title.trim() == '' || this.project.description.trim() == '' 
    || this.project.githubProjectLink.trim() == '' || this.project.requirements.length == 0
    || this.project.requiredRoles.length == 0) {
      return false;
    }

    return true;
  }
}