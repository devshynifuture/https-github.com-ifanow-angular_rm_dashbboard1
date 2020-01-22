import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeMisRoutingModule } from './backoffice-mis-routing.module';
import { BackofficeMisComponent } from './backoffice-mis.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [BackofficeMisComponent],
  imports: [
    CommonModule,
    BackofficeMisRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BackofficeMisModule { }
