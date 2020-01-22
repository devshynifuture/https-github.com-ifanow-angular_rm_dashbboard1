import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MutualFundsRoutingModule } from './mutual-funds-routing.module';
import { MutualFundsComponent } from './mutual-funds.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';
import { AumComponent } from './aum/aum.component';
import { AmcWiseComponent } from './aum/amc-wise/amc-wise.component';
import { ApplicantWiseComponent } from './aum/applicant-wise/applicant-wise.component';
import { CategoryWiseComponent } from './aum/category-wise/category-wise.component';
import { ClientWiseComponent } from './aum/client-wise/client-wise.component';
import { FillterSearchComponent } from './fillter-search/fillter-search.component';
import { SipComponent } from './sip/sip.component';
import { FoliosComponent } from './folios/folios.component';
import { SipSchemeWiseComponent } from './sip/sip-scheme-wise/sip-scheme-wise.component';
import { SipAmcWiseComponent } from './sip/sip-amc-wise/sip-amc-wise.component';
import { SipClientWiseComponent } from './sip/sip-client-wise/sip-client-wise.component';
import { SipApplicantWiseComponent } from './sip/sip-applicant-wise/sip-applicant-wise.component';


@NgModule({
  declarations: [MutualFundsComponent, AssetAllocationComponent, AumComponent, AmcWiseComponent, ApplicantWiseComponent, CategoryWiseComponent, ClientWiseComponent, FillterSearchComponent, SipComponent, FoliosComponent, SipAmcWiseComponent,
    SipSchemeWiseComponent,
    SipClientWiseComponent,
    SipApplicantWiseComponent,],
  imports: [
    CommonModule,
    MutualFundsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MutualFundsModule { }
