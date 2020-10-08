import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferEarnRoutingModule } from './refer-earn-routing.module';
import { RefersComponent } from './refers/refers.component';


@NgModule({
  declarations: [RefersComponent],
  imports: [
    CommonModule,
    ReferEarnRoutingModule
  ]
})
export class ReferEarnModule { }
