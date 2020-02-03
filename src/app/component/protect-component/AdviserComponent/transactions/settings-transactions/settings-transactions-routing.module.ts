import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsTransactionsComponent } from './settings-transactions.component';
import { SettingsManageCredentialsComponent } from './settings-manage-credentials/settings-manage-credentials.component';
import { SettingsClientMappingComponent } from './settings-client-mapping/settings-client-mapping.component';
import { SettingsFolioMappingComponent } from './settings-folio-mapping/settings-folio-mapping.component'
import { SettingsClientSettingsComponent } from './settings-client-settings/settings-client-settings.component';
import { SettingsEmpanelledAmcComponent } from './settings-empanelled-amc/settings-empanelled-amc.component';
import { ArnRiaCredentialsComponent } from './settings-manage-credentials/arn-ria-credentials/arn-ria-credentials.component';
import { SubBrokerTeamMemberComponent } from './settings-manage-credentials/sub-broker-team-member/sub-broker-team-member.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsTransactionsComponent,
        children: [
            {
                path: 'manage-credentials',
                component: SettingsManageCredentialsComponent,
                children: [
                    {
                        path: 'arn-ria-creds',
                        component: ArnRiaCredentialsComponent
                    },
                    {
                        path: 'sub-broker-team-member',
                        component: SubBrokerTeamMemberComponent
                    }
                ]
            },
            {
                path: 'client-mapping',
                component: SettingsClientMappingComponent
            },
            {
                path: 'folio-mapping',
                component: SettingsFolioMappingComponent
            },
            {
                path: 'client-settings',
                component: SettingsClientSettingsComponent
            },
            {
                path: 'empanelled-amc',
                component: SettingsEmpanelledAmcComponent
            }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsTransactionRoutingModule { }