import { MaterialModule } from "./../../../../../../material/material";
import { SipCleanupComponent } from "./sip-cleanup.component";
import { CustomDirectiveModule } from "./../../../../../../common/directives/common-directive.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SipCleanupRoutingModule } from "./sip-cleanup-routing.module";
import { RunSipMappingMasterComponent } from './run-sip-mapping-master/run-sip-mapping-master.component';


// import { RecordDetailsComponent } from './record-details/record-details.component';

@NgModule({
  declarations: [SipCleanupComponent, RunSipMappingMasterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    SipCleanupRoutingModule

  ],
  exports: [],
  entryComponents: [RunSipMappingMasterComponent]
})
export class SipCleanupModule { }
