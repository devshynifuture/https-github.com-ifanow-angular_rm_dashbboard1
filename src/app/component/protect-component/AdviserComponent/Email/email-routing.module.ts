import {EmailComponent} from './email-component/email.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmailArchiveComponent} from './email-component/email-archive/email-archive.component';


const routes: Routes = [
  {
    path: '',
    component: EmailComponent,
    children: [
      {
        path: 'inbox',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: 'sent',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: 'draft',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
        // component: EmailDraftComponent
      },
      {
        path: 'archive',
        component: EmailArchiveComponent
      },
      {
        path: 'trash',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: '',
        redirectTo: 'inbox',
        pathMatch: 'full'
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule {
}
