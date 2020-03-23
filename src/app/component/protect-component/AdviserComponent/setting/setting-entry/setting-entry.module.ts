import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddReportingManagerComponent } from './add-reporting-manager/add-reporting-manager.component';
import { AddNewRoleComponent } from './add-new-role/add-new-role.component';
import { AddArnRiaDetailsComponent } from './add-arn-ria-details/add-arn-ria-details.component';
import { AddCamsDetailsComponent } from './add-cams-details/add-cams-details.component';
import { AddKarvyDetailsComponent } from './add-karvy-details/add-karvy-details.component';
import { AddFranklinTempletionDetailsComponent } from './add-franklin-templetion-details/add-franklin-templetion-details.component';
import { AddCamsFundsnetComponent } from './add-cams-fundsnet/add-cams-fundsnet.component';
import { SettingSchemeDetailsComponent } from './setting-scheme-details/setting-scheme-details.component';
import { AddModelPortfolioComponent } from './add-model-portfolio/add-model-portfolio.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { AddPersonalProfileComponent } from '../setting-org-profile/add-personal-profile/add-personal-profile.component';
import { AddTaskTemplateComponent } from '../setting-activity/add-task-template/add-task-template.component';
import { NewTeamMemberComponent } from '../setting-user-roles/setting-users-roles/users/new-team-member/new-team-member.component';
import { EntryComponentsModule } from 'src/app/entry.components.module';

export const componentList = [AddReportingManagerComponent, AddNewRoleComponent, AddArnRiaDetailsComponent, AddCamsDetailsComponent, AddKarvyDetailsComponent, AddFranklinTempletionDetailsComponent, AddCamsFundsnetComponent, SettingSchemeDetailsComponent, AddModelPortfolioComponent,
  AddPersonalProfileComponent, AddTaskTemplateComponent, NewTeamMemberComponent]

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule,
    EntryComponentsModule
  ],
  entryComponents: componentList
})
export class SettingEntryModule {
  static getComponentList() {
    return componentList;
  }
}
