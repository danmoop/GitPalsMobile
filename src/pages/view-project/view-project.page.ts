import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from '../../variables/constants';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FolderPage } from './../../app/folder/folder.page';
import { User } from 'src/model/User';
import { Project } from 'src/model/Project';
import axios from 'axios';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.page.html',
  styleUrls: ['./view-project.page.scss'],
})
export class ViewProjectPage {

  project: Project = null;
  projectTitle: string;

  constructor(
      private route: ActivatedRoute, 
      private alertCtrl: AlertController,
      private actionCtrl: ActionSheetController,
      private router: Router
    ) {
    this.projectTitle = route.snapshot.params.projectTitle;
  }
  
  ionViewDidEnter(): void {
    if(this.project != null) {
      axios.get(`${API_URL}/projects/getById/${this.project.id}`)
      .then(response => {
        this.project = response.data;
      })
      .catch(err => this.showAlert(err))
    } else {
      axios.get(`${API_URL}/projects/getByTitle/${this.projectTitle}`)
      .then(response => {
        this.project = response.data;
      })
      .catch(err => this.showAlert(err))
    }
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  refreshProjectInfo(event): void {
    axios.get(`${API_URL}/projects/getById/${this.project.id}`)
      .then(response => {
        this.project = response.data;
        event.target.complete();
      })
      .catch(err => this.showAlert(err));
  }

  apply(): void {
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

  writeComment(): void {
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
                  this.project.comments.push(response.data);
                })
                .catch(err => this.showAlert(err));
            } else {
              this.showAlert("Comment text can't be empty!");
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }

  removeComment(comment): void {
    this.alertCtrl.create({
      header: 'Remove Comment',
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
              } else {
                this.showAlert(response.data.status);
              }
            })
            .catch(err => this.showAlert(err));
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
  }

  openProjectActionSheet(): void {
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

  openCommentActionSheet(comment): void {
    this.actionCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'create-outline',
          handler: () => {
            this.editComment(comment);
          }
        },
        {
          text: 'Delete Comment',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeComment(comment);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  removeProject(): void {
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
              } else {
                this.showAlert(response.data.status);
              }
            })
	     .catch(err => this.showAlert(err));
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
  }

  editComment(comment): void {
    this.alertCtrl.create({
      header: 'Edit',
      inputs: [
        {
          name: 'text',
          value: comment.text
        }
      ],
      buttons: [
        {
          text: 'Save',
          handler: (data) => {
            axios.post(`${API_URL}/projects/editProjectComment`, {
              jwt: localStorage.getItem('jwt'),
              projectName: this.project.title,
              text: data.text,
              commentKey: comment.key
            })
            .then(response => {
              if(response.data.status == 'OK') {
                comment.text = data.text;
                comment.edited = true;
              } else {
                this.showAlert(response.data.status);
              }
            })
          }
        }
      ]
    }).then(alert => alert.present());
  }

  editProject(): void {
    this.router.navigateByUrl(`/edit-project/${this.project.id}`);
  }

  get user(): User {
    return FolderPage.user;
  }
}
