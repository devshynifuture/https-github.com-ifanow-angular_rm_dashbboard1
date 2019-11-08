import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './component/protect-component/AdviserComponent/dashboard/dashboard.component';
import {LeftsidebarComponent} from './component/left-sidebar/leftsidebar/leftsidebar.component';
import {SubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/subscription.component';
import {MisComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mis/mis.component';
import {LoginComponent} from './component/no-protected/login/login.component';

const routes: Routes = [
  {

    path: 'admin', component: LeftsidebarComponent,

    children: [
      {
        path: 'admin',
        component: DashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'subscription',
        component: SubscriptionComponent,
        children: [
          {
            path: '',
            component: SubscriptionComponent
            // data: {animation: 'SubscriptionHome'}
          }]
        // path: '',

// loadChildren: () => import('./component/protect-component/AdviserComponent/Subscriptions/subscription.module')
        //   .then(m => m.SubscriptionModule)

      },
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'mis',
        component: MisComponent
      }

    ],
    // data: {animation: 'LeftBar'}

  },

  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'customer',
  //   component: CustomerComponent,
  //   data: {
  //     animation: 'ClientDetails'
  //   }
  // },
  {
    path: 'customer-detail',
    // loadChildren: './component/protect-component/customers/customers.module#CustomersModule'
    loadChildren: () => import('./component/protect-component/customers/customers.module')
      .then(m => m.CustomersModule)
  },
  /* {
     path: '',
     // redirectTo: '/login',
     // pathMatch: 'full'
     component: LoginComponent
   },*/
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
    // component: LoginComponent

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
