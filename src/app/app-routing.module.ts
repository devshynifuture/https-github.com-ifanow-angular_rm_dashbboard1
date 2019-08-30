import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/protect-component/AdviserComponent/dashboard/dashboard.component';
import { LeftsidebarComponent } from './component/left-sidebar/leftsidebar/leftsidebar.component';
<<<<<<< HEAD
import { SubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/subscription.component';
=======
import { MisComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mis/mis.component';
>>>>>>> 5f3fe6971101507117cb4d071cb1f6ce7aaf0ac0


const routes: Routes = [
  {
    path: 'admin', component: LeftsidebarComponent,
    
    children: [
     
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'subscription',
        component:SubscriptionComponent
      },
      {
        path:'',
        component:DashboardComponent
      },
      {
        path:'mis',
        component:MisComponent
      }
      
     ]
  },
  {
    path:'',
    component:LeftsidebarComponent
  },



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
