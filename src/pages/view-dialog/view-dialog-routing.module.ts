import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDialogPage } from './view-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: ViewDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDialogPageRoutingModule {}
