import { BackofficeNewComponent } from './backoffice-new.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
    {
        path: '', component: BackofficeNewComponent,
        children: [
            // { path: }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackofficeNewRoutingModule {
}
