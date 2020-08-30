import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {

  projects = [];
  static user: any;

  ngOnInit() {
    axios.get('https://www.gitpals.com/api/projects/getAll')
      .then(response => {
        this.projects = response.data;
      });

    var user = JSON.parse(localStorage.getItem('user'));

    if(user != null) {
      FolderPage.user = user;
    }
  }

  get getUser() {
    return FolderPage.user;
  }

  alertCard(name) {
    console.log(name);
  }
}