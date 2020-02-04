import { ELEMENT_DATA1 } from './../../customers/component/customer/plan/cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add-surplus/cashflow-add-surplus.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support-aum-reconciliation',
  templateUrl: './support-aum-reconciliation.component.html',
  styleUrls: ['./support-aum-reconciliation.component.scss']
})
export class SupportAumReconciliationComponent implements OnInit {

  constructor(private router: Router) { }

  displayedColumns = ['rt', 'advisorName', 'arnria', 'doneOn', 'doneBy', 'total', 'before', 'after', 'aumBalance', 'transaction', 'report']
  dataSource = ELEMENT_DATA;

  ngOnInit() {
    this.router.navigate(['/support/aum-reconciliation/all-rta'])
  }

}


const ELEMENT_DATA = [
  { rt: 'Admin Name', advisorName: 'Hydrogen', arnria: 1.0079, doneOn: 'H', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Helium', arnria: 4.0026, doneOn: 'He', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Lithium', arnria: 6.941, doneOn: 'Li', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Beryllium', arnria: 9.0122, doneOn: 'Be', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Boron', arnria: 10.811, doneOn: 'B', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Carbon', arnria: 12.0107, doneOn: 'C', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Nitrogen', arnria: 14.0067, doneOn: 'N', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Oxygen', arnria: 15.9994, doneOn: 'O', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Fluorine', arnria: 18.9984, doneOn: 'F', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Neon', arnria: 20.1797, doneOn: 'Ne', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
];

