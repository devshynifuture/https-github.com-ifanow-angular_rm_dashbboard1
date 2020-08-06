import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateChangeDialogComponent } from './mutual-funds/date-change-dialog/date-change-dialog.component';


const componentList = [DateChangeDialogComponent]

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule
  ],
  entryComponents: componentList,
})
export class BackofficeMisEntryModule {
  static getComponentList() {
    return componentList;

  }
}