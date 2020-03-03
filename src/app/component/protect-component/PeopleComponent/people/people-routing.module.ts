import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleComponent } from './people.component';
import { PeopleClientsComponent } from './Component/people-clients/people-clients.component';
import { PeopleLeadsComponent } from './Component/people-leads/people-leads.component';
import { PeopleTeamMembersComponent } from './Component/people-team-members/people-team-members.component';


const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
    children: [
      {
        path: 'clients',
        component: PeopleClientsComponent,
      },
      {
        path: 'leads',
        component: PeopleLeadsComponent
      },
      {
        path: 'team-members',
        component: PeopleTeamMembersComponent
      },
      {
        path: 'sub-brokers',
        component: PeopleTeamMembersComponent
      },
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
