import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeFileUploadRoutingModule, adminRoutingComponents } from './backoffice-file-upload-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [adminRoutingComponents],
  imports: [
    CommonModule,
    BackofficeFileUploadRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BackofficeFileUploadModule { }
