import { StatusFileUploadComponent } from './status-file-upload/status-file-upload.component';
import { BackofficeFileUploadComponent } from './backoffice-file-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeFileUploadRoutingModule, adminRoutingComponents } from './backoffice-file-upload-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { BackofficeFileUploadAumComponent } from './backoffice-file-upload-aum/backoffice-file-upload-aum.component';

@NgModule({
  declarations: [adminRoutingComponents, BackofficeFileUploadAumComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    BackofficeFileUploadRoutingModule,
  ]
})
export class BackofficeFileUploadModule { }
