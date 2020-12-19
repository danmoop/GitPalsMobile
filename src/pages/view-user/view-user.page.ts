import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/User';
import { API_URL } from '../variables/constants';
import axios from 'axios';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.page.html',
  styleUrls: ['./view-user.page.scss'],
})
export class ViewUserPage {

  user: User;

  constructor(private route: ActivatedRoute) {
    let username = route.snapshot.params.username;

    axios.get(`${API_URL}/users/get/${username}`)
      .then(response => this.user = response.data)
      //TODO: replace alert with AlertController
      .catch(err => alert(err));
  }
}
