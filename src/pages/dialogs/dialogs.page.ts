import { Component } from '@angular/core';
import { User } from 'src/model/User';
import { FolderPage } from '../../app/folder/folder.page';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.page.html',
  styleUrls: ['./dialogs.page.scss'],
})
export class DialogsPage {

  constructor() { }

  get user(): User {
    return FolderPage.user;
  }

  get dialogs(): string[] {
    return Object.keys(this.user.dialogs);
  }

  isNew(name: string): boolean {
    return FolderPage.user.dialogs[name].key != 0;
  }
}
