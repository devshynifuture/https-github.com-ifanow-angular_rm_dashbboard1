import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiviesRoutingModule } from './activies-routing.module';
import { ActiviesComponent } from './activies.component';
import { AdviceComponent } from '../advice/advice.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [ActiviesComponent, AdviceComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ActiviesRoutingModule
  ]
})
export class ActiviesModule { }
