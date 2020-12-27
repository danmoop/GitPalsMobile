import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'src/variables/constants';
import { User } from 'src/model/User';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FolderPage } from 'src/app/folder/folder.page';
import axios from 'axios';

@Component({
  selector: 'app-view-forum-post',
  templateUrl: './view-forum-post.page.html',
  styleUrls: ['./view-forum-post.page.scss'],
})
export class ViewForumPostPage {

  post: any;

  constructor(
    private actionCtrl: ActionSheetController, 
    private alertCtrl: AlertController, 
    private route: ActivatedRoute,
    private router: Router) {
    var key = route.snapshot.params.key;

    axios.get(`${API_URL}/forum/getForumPostById/${key}`)
      .then(response => {
        this.post = response.data;

        if(this.user != null && this.post.viewSet.indexOf(this.user.username) == -1) {
          axios.post(`${API_URL}/forum/addUserToViewSet`, {
            jwt: localStorage.getItem('jwt'),
            postKey: key
          }).then(response => {
            if(response.data.status != 'OK') this.showAlert(response.data.status);
          }).catch(err => this.showAlert(err));
        }
      })
      .catch(err => this.showAlert(err));
  }

  refreshForumInfo(event): void {
    axios.get(`${API_URL}/forum/getForumPostById/${this.post.key}`)
      .then(response => {
        this.post = response.data;
        event.target.complete();
      })
      .catch(err => this.showAlert(err));
  }

  showAlert(msg: string): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
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
                postKey: this.post.key
              }
              
              axios.post(`${API_URL}/forum/addComment`, comment)
                .then(response => {
                  let comment = response.data;
                  if(comment.key == undefined) {
                    this.showAlert('Unable to send a comment');
                  } else {
                    this.post.comments.push(comment);
                  }
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

  openPostActionSheet(): void {
    this.actionCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete Post',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removePost();
          }
        }
    ]
    }).then(alert => alert.present());
  }

  removePost(): void {
    this.alertCtrl.create({
      header: 'Delete',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            axios.post(`${API_URL}/forum/deleteForumPost`, {
              jwt: localStorage.getItem('jwt'),
              postKey: this.post.key
            }).then(response => {
              if(response.data.status == 'OK') {
                this.router.navigateByUrl('/forum', {replaceUrl: true});
              } else {
                this.showAlert(response.data.status);
              }
            }).catch(err => this.showAlert(err));
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
            axios.post(`${API_URL}/forum/editComment`, {
              jwt: localStorage.getItem('jwt'),
              postKey: this.post.key,
              commentText: data.text,
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
            .catch(err => this.showAlert(err));
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
            axios.post(`${API_URL}/forum/deleteComment`, {
              jwt: localStorage.getItem('jwt'),
              postKey: this.post.key,
              commentKey: comment.key
            })
            .then(response => {
              if(response.data.status == 'OK') {
                var commentIndex = this.post.comments.indexOf(comment);
                if(commentIndex != -1) {
                  this.post.comments.splice(commentIndex, 1);
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
  
  get user(): User {
    return FolderPage.user;
  }
}
