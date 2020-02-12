import { ELEMENT_DATA1 } from './../../customers/component/customer/plan/cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add-surplus/cashflow-add-surplus.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-support-aum-reconciliation',
  templateUrl: './support-aum-reconciliation.component.html',
  styleUrls: ['./support-aum-reconciliation.component.scss']
})
export class SupportAumReconciliationComponent implements OnInit {

  constructor(private router: Router) {

  }



  ngOnInit() {
    this.router.navigate(['/support/aum-reconciliation/all-rta'])
  }

}



