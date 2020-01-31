import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportAumReconciliationRoutingModule } from './support-aum-reconciliation-routing.module';
import { AumAllRtaComponent } from './aum-all-rta/aum-all-rta.component';
import { AumCamsComponent } from './aum-cams/aum-cams.component';
import { AumKarvyComponent } from './aum-karvy/aum-karvy.component';
import { AumFranklinComponent } from './aum-franklin/aum-franklin.component';
import { SupportAumReconciliationComponent } from './support-aum-reconciliation.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [SupportAumReconciliationComponent, AumAllRtaComponent, AumCamsComponent, AumKarvyComponent, AumFranklinComponent],
  imports: [
    CommonModule,
    SupportAumReconciliationRoutingModule,
    MaterialModule
  ]
})
export class SupportAumReconciliationModule { }
