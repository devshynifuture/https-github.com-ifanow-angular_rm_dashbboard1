import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const componentList = [

]

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
  ],
  entryComponents: componentList
})
export class BackofficeFolioMappingEntryModule {
  static getComponentList() {
    return componentList;
  }
}