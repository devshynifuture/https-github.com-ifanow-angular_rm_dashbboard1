import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { AdvisorAndOrganizationInfoService } from './resolvers/advisor-and-organization-info.service';
import { MobileLeftSidenavComponent } from './customer/mobile/left-side/mobile-left-sidenav/mobile-left-sidenav.component';
import { MobileMyfeedComponent } from './customer/mobile/mobile-myfeed/mobile-myfeed.component';
import { MobilePortfoiloComponent } from './customer/mobile/portfolio/mobile-portfoilo/mobile-portfoilo.component';
import { MobInvestComponent } from './customer/mobile/mob-invest/mob-invest.component';
import { MobileProfileComponent } from './customer/mobile/profile/mobile-profile/mobile-profile.component';
import { MobileDocumentComponent } from './customer/mobile/document/mobile-document/mobile-document.component';


const routes: Routes = [
  {

    path: 'mobile',
    component: MobileLeftSidenavComponent,
    resolve: { advisorInfo: AdvisorAndOrganizationInfoService },
    children: [
      {
        path: 'myfeed',
        component: MobileMyfeedComponent
      },
      {
        path: 'portfolio',
        component: MobilePortfoiloComponent
      },
      {
        path: 'invest',
        component: MobInvestComponent
      },
      {
        path: 'profile',
        component: MobileProfileComponent
      },
      {
        path: 'document',
        component: MobileDocumentComponent
      },
      {
        path: '',
        redirectTo: 'myfeed',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule {
}
