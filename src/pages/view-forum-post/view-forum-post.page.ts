import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'src/variables/constants';

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

  constructor(private actionCtrl: ActionSheetController, private alertCtrl: AlertController, private route: ActivatedRoute) {
    var key = route.snapshot.params.key;

    axios.get(`${API_URL}/forum/getForumPostById/${key}`)
      .then(response => {
        this.post = response.data;
      })
      .catch(err => this.showAlert(err));
  }

  refreshForumInfo(event) {
    axios.get(`${API_URL}/forum/getForumPostById/${this.post.key}`)
      .then(response => {
        this.post = response.data;
        event.target.complete();
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
                  this.post.comments.push(response.data);
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

  editComment(comment) {
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
              }
            })
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
  
  get user() {
    return FolderPage.user;
  }
}