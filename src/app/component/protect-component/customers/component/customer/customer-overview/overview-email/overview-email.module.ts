import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewEmailRoutingModule } from './overview-email-routing.module';
import { OverviewEmailComponent } from './overview-email.component';


@NgModule({
  declarations: [OverviewEmailComponent],
  imports: [
    CommonModule,
    OverviewEmailRoutingModule
  ]
})
export class OverviewEmailModule { }
