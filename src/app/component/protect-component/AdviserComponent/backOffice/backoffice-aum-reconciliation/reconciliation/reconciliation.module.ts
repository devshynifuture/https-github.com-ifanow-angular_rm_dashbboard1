import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReconciliationRoutingModule } from './reconciliation-routing.module';
import { ReconciliationComponent } from './reconciliation.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { ReconCamsComponent } from './recon-cams/recon-cams.component';
import { ReconKarvyComponent } from './recon-karvy/recon-karvy.component';
import { ReconFranklinComponent } from './recon-franklin/recon-franklin.component';


@NgModule({
  declarations: [ReconciliationComponent, ReconCamsComponent, ReconKarvyComponent, ReconFranklinComponent],
  imports: [
    CommonModule,
    ReconciliationRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ]
})
export class ReconciliationModule { }
