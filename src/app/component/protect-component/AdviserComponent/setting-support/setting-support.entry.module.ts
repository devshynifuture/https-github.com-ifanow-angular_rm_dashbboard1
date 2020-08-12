import { MaterialModule } from "./../../../../material/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

const componentList = [];

@NgModule({
  declarations: componentList,
  entryComponents: componentList,
  imports: [CommonModule, MaterialModule],
})
export class SettingSupportEntryModule {
  static getEntryComponentList() {
    return componentList;
  }
}
