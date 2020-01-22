import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuplicateDataRoutingModule } from './duplicate-data-routing.module';
import { DuplicateDataComponent } from './duplicate-data.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [DuplicateDataComponent],
  imports: [
    CommonModule,
    DuplicateDataRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ]
})
export class DuplicateDataModule { }
