import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeftsidebarComponent} from './component/left-sidebar/leftsidebar/leftsidebar.component';
import {LoginComponent} from './component/no-protected/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // outlet: 'mainrouter'
  },
  {
    path: 'admin', component: LeftsidebarComponent,
    // outlet: 'mainrouter',
    children: [
      {
        path: 'subscription',
        // outlet: 'main-left-router',
        // outlet: 'mainleftbar',
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
    path: 'customer',
    // outlet: 'secondary',
    children: [
      {
        path: '',
        loadChildren: () => import('./component/protect-component/customers/customers.module')
          .then(m => m.CustomersModule)
      },
      // {
      //   path: 'overview',
      //   component: OverviewComponent
      // }
    ]
  },
  /* {
     path: 'calender',
     component: CalenderComponent
   },*/
  {
    path: 'gmail-redirect',
    // outlet: 'mainrouter',
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
    // outlet: 'mainrouter',
    loadChildren: () => import('./component/gmail-redirect/gmail-redirect.module').then(m => m.GmailRedirectModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false  /*preloadingStrategy: PreloadAllModules*/})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
