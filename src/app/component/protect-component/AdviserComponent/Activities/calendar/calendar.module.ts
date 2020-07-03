import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar.component';
import {CommonComponentModule} from '../../../common-component/common-component.module';
import {MaterialModule} from 'src/app/material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarRoutingModule} from './calendar-routing.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';
import { CalendarWeekComponent } from './calendar-week/calendar-week.component';
import { EventDialog } from './event-dialog';


@NgModule({
  declarations: [
    CalendarComponent,
    // EventDialog,
    CalendarDayComponent,
    CalendarMonthComponent,
    CalendarWeekComponent,
    EventDialog
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarRoutingModule,
    CustomCommonModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
  entryComponents: [EventDialog]
})
export class CalendarModule { }
