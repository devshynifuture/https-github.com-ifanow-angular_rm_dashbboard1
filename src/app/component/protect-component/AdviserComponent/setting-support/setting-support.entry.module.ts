import { MaterialModule } from "./../../../../material/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EditPayeeSettingPricingComponent } from './setting-support-pricing/setting-support-pricing-setting/edit-payee-setting-pricing/edit-payee-setting-pricing.component';

const componentList = [EditPayeeSettingPricingComponent];

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
