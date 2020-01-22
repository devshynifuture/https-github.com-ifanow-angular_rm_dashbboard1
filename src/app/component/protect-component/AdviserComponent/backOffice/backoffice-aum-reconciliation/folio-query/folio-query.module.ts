import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FolioQueryRoutingModule } from './folio-query-routing.module';
import { FolioQueryComponent } from './folio-query.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [FolioQueryComponent],
  imports: [
    CommonModule,
    FolioQueryRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ]
})
export class FolioQueryModule { }
