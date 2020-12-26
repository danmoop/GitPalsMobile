import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FolderPage } from 'src/app/folder/folder.page';
import { User } from 'src/model/User';
import { API_URL } from 'src/variables/constants';
import { AlertController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-publish-forum-post',
  templateUrl: './publish-forum-post.page.html',
  styleUrls: ['./publish-forum-post.page.scss'],
})
export class PublishForumPostPage {

  title: string = '';
  description: string = '';

  constructor(private alertCtrl: AlertController, private router: Router) {}

  get user(): User {
    return FolderPage.user;
  }

  publish(): void {
    if(this.title.trim() == '' || this.description.trim() == '') {
      this.showAlert('All fields are required to be filled in!');
    } else {
      axios.post(`${API_URL}/forum/addForumPost`, {
        jwt: localStorage.getItem('jwt'),
        title: this.title,
        description: this.description
      }).then(response => {
        this.router.navigateByUrl(`/view-forum-post/${response.data.key}`, {replaceUrl: true});
      }).catch(err => this.showAlert(err));
    }
  }

  showAlert(msg): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}