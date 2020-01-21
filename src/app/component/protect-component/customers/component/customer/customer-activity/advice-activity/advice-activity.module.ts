import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdviceActivityRoutingModule } from './advice-activity-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdviceActivityComponent } from './advice-activity.component';


@NgModule({
  declarations: [AdviceActivityComponent],
  imports: [
    CommonModule,
    AdviceActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule]
})
export class AdviceActivityModule { }
