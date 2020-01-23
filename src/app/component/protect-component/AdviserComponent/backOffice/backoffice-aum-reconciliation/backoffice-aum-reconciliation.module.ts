import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeAumReconciliationRoutingModule } from './backoffice-aum-reconciliation-routing.module';
import { BackofficeAumReconciliationComponent } from './backoffice-aum-reconciliation.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [BackofficeAumReconciliationComponent],
  imports: [
    CommonModule,
    BackofficeAumReconciliationRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ]
})
export class BackofficeAumReconciliationModule { }
