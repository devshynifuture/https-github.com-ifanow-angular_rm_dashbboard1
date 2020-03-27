import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeFileUploadRoutingModule, adminRoutingComponents } from './backoffice-file-upload-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';

@NgModule({
  declarations: [adminRoutingComponents],
  imports: [
    CommonModule,
    BackofficeFileUploadRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
})
export class BackofficeFileUploadModule { }
