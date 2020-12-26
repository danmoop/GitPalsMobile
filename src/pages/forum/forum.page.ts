import { Component, OnInit } from '@angular/core';
import { API_URL } from '../../variables/constants';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  posts: Array<object>;

  constructor(
    private alertCtrl: AlertController, 
    private actionSheetCtrl: ActionSheetController,
    private router: Router) {}

  ngOnInit(): void {
    axios.get(`${API_URL}/forum/getAll`)
      .then(response => {
        this.posts = response.data.reverse();
      })
      .catch(err => this.showAlert(err));
  }

  openActionSheet(): void {
    this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Publish Post',
          icon: 'create-outline',
          handler: () => {
            this.router.navigateByUrl('/publish-forum-post');
          }
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

  openPost(key): void {
    this.router.navigateByUrl(`/view-forum-post/${key}`);
  }
}