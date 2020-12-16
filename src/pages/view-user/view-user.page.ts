import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.page.html',
  styleUrls: ['./view-user.page.scss'],
})
export class ViewUserPage implements OnInit {

  user: any;

  constructor(private route: ActivatedRoute) {
    var username = route.snapshot.params.username;

    
  }

  ngOnInit() {
  }
}