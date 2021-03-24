import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientAssignmentRoutingModule } from './client-assignment-routing.module';
import { ClientAssignmentComponent } from './client-assignment/client-assignment.component';


@NgModule({
  declarations: [ClientAssignmentComponent],
  imports: [
    CommonModule,
    ClientAssignmentRoutingModule
  ]
})
export class ClientAssignmentModule { }
