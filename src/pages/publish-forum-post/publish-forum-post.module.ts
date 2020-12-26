import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublishForumPostPageRoutingModule } from './publish-forum-post-routing.module';

import { PublishForumPostPage } from './publish-forum-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublishForumPostPageRoutingModule
  ],
  declarations: [PublishForumPostPage]
})
export class PublishForumPostPageModule {}
