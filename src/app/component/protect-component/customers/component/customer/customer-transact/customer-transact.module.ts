import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTransactRoutingModule } from './customer-transact-routing.module';
import { CustomerTransactComponent } from './customer-transact.component';


@NgModule({
  declarations: [CustomerTransactComponent],
  imports: [
    CommonModule,
    CustomerTransactRoutingModule
  ]
})
export class CustomerTransactModule { }
