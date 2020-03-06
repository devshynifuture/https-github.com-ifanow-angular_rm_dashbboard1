import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClientComponent } from './Component/people-clients/add-client/add-client.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LeadsClientsComponent } from './Component/people-leads/leads-clients/leads-clients.component';


export const componentList = [AddClientComponent, LeadsClientsComponent]
@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ], entryComponents: [componentList]
})
export class PeopleEntryModule {
  static getComponentList() {
    return componentList;
  }
}