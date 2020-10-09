import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { MaterialModule } from 'src/app/material/material';
import { LandingWebPageRoutingModule } from './landing-web-page-routing.module';
import { LeadWebPageComponent } from './lead-web-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    LeadWebPageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CustomDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    LandingWebPageRoutingModule,
    CustomCommonModule, 
  ]
})
export class LeadWebPageModule { }
