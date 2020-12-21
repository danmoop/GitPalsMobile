import { Component, OnInit } from '@angular/core';
import { API_URL } from '../../variables/constants';
import axios from 'axios';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  posts: Array<object>;

  constructor(private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    axios.get(`${API_URL}/forum/getAll`)
      .then(response => {
        this.posts = response.data;
      })
      .catch(err => alert(err));
  }

  openActionSheet() {
    this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Publish Post',
          icon: 'create-outline',
          handler: () => {
          }
        }
    ]
    }).then(alert => alert.present());
  }
}