import { BillsComponent } from "./bills.component";
import { BillsRoutingModule } from "./bills-routing.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EstimateComponent } from "./estimate/estimate.component";
import { BillsPaymentsComponent } from "./bills-payments/bills-payments.component";

@NgModule({
  declarations: [BillsComponent, EstimateComponent, BillsPaymentsComponent],
  imports: [CommonModule, BillsRoutingModule],
})
export class BillsModule {}
