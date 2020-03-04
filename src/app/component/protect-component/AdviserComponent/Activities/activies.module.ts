import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiviesRoutingModule } from './activies-routing.module';
import { ActiviesComponent } from './activies.component';
import { AdviceComponent } from './advice/advice.component';
import { MaterialModule } from 'src/app/material/material';
import { CalendarModule } from './calendar/calendar.module';
import { CrmNotesComponent } from './crm-notes/crm-notes.component';
import { CrmActionPlansComponent } from './crm-action-plans/crm-action-plans.component';
import { CrmTasksComponent } from './crm-tasks/crm-tasks.component';
import { CrmOpportunitiesComponent } from './crm-opportunities/crm-opportunities.component';




@NgModule({
  declarations: [ActiviesComponent, AdviceComponent, CrmNotesComponent,
    CrmActionPlansComponent, CrmTasksComponent, CrmOpportunitiesComponent],
  imports: [
    CommonModule,
    MaterialModule,
    CalendarModule,
    ActiviesRoutingModule
  ],
  entryComponents: []
})
export class ActiviesModule { }
