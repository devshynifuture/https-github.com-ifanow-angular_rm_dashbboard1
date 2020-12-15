import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsTransactionsComponent} from './settings-transactions.component';
import {SettingsManageCredentialsComponent} from './settings-manage-credentials/settings-manage-credentials.component';
import {SettingsClientMappingComponent} from './settings-client-mapping/settings-client-mapping.component';
import {SettingsFolioMappingComponent} from './settings-folio-mapping/settings-folio-mapping.component';
import {SettingsClientSettingsComponent} from './settings-client-settings/settings-client-settings.component';
import {SettingsEmpanelledAmcComponent} from './settings-empanelled-amc/settings-empanelled-amc.component';
import {ArnRiaCredentialsComponent} from './settings-manage-credentials/arn-ria-credentials/arn-ria-credentials.component';
import {SubBrokerTeamMemberComponent} from './settings-manage-credentials/sub-broker-team-member/sub-broker-team-member.component';
import {TransactionRoleGuard} from '../../../../../auth-service/transaction-role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: SettingsTransactionsComponent,
    children: [
      {
        path: 'manage-credentials',
        canActivate: [TransactionRoleGuard],
        component: SettingsManageCredentialsComponent,
        children: [
          {
            path: 'arn-ria-creds',
            component: ArnRiaCredentialsComponent,
          },
          {
            path: 'sub-broker-team-member',
            component: SubBrokerTeamMemberComponent
          },
          {
            path: '',
            redirectTo: 'arn-ria-creds',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'client-mapping',
        component: SettingsClientMappingComponent,
        canActivate: [TransactionRoleGuard],
      },
      {
        path: 'folio-mapping',
        component: SettingsFolioMappingComponent,
        canActivate: [TransactionRoleGuard],
      },
      {
        path: 'client-settings',
        component: SettingsClientSettingsComponent,
        canActivate: [TransactionRoleGuard],

      },
      {
        path: 'empanelled-amc',
        component: SettingsEmpanelledAmcComponent,
        canActivate: [TransactionRoleGuard],

      },
      {
        path: '',
        redirectTo: 'manage-credentials',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsTransactionRoutingModule {
}
