import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/no-protected/login/login.component';
import { SelectivePreloadingStrategyService } from './services/selective-preloading-strategy.service';
import { ErrorPageComponent } from './component/protect-component/common-component/error-page/error-page.component';
import { DataNotFoundComponent } from './component/protect-component/common-component/data-not-found/data-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { FormTestComponent } from './test/form-test/form-test.component';
import { SubscriptionUpperSliderComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';
import { BackofficeDashboardComponent } from './component/protect-component/AdviserComponent/backOffice/backoffice-dashboard/backoffice-dashboard.component';
import { TransactionsComponent } from './component/protect-component/customers/component/common-component/transactions/transactions.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    // outlet: 'mainrouter'
  },
  {
    path: 'admin',
    loadChildren: () => import('./component/left-sidebar/leftsidebar/leftsidebar.module').then(m => m.LeftsidebarModule),
    // outlet: 'mainrouter',
    canActivate: [AuthGuard],

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
        data: { animation: 'Tab1', preload: true },


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
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
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
  }

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
