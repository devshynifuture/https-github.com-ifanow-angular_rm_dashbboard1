import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { DocumentExplorerComponent } from './document-explorer.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PreviewComponent } from './preview/preview.component';


@NgModule({
  declarations: [DocumentExplorerComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    NgxDocViewerModule,
  ]
})
export class DocumentsModule { }
