import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { CalendarWeekComponent } from './calendar-week/calendar-week.component';
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';


const routes: Routes = [
  {path: '', component: CalendarComponent,
  children: [
      {path: '', component: CalendarMonthComponent},
      {path: 'month', component: CalendarMonthComponent},
      {path: 'week', component: CalendarWeekComponent},
      {path: 'day', component: CalendarDayComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CalendarRoutingModule {
}
