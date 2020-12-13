import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewNotificationsPage } from './view-notifications.page';

const routes: Routes = [
  {
    path: '',
    component: ViewNotificationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewNotificationsPageRoutingModule {}
