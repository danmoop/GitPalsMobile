import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProjectPage } from './edit-project.page';

const routes: Routes = [
  {
    path: '',
    component: EditProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProjectPageRoutingModule {}
