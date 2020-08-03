import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectFolioMapComponent } from './select-folio-map/select-folio-map.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const componentList = [SelectFolioMapComponent]

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule
  ],
  entryComponents: componentList,  
})
export class BackofficeFolioMappingEntryModule {
  static getComponentList() {
    return componentList;
    
  }
}