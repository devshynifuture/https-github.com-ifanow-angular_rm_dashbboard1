import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'munit', 'mcost'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'munit', 'mcost'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  munit: string;
  mcost: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'MF only clients', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Multi asset reporting clients', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Financial planning clients', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Document vault', name: '5 GB', weight: '5.2 GB', symbol: '5.50 GB', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Clients with subscription', name: '50', weight: '78', symbol: '20', munit: '28', mcost: '₹56.00' },
  { position: 'Team member', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹6.00' },
  { position: 'ARN/RIA', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹6.00' },
  { position: 'White labeled mobile app', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹0.00' },
  { position: 'Branding package', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹0.00' },
  { position: 'Total', name: '', weight: '', symbol: '', munit: '', mcost: '₹1,162.12' },


];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  munit: string;
  mcost: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'MF only clients', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Multi asset reporting clients', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Financial planning clients', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Document vault', name: '5 GB', weight: '5.2 GB', symbol: '5.50 GB', munit: '₹2.00', mcost: '₹56.00' },
  { position: 'Clients with subscription', name: '50', weight: '78', symbol: '20', munit: '28', mcost: '₹56.00' },
  { position: 'Team member', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹6.00' },
  { position: 'ARN/RIA', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹6.00' },
  { position: 'White labeled mobile app', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹0.00' },
  { position: 'Branding package', name: '50', weight: '78', symbol: '20', munit: '₹2.00', mcost: '₹0.00' },
  { position: 'Total', name: '', weight: '', symbol: '', munit: '', mcost: '₹1,162.12' },


];