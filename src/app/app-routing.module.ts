import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SelectivePreloadingStrategyService} from './services/selective-preloading-strategy.service';
import {ErrorPageComponent} from './component/protect-component/common-component/error-page/error-page.component';
import {WelcomePageComponent} from './component/protect-component/common-component/welcome-page/welcome-page.component';
import {DataNotFoundComponent} from './component/protect-component/common-component/data-not-found/data-not-found.component';
import {AuthGuard} from './guards/auth.guard';
import {FormTestComponent} from './test/form-test/form-test.component';
import {BackofficeDashboardComponent} from './component/protect-component/AdviserComponent/backOffice/backoffice-dashboard/backoffice-dashboard.component';
import {AdvisorGuard} from "./guards/advisor.guard";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./component/no-protected/login/login.module').then(m => m.LoginModule),
    canActivate: [AuthGuard],
    // outlet: 'mainrouter'
  },
  {
    path: 'admin',
    loadChildren: () => import('./component/left-sidebar/leftsidebar/leftsidebar.module').then(m => m.LeftsidebarModule),
    // outlet: 'mainrouter',
    canActivate: [AuthGuard, AdvisorGuard],

  },
  // {
  //   path: 'calendar',
  //   component: calendarComponent
  // },
  {
    path: 'customer',
    // outlet: 'secondary',
    children: [
      {
        path: '',
        loadChildren: () => import('./component/protect-component/customers/customers.module')
          .then(m => m.CustomersModule),
        data: {animation: 'Tab1', preload: true},


        // data: {preload: true}

      },
      // {
      //   path: 'overview',
      //   component: OverviewComponent
      // }
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'support',
    loadChildren: () => import('./component/protect-component/SupportComponent/support.module').then(m => m.SupportModule)
  },
  {
    path: 'subscription-upper',
    loadChildren: () => import('./component/protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module').then(m => m.SubscriptionUpperEntry)
  },
  {
    path: 'gmail-redirect',
    // outlet: 'mainrouter',
    loadChildren: () => import('./component/gmail-redirect/gmail-redirect.module')
      .then(m => m.GmailRedirectModule)
  },
  {
    path: 'backoffice',
    component: BackofficeDashboardComponent
  },
  {
    path: 'cus',
    loadChildren: () => import('./component/protect-component/customer-feedback/cus-feedback.module').then(m => m.CusFeedbackModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'redirect',
    // outlet: 'mainrouter',
    loadChildren: () => import('./component/gmail-redirect/gmail-redirect.module').then(m => m.GmailRedirectModule)
  },
  {
    path: 'not-found',
    loadChildren: './component/protect-component/common-component/not-found/not-found.module#NotFoundModule'
  },
  {
    path: 'error-page',
    component: ErrorPageComponent
  },
  {
    path: 'unauthorized',
    component: ErrorPageComponent
  },
  {
    path: 'welcome-page',
    component: WelcomePageComponent
  },
  {
    path: 'data-not-found',
    component: DataNotFoundComponent
  },
  /* {
     path: 'buttons',
     component: ProgressButtonComponent
   },*/
  {
    path: 'test',
    component: FormTestComponent
  },

  {
    path: '**',
    redirectTo: 'not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    preloadingStrategy: SelectivePreloadingStrategyService  /*preloadingStrategy: PreloadAllModules*/
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
