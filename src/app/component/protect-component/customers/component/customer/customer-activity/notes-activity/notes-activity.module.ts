import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesActivityRoutingModule } from './notes-activity-routing.module';
import { NotesActivityComponent } from './notes-activity.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';


@NgModule({
  declarations: [NotesActivityComponent],
  imports: [
    CommonModule,
    NotesActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonComponentModule
  ]
})
export class NotesActivityModule { }
