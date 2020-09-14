import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewEmailComponent } from './overview-email.component';
import { EmailListingComponent } from '../../../../../AdviserComponent/Email/email-component/email-list/email-listing/email-listing.component';

const routes: Routes = [
  {
    path: '', component: OverviewEmailComponent,
    // children: [
    //   { path: 'inbox', component: EmailListingComponent },
    //   { path: 'sent', component: EmailListingComponent },
    //   { path: 'draft', component: EmailListingComponent },
    //   { path: 'trash', component: EmailListingComponent },
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewEmailRoutingModule { }
