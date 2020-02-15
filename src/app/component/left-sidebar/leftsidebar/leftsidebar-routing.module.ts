import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftsidebarComponent } from './leftsidebar.component';


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
        data: { animation: 'Tab1', preload: true }

        // data: {preload: true}

      },
      {
        path: 'emails',
        // outlet: 'main-left-router',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Email/email.module')
          .then(m => m.EmailModule),
        data: { animation: 'Tab1', preload: true }

      },
      {
        path: 'activies',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/activities/activies.module').then(m => m.ActiviesModule),
        data: { animation: 'Tab1', preload: true }
      },
      {
        path: 'calendar',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.module').then(m => m.CalendarModule),
        data: { animation: 'Tab1', preload: true }
      },
      {
        path: 'transactions',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/transactions/transactions.module').then(m => m.TransactionsModule),
        data: { animation: 'Tab1', preload: true }
        //  TransactionsComponent
      },
      {
        path: 'backoffice-mis',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/backoffice-mis/backoffice-mis.module').then(m => m.BackofficeMisModule)
      },
      {
        path: 'backoffice-aum-reconciliation',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/backoffice-aum-reconciliation.module').then(m => m.BackofficeAumReconciliationModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/setting/setting.module').then(m => m.SettingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeftsidebarRoutingModule { }
