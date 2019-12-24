import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsInsuranceRoutingModule } from './accounts-insurance-routing.module';
import { AccountsInsuranceComponent } from './accounts-insurance.component';
import { InsuranceComponent } from '../insurance/insurance.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AccountsInsuranceComponent, InsuranceComponent],
  imports: [
    CommonModule,
    AccountsInsuranceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountsInsuranceModule { }
