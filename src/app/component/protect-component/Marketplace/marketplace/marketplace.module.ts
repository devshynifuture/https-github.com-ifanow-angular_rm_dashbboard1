import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

import {MarketplaceRoutingModule} from './marketplace-routing.module';
import {MarketplaceComponent} from './marketplace.component';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [MarketplaceComponent],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule

  ]
})
export class MarketplaceModule { }
