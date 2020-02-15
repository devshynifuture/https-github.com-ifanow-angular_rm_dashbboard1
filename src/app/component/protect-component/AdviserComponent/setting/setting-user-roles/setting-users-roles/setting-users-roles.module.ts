import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingUsersRolesRoutingModule } from './setting-users-roles-routing.module';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { HierachyComponent } from './hierachy/hierachy.component';


@NgModule({
  declarations: [UsersComponent, RolesComponent, HierachyComponent],
  imports: [
    CommonModule,
    SettingUsersRolesRoutingModule
  ]
})
export class SettingUsersRolesModule { }
