import { BackofficeFolioMappingRoutingModule } from './backoffice-folio-mapping-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeFolioMappingComponent } from './backoffice-folio-mapping.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [BackofficeFolioMappingComponent],
  imports: [
    CommonModule,MaterialModule,FormsModule, ReactiveFormsModule,
    BackofficeFolioMappingRoutingModule
  ]
})
export class BackofficeFolioMappingModule { }
