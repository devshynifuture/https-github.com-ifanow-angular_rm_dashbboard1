import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewDocumentsRoutingModule } from './overview-documents-routing.module';
import { OverviewDocumentsComponent } from './overview-documents.component';


@NgModule({
  declarations: [OverviewDocumentsComponent],
  imports: [
    CommonModule,
    OverviewDocumentsRoutingModule
  ]
})
export class OverviewDocumentsModule { }
