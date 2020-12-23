import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { API_URL } from '../../variables/constants';
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
    }
  ];

  constructor(
    private actionsCtrl: ActionSheetController,
    private alertCtrl: AlertController
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
    if(this.searchName.trim() != '') {
      axios.get(this.activeMode.link + this.searchName)
      .then(response => {
        this.results = response.data;
        console.log(this.results);
      })
      .catch(err => console.log(err));

      this.searchName = '';
    } else {
      this.showAlert("Search parameters can't be empty!");
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
