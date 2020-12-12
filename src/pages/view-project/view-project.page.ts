import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from '../../variables/constants';
import { AlertController } from '@ionic/angular';
import { FolderPage } from './../../app/folder/folder.page';
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

    axios.get(`${API_URL}/projects/get/${projectName}`)
      .then(response => {
        this.project = response.data;
        console.log(this.project);
      })
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
    axios.post(`${API_URL}/projects/toggleApplicationToAProject`, {
      jwt: localStorage.getItem('jwt'),
      projectName: this.project.title
    }).then(response => {
      var userIndex = this.project.appliedUsers.indexOf(this.user.username);
      if(userIndex == -1) {
        this.project.appliedUsers.push(this.user.username);
        
        FolderPage.user.projectsAppliedTo.push(this.project.title);
      } else {
        this.project.appliedUsers.splice(userIndex, 1);

        var projectIndex = FolderPage.user.projectsAppliedTo.indexOf(this.project.title);
        FolderPage.user.projectsAppliedTo.splice(projectIndex, 1);
      }
    })
    .catch(err => this.showAlert(err));
  }

  writeComment() {
    this.alertCtrl.create({
      header: 'Comment',
      inputs: [
        {
          name: 'text',
          placeholder: 'Text goes here'
        }
      ],
      buttons: [
        {
          text: 'Send',
          handler: (data) => {
            var comment = {
              jwt: localStorage.getItem('jwt'),
              author: this.user.username,
              text: data.text,
              projectName: this.project.title
            }
            
            axios.post(`${API_URL}/projects/sendComment`, comment)
              .then(response => {
                if(response.data.status == 'OK') {
                  this.project.comments.push(comment);
                }
              })
          }
        }
      ]
    }).then(alert => alert.present());
  }
}