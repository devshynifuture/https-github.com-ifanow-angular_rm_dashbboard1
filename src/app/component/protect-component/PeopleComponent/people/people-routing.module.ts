import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people.component';
import { PeopleClientsComponent } from './Component/people-clients/people-clients.component';
import { PeopleLeadsComponent } from './Component/people-leads/people-leads.component';
import { PeopleTeamMembersComponent } from './Component/people-team-members/people-team-members.component';
import { RoleGuard } from 'src/app/auth-service/role.guard';


const routes: Routes = [
  {
    path: '',
    component: PeopleComponent,
    children: [
      {
        path: 'clients',
        component: PeopleClientsComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'leads',
        component: PeopleLeadsComponent,
        canActivate: [RoleGuard]
      },
      /* {
         path: 'team-members',
         component: UsersComponent
       },*/
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
export class PeopleRoutingModule {
}
