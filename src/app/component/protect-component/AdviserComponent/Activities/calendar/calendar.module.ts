import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent, EventDialog} from './calendar.component';
import {CommonComponentModule} from '../../../common-component/common-component.module';
import {MaterialModule} from 'src/app/material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarRoutingModule} from './calendar-routing.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@NgModule({
  declarations: [
    CalendarComponent,
    EventDialog,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarRoutingModule,

  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
  entryComponents: [EventDialog]
})
export class CalendarModule { }
