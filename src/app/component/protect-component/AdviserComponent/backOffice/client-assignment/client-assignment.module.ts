import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientAssignmentRoutingModule } from './client-assignment-routing.module';
import { ClientAssignmentComponent } from './client-assignment/client-assignment.component';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTableModule } from '@angular/material';


@NgModule({
  declarations: [ClientAssignmentComponent],
  imports: [
    CommonModule,
    ClientAssignmentRoutingModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule
  ]
})
export class ClientAssignmentModule { }
