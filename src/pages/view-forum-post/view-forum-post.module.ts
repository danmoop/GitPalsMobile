import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewForumPostPageRoutingModule } from './view-forum-post-routing.module';

import { ViewForumPostPage } from './view-forum-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewForumPostPageRoutingModule
  ],
  declarations: [ViewForumPostPage]
})
export class ViewForumPostPageModule {}
