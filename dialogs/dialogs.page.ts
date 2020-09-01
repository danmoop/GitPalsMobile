import { Component } from '@angular/core';
import { FolderPage } from './../src/app/folder/folder.page';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.page.html',
  styleUrls: ['./dialogs.page.scss'],
})
export class DialogsPage {

  constructor() {  }

  get user() {
    return FolderPage.user;
  }

  get dialogs () {
    return Object.keys(this.user.dialogs);
  }
}