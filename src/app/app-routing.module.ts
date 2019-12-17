import {OverviewComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/overview/overview.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeftsidebarComponent} from './component/left-sidebar/leftsidebar/leftsidebar.component';
import {LoginComponent} from './component/no-protected/login/login.component';
import {CalenderComponent} from './component/protect-component/AdviserComponent/Email/calender/calender.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // outlet: 'main-app-router'
  },
  {
    path: 'admin', component: LeftsidebarComponent,
    // outlet: 'main-app-router',
    children: [
      {
        path: 'subscription',
        // outlet: 'main-left-router',

        loadChildren: () => import('./component/protect-component/AdviserComponent/Subscriptions/subscription.module')
          .then(m => m.SubscriptionModule)
      },
      {
        path: 'emails',
        // outlet: 'main-left-router',
        loadChildren: () => import('./component/protect-component/AdviserComponent/Email/email.module')
          .then(m => m.EmailModule)
      },
    ]
  },
  {
    path: 'customer-detail',
    children: [
      {
        path: '',
        loadChildren: () => import('./component/protect-component/customers/customers.module')
          .then(m => m.CustomersModule)
      },
      {
        path: 'overview',
        component: OverviewComponent
      }
    ]
  },
  {
    path: 'calender',
    component: CalenderComponent
  },
  {
    path: 'gmail-redirect',
    loadChildren: () => import('./component/gmail-redirect/gmail-redirect.module')
      .then(m => m.GmailRedirectModule)
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  {
    path: 'redirect',
    loadChildren: () => import('./component/gmail-redirect/gmail-redirect.module').then(m => m.GmailRedirectModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true  /*preloadingStrategy: PreloadAllModules*/})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
