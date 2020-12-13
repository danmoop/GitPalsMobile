import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FolderPage } from 'src/app/folder/folder.page';
import { API_URL } from 'src/variables/constants';
import { Router } from '@angular/router';
import { Project } from '../../model/Project';
import axios from 'axios';

@Component({
  selector: 'app-submit-project',
  templateUrl: './submit-project.page.html',
  styleUrls: ['./submit-project.page.scss'],
})
export class SubmitProjectPage {

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  project: Project = new Project();

  submit() {
    if(this.areFieldsValid()) {
      this.project.authorName = FolderPage.user.username;

      axios.post(`${API_URL}/projects/submitProject`, {
        jwt: localStorage.getItem('jwt'),
        project: this.project
      })
        .then(response => {
          if(response.data.status == 'OK') {
            this.router.navigateByUrl(`/view-project/${this.project.title}`, { replaceUrl: true });
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
            this.project.technologies.push(data.tech);
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
    || this.project.githubProjectLink.trim() == '' || this.project.technologies.length == 0
    || this.project.requiredRoles.length == 0) {
      return false;
    }

    return true;
  }
}