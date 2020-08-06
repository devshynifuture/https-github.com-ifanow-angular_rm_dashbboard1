import { SipCleanupComponent } from './sip-cleanup.component';
import { CustomDirectiveModule } from "./../../../../../../common/directives/common-directive.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SipCleanupRoutingModule } from './sip-cleanup-routing.module';

@NgModule({
  declarations: [
    SipCleanupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    SipCleanupRoutingModule
  ],
  exports: [],
})
export class SipCleanupModule {}
