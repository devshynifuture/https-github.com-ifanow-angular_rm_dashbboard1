import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferEarnRoutingModule } from './refer-earn-routing.module';
import { RefersComponent } from './refers/refers.component';
import { ReferComponent } from './refer/refer.component';
import { HintComponent } from './hint/hint.component';


@NgModule({
  declarations: [RefersComponent, ReferComponent, HintComponent],
  imports: [
    CommonModule,
    ReferEarnRoutingModule
  ]
})
export class ReferEarnModule { }
