import { MaterialModule } from './../../../../../../material/material';
import { SipCleanupComponent } from './sip-cleanup.component';
import { CustomDirectiveModule } from "./../../../../../../common/directives/common-directive.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SipCleanupRoutingModule } from './sip-cleanup-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { RecordDetailsComponent } from './record-details/record-details.component';

@NgModule({
  declarations: [
    SipCleanupComponent,
    RecordDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    SipCleanupRoutingModule,
    MaterialModule
  ],
  exports: [],
})
export class SipCleanupModule { }
