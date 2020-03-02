import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdviceComponent } from './advice/advice.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CrmActionPlansComponent } from './crm-action-plans/crm-action-plans.component';
import { CrmNotesComponent } from './crm-notes/crm-notes.component';
import { CrmTasksComponent } from './crm-tasks/crm-tasks.component';
import { CrmOpportunitiesComponent } from './crm-opportunities/crm-opportunities.component';

const routes: Routes = [
  { path: '', component: AdviceComponent },
  { path: 'advice', component: AdviceComponent },
  { path: 'plans', component: CrmActionPlansComponent },
  { path: 'notes', component: CrmNotesComponent },
  { path: 'tasks', component: CrmTasksComponent },
  { path: 'opportunities', component: CrmOpportunitiesComponent },
  { path: 'calendar', component: CalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiviesRoutingModule { }
