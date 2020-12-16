import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from '../../variables/constants';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FolderPage } from './../../app/folder/folder.page';
import axios from 'axios';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.page.html',
  styleUrls: ['./view-project.page.scss'],
})
export class ViewProjectPage {

  project: any;
  projectName: string;

  constructor(
      private route: ActivatedRoute, 
      private alertCtrl: AlertController,
      private actionCtrl: ActionSheetController,
      private router: Router
    ) {
    this.projectName = route.snapshot.params.project;
  }
  
  ionViewDidEnter() {
    axios.get(`${API_URL}/projects/get/${this.projectName}`)
      .then(response => {
        this.project = response.data;
      })
      .catch(err => this.showAlert(err))
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

  refreshProjectInfo(event) {
    axios.get(`${API_URL}/projects/getById/${this.project.id}`)
      .then(response => {
        this.project = response.data;
        event.target.complete();
      })
      .catch(err => this.showAlert(err));
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
            if(data.text.trim() != '') {
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
            } else {
              this.showAlert("Comment text can't be empty!");
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }

  removeComment(comment) {
    this.alertCtrl.create({
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            axios.post(`${API_URL}/projects/removeComment`, {
              jwt: localStorage.getItem('jwt'),
              projectName: this.project.title,
              commentText: comment.text
            })
            .then(response => {
              if(response.data.status == 'OK') {
                var commentIndex = this.project.comments.indexOf(comment);
                if(commentIndex != -1) {
                  this.project.comments.splice(commentIndex, 1);
                }
              }
            });
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
  }

  openActionSheet() {
    this.actionCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'create-outline',
          handler: () => {
            this.editProject();
          }
        },
        {
          text: 'Delete Project',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeProject();
          }
        }
    ]
    }).then(alert => alert.present());
  }

  removeProject() {
    this.alertCtrl.create({
      header: 'Remove project',
      message: "Are you sure?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            axios.post(`${API_URL}/projects/deleteProject`, {
              jwt: localStorage.getItem('jwt'),
              projectName: this.project.title
            }).then(response => {
              if(response.data.status == 'OK') {
                this.router.navigateByUrl('/', { replaceUrl: true });
              }
            })
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
  }

  editProject() {
    this.router.navigateByUrl(`/edit-project/${this.project.id}`);
  }
}