import { NgModule } from '@angular/core';

const entryComponents = []

@NgModule({
  declarations: entryComponents,
  imports: [],
  exports: [],
  entryComponents: []
})
export class DashboardModule {
  constructor() { }

  static getEntryComponents() {
    return entryComponents;
  }
}