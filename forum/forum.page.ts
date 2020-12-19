import { Component, OnInit } from '@angular/core';
import { API_URL } from '../src/variables/constants';
import axios from 'axios';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  posts: Array<object>;

  constructor() { }

  ngOnInit() {
    axios.get(`${API_URL}/forum/getAll`)
      .then(response => {
	this.posts = response.data;
      })
      .catch(err => alert(err));
  }
}
