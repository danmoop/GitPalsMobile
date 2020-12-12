import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogsPage } from './dialogs.page';

const routes: Routes = [
  {
    path: '',
    component: DialogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogsPageRoutingModule {}
