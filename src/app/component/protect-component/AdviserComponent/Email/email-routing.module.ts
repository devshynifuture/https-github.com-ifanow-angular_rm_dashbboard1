import { EmailComponent } from './email-component/email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import {EmailArchiveComponent} from './email-component/email-archive/email-archive.component';
import { EmailSettingsComponent } from './email-component/email-settings/email-settings.component';



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
      // {
      //   path: 'starred',
      //   loadChildren: () => import('./email-component/email-list/email-list.module')
      //     .then(m => m.EmailListModule)
      // },
      {
        path: 'trash',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: 'email-settings',
        component: EmailSettingsComponent
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
