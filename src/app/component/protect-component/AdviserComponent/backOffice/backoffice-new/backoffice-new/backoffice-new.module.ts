import { CustomDirectiveModule } from '../../../../../../common/directives/common-directive.module';
import { BackofficeNewRoutingModule } from './backoffice-new-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeNewComponent } from './backoffice-new.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [BackofficeNewComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomDirectiveModule,
        BackofficeNewRoutingModule
    ]
})
export class BackofficeNewModule { }
