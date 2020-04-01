import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClientComponent } from './Component/people-clients/add-client/add-client.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LeadsClientsComponent } from './Component/people-leads/leads-clients/leads-clients.component';
import { ClientBasicDetailsComponent } from './Component/people-clients/add-client/client-basic-details/client-basic-details.component';
import { ClientMoreInfoComponent } from './Component/people-clients/add-client/client-more-info/client-more-info.component';
import { ClientAddressComponent } from './Component/people-clients/add-client/client-address/client-address.component';
import { ClientBankComponent } from './Component/people-clients/add-client/client-bank/client-bank.component';
import { ClientDematComponent } from './Component/people-clients/add-client/client-demat/client-demat.component';
import { ClientUploadComponent } from './Component/people-clients/add-client/client-upload/client-upload.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AddNumberComponent } from './Component/people-clients/add-client/add-number/add-number.component';


export const componentList = [AddClientComponent, LeadsClientsComponent, ClientBasicDetailsComponent, ClientMoreInfoComponent, ClientAddressComponent, ClientBankComponent, ClientDematComponent, ClientUploadComponent, AddNumberComponent]
@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ], entryComponents: [componentList]
})
export class PeopleEntryModule {
  static getComponentList() {
    return componentList;
  }
}