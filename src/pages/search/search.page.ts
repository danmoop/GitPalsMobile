import { Component } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { API_URL } from '../../variables/constants';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {;

  activeMode: any = null;
  results: any = null;
  searchName: string = '';
  items: string[] = [];

  mods: object[] = [
    {
      text: 'Find users by username',
      link: `${API_URL}/search/matchUsersByUsername/`,
      handler: () => {
        this.activeMode = this.mods[0];
        this.results = null;
        this.items = [];
      }
    },
    {
      text: 'Find projects by project name',
      link: `${API_URL}/search/matchProjectsByProjectName/`,
      handler: () => {
        this.activeMode = this.mods[1];
        this.results = null;
        this.items = [];
      }
    },
    {
      text: 'Find projects by technologies used in them',
      link: `${API_URL}/search/matchProjectsByTechnologies/`,
      handler: () => {
        this.activeMode = this.mods[2];
        this.results = null;
        this.items = [];
      }
    },
    {
      text: 'Find users by their skills',
      link: `${API_URL}/search/matchUsersBySkills/`,
      handler: () => {
        this.activeMode = this.mods[3];
        this.results = null;
        this.items = [];
      }
    },
    {
      text: 'Find forum posts by title',
      link: `${API_URL}/search/matchForumPostsByTitle/`,
      handler: () => {
        this.activeMode = this.mods[4];
        this.results = null;
        this.items = [];
      }
    }
  ];

  constructor(
    private actionsCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  selectMode(): void {
    this.actionsCtrl.create({
      header: 'Options',
      buttons: this.mods
    }).then(alert => {
      alert.present();
    });
  }

  find(): void {
    this.results = null;

    this.loadingCtrl.create({
      message: 'Please Wait'
    }).then(alert => alert.present());

    if(this.activeMode != this.mods[2] && this.activeMode != this.mods[3]) {
      axios.get(`${this.activeMode.link}${this.searchName}`)
        .then(response => {
          this.results = response.data;
          this.searchName = '';
          this.loadingCtrl.dismiss();
        })
    } else {
      axios.post(`${this.activeMode.link}`, this.items)
        .then(response => {
          this.results = response.data;
          this.loadingCtrl.dismiss();
        }).catch(err => this.showAlert(err));
    } 
  }

  openResult(result): void {
    if(this.activeMode == this.mods[0] || this.activeMode == this.mods[3]) {
      this.router.navigateByUrl(`/view-user/${result.username}`);
    }
    else if(this.activeMode == this.mods[1] || this.activeMode == this.mods[2]) {
      this.router.navigateByUrl(`/view-project/${result.title}`);
    }
    else if(this.activeMode == this.mods[3]) {
      this.router.navigateByUrl(`/view-forum-post/${result.key}`);
    }
  }

  showAlert(msg: string): void {
    this.alertCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  addItem(): void {
    this.alertCtrl.create({
      header: 'Add item',
      inputs: [
        {
          name: 'item',
          placeholder: 'Item'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            this.items.push(data.item);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  removeItem(item: string): void {
    let index = this.items.indexOf(item);

    if(index != -1) {
      this.items.splice(index, 1);
    }
  }
}
