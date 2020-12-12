import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDialogPageRoutingModule } from './view-dialog-routing.module';

import { ViewDialogPage } from './view-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDialogPageRoutingModule  
  ],
  declarations: [ViewDialogPage]
})
export class ViewDialogPageModule {}
