import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewNotificationsPageRoutingModule } from './view-notifications-routing.module';

import { ViewNotificationsPage } from './view-notifications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewNotificationsPageRoutingModule
  ],
  declarations: [ViewNotificationsPage]
})
export class ViewNotificationsPageModule {}
