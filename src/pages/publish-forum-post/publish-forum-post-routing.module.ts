import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishForumPostPage } from './publish-forum-post.page';

const routes: Routes = [
  {
    path: '',
    component: PublishForumPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishForumPostPageRoutingModule {}
