import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { ActionSheetController } from '@ionic/angular';
import { API_URL } from '../../variables/constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {;

  activeMode = null;
  results = null;
  searchName = '';

  mods = [
    {
      text: 'Find users by username',
      link: `${API_URL}/search/matchByUsername/`,
      handler: () => {
        this.activeMode = this.mods[0];
        this.results = null;
      }
    },
    {
      text: 'Find projects by project name',
      link: `${API_URL}/search/matchByProjectName/`,
      handler: () => {
        this.activeMode = this.mods[1];
        this.results = null;
      }
    }
  ];

  constructor(
    private actionsCtrl: ActionSheetController
  ) {}

  selectMode() {
    this.actionsCtrl.create({
      header: 'Options',
      buttons: this.mods
    }).then(alert => {
      alert.present();
    });
  }

  find() {
    this.results = null;
    if(this.searchName.trim() != '') {
      axios.get(this.activeMode.link + this.searchName)
      .then(response => {
        this.results = response.data;
      })
      .catch(err => console.log(err));

      this.searchName = '';
    }
  }
}