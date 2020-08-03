import { BackofficeFolioMappingRoutingModule } from './backoffice-folio-mapping-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeFolioMappingComponent } from './backoffice-folio-mapping.component';
import { MaterialModule } from 'src/app/material/material';



@NgModule({
  declarations: [BackofficeFolioMappingComponent],
  imports: [
    CommonModule,
    BackofficeFolioMappingRoutingModule,MaterialModule
  ]
})
export class BackofficeFolioMappingModule { }
