import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewForumPostPage } from './view-forum-post.page';

const routes: Routes = [
  {
    path: '',
    component: ViewForumPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewForumPostPageRoutingModule {}
