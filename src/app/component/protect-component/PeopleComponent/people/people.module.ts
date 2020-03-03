import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { PeopleClientsComponent } from './Component/people-clients/people-clients.component';
import { PeopleLeadsComponent } from './Component/people-leads/people-leads.component';
import { PeopleTeamMembersComponent } from './Component/people-team-members/people-team-members.component';
import { PeopleSubBrokersComponent } from './Component/people-sub-brokers/people-sub-brokers.component';


@NgModule({
  declarations: [PeopleComponent, PeopleClientsComponent, PeopleLeadsComponent, PeopleTeamMembersComponent, PeopleSubBrokersComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule
  ]
})
export class PeopleModule { }
