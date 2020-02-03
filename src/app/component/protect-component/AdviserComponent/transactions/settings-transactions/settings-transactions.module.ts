import { MaterialModule } from './../../../../../material/material';
import { NgModule } from '@angular/core';
import { SettingsManageCredentialsComponent } from './settings-manage-credentials/settings-manage-credentials.component';
import { SettingsTransactionRoutingModule } from './settings-transactions-routing.module';
import { SettingsTransactionsComponent } from './settings-transactions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsClientMappingComponent } from './settings-client-mapping/settings-client-mapping.component';
import { SettingsFolioMappingComponent } from './settings-folio-mapping/settings-folio-mapping.component';
import { SettingsClientSettingsComponent } from './settings-client-settings/settings-client-settings.component';
import { SettingsEmpanelledAmcComponent } from './settings-empanelled-amc/settings-empanelled-amc.component';
import { ArnRiaCredentialsComponent } from './settings-manage-credentials/arn-ria-credentials/arn-ria-credentials.component';
import { SubBrokerTeamMemberComponent } from './settings-manage-credentials/sub-broker-team-member/sub-broker-team-member.component';


@NgModule({
    declarations: [
        SettingsTransactionsComponent,
        SettingsManageCredentialsComponent,
        SettingsClientMappingComponent,
        SettingsFolioMappingComponent,
        SettingsClientSettingsComponent,
        SettingsEmpanelledAmcComponent,
        ArnRiaCredentialsComponent,
        SubBrokerTeamMemberComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SettingsTransactionRoutingModule
    ],
    exports: [

    ]
})
export class SettingsTransactionsModule { }