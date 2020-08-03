import { BackofficeFolioMappingRoutingModule } from './backoffice-folio-mapping-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeFolioMappingComponent } from './backoffice-folio-mapping.component';



@NgModule({
  declarations: [BackofficeFolioMappingComponent],
  imports: [
    CommonModule,
    BackofficeFolioMappingRoutingModule,
  ]
})
export class BackofficeFolioMappingModule { }
