import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitProjectPageRoutingModule } from './submit-project-routing.module';

import { SubmitProjectPage } from './submit-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmitProjectPageRoutingModule
  ],
  declarations: [SubmitProjectPage]
})
export class SubmitProjectPageModule {}
