import { BillsComponent } from "./bills.component";

import { BillsPaymentsComponent } from "./bills-payments/bills-payments.component";
import { EstimateComponent } from "./estimate/estimate.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

const routes = [
  {
    path: "",
    component: BillsComponent,
    children: [
      { path: "estimate", component: EstimateComponent },
      { path: "bills-payments", component: BillsPaymentsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsRoutingModule {}
