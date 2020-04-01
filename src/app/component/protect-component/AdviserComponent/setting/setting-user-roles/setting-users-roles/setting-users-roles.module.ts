import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingUsersRolesRoutingModule } from './setting-users-roles-routing.module';
import { AddTeamMemberComponent } from './hierachy/add-team-member/add-team-member.component';


@NgModule({
  imports: [
    CommonModule,
    SettingUsersRolesRoutingModule
  ],
  declarations: [AddTeamMemberComponent]
})
export class SettingUsersRolesModule { }
