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
        path: 'dashboard',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      // {
      //   path: 'calendar',
      //   loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.module').then(m => m.CalendarModule),
      //   data: { animation: 'Tab1', preload: true }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeftsidebarRoutingModule { }
