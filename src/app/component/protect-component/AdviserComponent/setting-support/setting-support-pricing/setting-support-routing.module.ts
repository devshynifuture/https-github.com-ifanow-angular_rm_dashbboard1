import { SettingSupportPricingComponent } from "./setting-support-pricing.component";
import { SettingSupportPricingHomeComponent } from "./setting-support-pricing-home/setting-support-pricing-home.component";
import { SettingSupportPricingSettingComponent } from "./setting-support-pricing-setting/setting-support-pricing-setting.component";
import { ReferEarnComponent } from "./refer-earn/refer-earn.component";
import { BillsComponent } from "./bills/bills.component";
import { SettingSupportComponent } from "./../setting-support.component";

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

const routes = [
  {
    path: "",
    component: SettingSupportPricingComponent,
    children: [
      { path: "home", component: SettingSupportPricingHomeComponent },
      {
        path: "bills",
        loadChildren: () =>
          import("./bills/bills.module").then((m) => m.BillsModule),
      },
      { path: "refer-earn", component: ReferEarnComponent },
      { path: "settings", component: SettingSupportPricingSettingComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingSupportPricingRoutingModule {}
