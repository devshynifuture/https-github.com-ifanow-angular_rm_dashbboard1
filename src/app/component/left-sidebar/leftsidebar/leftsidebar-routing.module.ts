import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftsidebarComponent } from './leftsidebar.component';


const routes: Routes = [
  {
    path: '',
    component: LeftsidebarComponent,
    children: [

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
