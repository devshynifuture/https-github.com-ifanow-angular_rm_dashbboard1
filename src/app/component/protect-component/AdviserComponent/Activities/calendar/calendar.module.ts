import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calendarComponent, EventDialog } from './calendar.component';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    calendarComponent,
    EventDialog,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [EventDialog]
})
export class CalendarModule { }
