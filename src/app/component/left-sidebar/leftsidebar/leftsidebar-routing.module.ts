import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeftsidebarComponent} from './leftsidebar.component';


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
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.module')
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeftsidebarRoutingModule { }
