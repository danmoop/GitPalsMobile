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

  mods = [
    {
      text: 'Find users by username',
      link: `${API_URL}/search/matchUsersByUsername/`,
      handler: () => {
        this.activeMode = this.mods[0];
        this.results = null;
      }
    },
    {
      text: 'Find projects by project name',
      link: `${API_URL}/search/matchProjectsByProjectName/`,
      handler: () => {
        this.activeMode = this.mods[1];
        this.results = null;
      }
    },
    {
      text: 'Find forum posts by title',
      link: `${API_URL}/search/matchForumPostsByTitle/`,
      handler: () => {
        this.activeMode = this.mods[2];
        this.results = null;
      }
    }
  ];

  constructor(
    private actionsCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
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
    this.loadingCtrl.create({
      message: 'Please Wait'
    }).then(alert => alert.present());

    this.results = null;
    if(this.searchName.trim() != '') {
      axios.get(this.activeMode.link + this.searchName)
      .then(response => {
        this.results = response.data;
        this.searchName = '';
        this.loadingCtrl.dismiss();
      })
      .catch(err => this.showAlert(err));
    } else {
      this.showAlert("Search parameters can't be empty!");
    }
  }

  openResult(result): void {
    if(this.activeMode == this.mods[0]) {
      this.router.navigateByUrl(`/view-user/${result.username}`);
    }
    else if(this.activeMode == this.mods[1]) {
      this.router.navigateByUrl(`/view-project/${result.title}`);
    }
    else if(this.activeMode == this.mods[2]) {
      this.router.navigateByUrl(`/view-forum-post/${result.key}`);
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