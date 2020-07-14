import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-component',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  displayedColumns = ['checkbox', 'position', 'name', 'img', 'symbol'];
  dataSource = ELEMENT_DATA;
  isCustomerEmail: boolean;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    let location;
    location = this.router.url.split('/')[this.router.url.split('/').length - 1];
    if (this.router.url.split('/').includes('customer')) {
      this.isCustomerEmail = true;
    } else {
      this.isCustomerEmail = false;
    }
  }

  // tabs = ['Primary', 'Social', 'Promotions', 'Forum'];
  // selected = new FormControl(0);


}
export interface PeriodicElement {
  name: string;
  position: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },

];