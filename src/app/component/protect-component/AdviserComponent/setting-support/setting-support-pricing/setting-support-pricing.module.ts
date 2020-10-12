import { SettingSupportPricingComponent } from "./setting-support-pricing.component";
import { SettingSupportPricingRoutingModule } from "./setting-support-routing.module";
import { MaterialModule } from "./../../../../../material/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BillsComponent } from "./bills/bills.component";
import { ReferEarnComponent } from "./refer-earn/refer-earn.component";
import { SettingSupportPricingSettingComponent } from "./setting-support-pricing-setting/setting-support-pricing-setting.component";
import { SettingSupportPricingHomeComponent } from "./setting-support-pricing-home/setting-support-pricing-home.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { SettingSupportPricingEntryModule } from './setting-support-pricing-entry.module';


@NgModule({
  declarations: [
    SettingSupportPricingComponent,
    ReferEarnComponent,
    SettingSupportPricingSettingComponent,
    SettingSupportPricingHomeComponent,

  ],
  imports: [
    CommonModule, MaterialModule, SettingSupportPricingRoutingModule, ReactiveFormsModule, FormsModule, CustomDirectiveModule, CustomCommonModule
    , SettingSupportPricingEntryModule
  ],
  exports: [],
  entryComponents: []
})
export class SettingSupportPricingModule { }
