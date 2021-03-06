import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdviceComponent } from './advice/advice.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CrmActionPlansComponent } from './crm-action-plans/crm-action-plans.component';
import { CrmNotesComponent } from './crm-notes/crm-notes.component';
import { CrmTasksComponent } from './crm-tasks/crm-tasks.component';
import { CrmOpportunitiesComponent } from './crm-opportunities/crm-opportunities.component';
import { RoleGuard } from 'src/app/auth-service/role.guard';

const routes: Routes = [
  { path: '', component: AdviceComponent },
  { path: 'advice', component: AdviceComponent },
  { path: 'plans', component: CrmActionPlansComponent },
  { path: 'notes', component: CrmNotesComponent },
  {
    path: 'tasks',
    component: CrmTasksComponent,
    canActivate: [RoleGuard]
  },
  { path: 'opportunities', component: CrmOpportunitiesComponent },
  {
    path: 'calendar',
    loadChildren: () => import('src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.module').then(m => m.CalendarModule),
    canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiviesRoutingModule { }
