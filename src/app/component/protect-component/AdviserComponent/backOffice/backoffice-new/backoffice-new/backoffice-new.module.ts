import { CustomDirectiveModule } from '../../../../../../common/directives/common-directive.module';
import { BackofficeNewRoutingModule } from './backoffice-new-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeNewComponent } from './backoffice-new.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
    declarations: [BackofficeNewComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CustomDirectiveModule,
        BackofficeNewRoutingModule
    ]
})
export class BackofficeNewModule { }
