import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsLiabilitiesRoutingModule } from './accounts-liabilities-routing.module';
import { AccountsLiabilitiesComponent } from './accounts-liabilities.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LiabilitiesComponent } from '../liabilities/liabilities.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { OtherPayablesComponent } from '../liabilities/other-payables/other-payables.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';


@NgModule({
  declarations: [AccountsLiabilitiesComponent, LiabilitiesComponent, OtherPayablesComponent],
  imports: [
    CommonModule,
    AccountsLiabilitiesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
})
export class AccountsLiabilitiesModule { }
