import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  name: string;

  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'FUTUREWISE TECHNOLOGIES PVT. LTD.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '12.29 PM' },
  { name: 'Myaccount', weight: 'Confirmation of Dividend Reinvestment|Folio No.901..      Dear investor, thank you for investing in the Dividend...', symbol: '12.08 PM' },
  { name: 'Shankar.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'Srinivasan Chandraekhar.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'Payments', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'ICICI Bank', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'FUTUREWISE TECHNOLOGIES PVT. LTD.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'FUTUREWISE TECHNOLOGIES PVT. LTD.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'FUTUREWISE TECHNOLOGIES PVT. LTD.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '12.29 PM' },
  { name: 'Myaccount', weight: 'Confirmation of Dividend Reinvestment|Folio No.901..      Dear investor, thank you for investing in the Dividend...', symbol: '12.08 PM' },
  { name: 'Shankar.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'Srinivasan Chandraekhar.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'Payments', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'ICICI Bank', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'FUTUREWISE TECHNOLOGIES PVT. LTD.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },
  { name: 'FUTUREWISE TECHNOLOGIES PVT. LTD.', weight: 'Rahul Jain s Fixed Deposit matured on 28-09-2019...        Dear Rahul, this is to inform you that fixed deposit is...', symbol: '    OCT 04' },

];
@Component({
  selector: 'app-overview-email',
  templateUrl: './overview-email.component.html',
  styleUrls: ['./overview-email.component.scss']
})
export class OverviewEmailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA
}
