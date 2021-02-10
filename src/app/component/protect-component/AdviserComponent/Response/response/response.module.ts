import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponseRoutingModule } from './response-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EntryComponentsModule } from 'src/app/entry.components.module';
import { ResponseHtmlComponent } from './response-html/response-html.component';


@NgModule({
  declarations: [ResponseHtmlComponent],
  imports: [
    CommonModule,
    ResponseRoutingModule,
    CommonModule,
    MaterialModule,
    CustomDirectiveModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    EntryComponentsModule
  ]
})
export class ResponseModule { }
