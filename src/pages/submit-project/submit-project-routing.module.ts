import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitProjectPage } from './submit-project.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitProjectPageRoutingModule {}
