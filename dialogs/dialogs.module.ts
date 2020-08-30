import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DialogsPageRoutingModule } from './dialogs-routing.module';

import { DialogsPage } from './dialogs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DialogsPageRoutingModule
  ],
  declarations: [DialogsPage]
})
export class DialogsPageModule {}
