import { BackofficeFolioMappingComponent } from './backoffice-folio-mapping.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '', component: BackofficeFolioMappingComponent,
    children: [
      // { path: }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeFolioMappingRoutingModule {
}
