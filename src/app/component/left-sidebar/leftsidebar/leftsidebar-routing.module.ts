import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftsidebarComponent } from './leftsidebar.component';
import { SubscriptionGuard } from '../../../guards/subscription.guard';
import { RoleGuard } from 'src/app/auth-service/role.guard';
import { BackOfficeGuard } from '../../protect-component/AdviserComponent/backOffice/back-office.guard';
import { RestrictedUserComponent } from './restricted-user/restricted-user.component';


const routes: Routes = [
  {
    path: '',
    component: LeftsidebarComponent,
    children: [
      {
        path: 'subscription',
        // outlet: 'main-left-router',
        // outlet: 'mainleftbar',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.module')
          .then(m => m.SubscriptionModule),
        data: { animation: 'Tab1', preload: true },
        canActivate: [SubscriptionGuard]
        // data: {preload: true}

      },
      {
        path: 'emails',
        // outlet: 'main-left-router',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Email/email.module')
          .then(m => m.EmailModule),
        data: { animation: 'Tab1', preload: true },
        canActivate: [RoleGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [RoleGuard]
      },
      {
        path: 'people',
        loadChildren: () => import('src/app/component/protect-component/PeopleComponent/people/people.module').then(m => m.PeopleModule)
      },
      {
        path: 'activies',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/activies.module').then(m => m.ActiviesModule),
        data: { animation: 'Tab1', preload: true }
      },
      // {
      //   path: 'calendar',
      //   loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.module').then(m => m.CalendarModule),
      //   data: { animation: 'Tab1', preload: true }
      // },
      {
        path: 'transactions',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/transactions/transactions.module').then(m => m.TransactionsModule),
        data: { animation: 'Tab1', preload: true }
        //  TransactionsComponent
      },
      {
        path: 'backoffice-mis',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/backoffice-mis/backoffice-mis.module').then(m => m.BackofficeMisModule),
        canActivate: [BackOfficeGuard]
      },
      {
        path: 'backoffice-aum-reconciliation',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/backoffice-aum-reconciliation.module').then(m => m.BackofficeAumReconciliationModule)
      },
      {
        path: 'bulk-report-sending',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/bulk-report-sending/bulk-report-sending.module').then(m => m.BulkReportSendingModule)
      },
      {
        path: 'backoffice-file-upload',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/backoffice-file-upload/backoffice-file-upload.module').then(m => m.BackofficeFileUploadModule),
        canActivate: [BackOfficeGuard]
      },
      {
        path: 'folio-mapping',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/backoffice-folio-mapping/backoffice-folio-mapping.module').then(m => m.BackofficeFolioMappingModule)
      },

      {
        path: 'setting',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: 'account-billing',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/account-and-billing/account-and-billing.module').then(m => m.AccountAndBillingModule)
      },
      {
        path: 'setting-support',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/setting-support/setting-support.module').then(m => m.SettingSupportModule)
      },
      {
        path: 'advisor-marketplace',
        loadChildren: () => import('src/app/component/protect-component/Advisor-Marketplace/advisor-marketplce.module').then(m => m.AdvisorMarketplceModule),
      },
      {
        path: 'refers',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Refer&Earn/refer-earn/refer-earn.module').then(m => m.ReferEarnModule)
      },
      {
        path: 'restricted',
        component: RestrictedUserComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeftsidebarRoutingModule {
}
