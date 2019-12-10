import { EmailListComponent } from './email-list.component';
import { EmailListingComponent } from './email-listing/email-listing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailViewComponent } from './email-view/email-view.component';


const routes: Routes = [
  {
    path: '',
    component: EmailListComponent,
    children: [
      {
        path: '',
        component: EmailListingComponent
      }
    ]
  },
  {
    path: 'view',
    component: EmailViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailListRoutingModule { }
