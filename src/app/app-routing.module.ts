import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeftsidebarComponent} from './component/left-sidebar/leftsidebar/leftsidebar.component';
import {LoginComponent} from './component/no-protected/login/login.component';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin', component: LeftsidebarComponent,
    children: [
      {
        path: 'subscription',
        loadChildren: () => import('./component/protect-component/AdviserComponent/Subscriptions/subscription.module')
          .then(m => m.SubscriptionModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'customer-detail',
    loadChildren: () => import('./component/protect-component/customers/customers.module')
      .then(m => m.CustomersModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
