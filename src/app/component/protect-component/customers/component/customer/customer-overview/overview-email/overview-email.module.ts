import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewEmailRoutingModule } from './overview-email-routing.module';
import { OverviewEmailComponent } from './overview-email.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [OverviewEmailComponent],
  imports: [
    CommonModule,
    OverviewEmailRoutingModule,
    MaterialModule
  ]
})
export class OverviewEmailModule { }
