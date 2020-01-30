import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileOrderingUploadRoutingModule } from './file-ordering-upload-routing.module';
import { FileOrderingHistoricalComponent } from './file-ordering-historical/file-ordering-historical.component';
import { FileOrderingBulkComponent } from './file-ordering-bulk/file-ordering-bulk.component';
import { FileOrderingUploadComponent } from './file-ordering-upload.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [FileOrderingUploadComponent, FileOrderingHistoricalComponent, FileOrderingBulkComponent],
  imports: [
    CommonModule,
    FileOrderingUploadRoutingModule,
    MaterialModule
  ]
})
export class FileOrderingUploadModule { }
