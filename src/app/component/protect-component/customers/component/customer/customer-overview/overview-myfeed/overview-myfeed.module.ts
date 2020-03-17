import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewMyfeedRoutingModule } from './overview-myfeed-routing.module';
import { OverviewMyfeedComponent } from './overview-myfeed.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [OverviewMyfeedComponent],
  imports: [
    CommonModule,
    OverviewMyfeedRoutingModule,
    MaterialModule
  ]
})
export class OverviewMyfeedModule { }
