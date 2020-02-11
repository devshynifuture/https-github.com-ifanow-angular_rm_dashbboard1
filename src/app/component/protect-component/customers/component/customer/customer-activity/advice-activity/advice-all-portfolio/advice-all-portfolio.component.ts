import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailAdviceComponent } from '../email-advice/email-advice.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-advice-all-portfolio',
  templateUrl: './advice-all-portfolio.component.html',
  styleUrls: ['./advice-all-portfolio.component.scss']
})
export class AdviceAllPortfolioComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  displayedColumns1: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'adate', 'icons'];
  dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  constructor(private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  @ViewChild("tableOne", { static: true }) sort1: MatSort;
  @ViewChild("tableTwo", { static: true }) sort2: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort1;
    this.dataSource1.sort = this.sort2;
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', },
  { position: 'Rahul Jain1', name: 'Surplus from life csh flows (Lumpsum)1', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal1', },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  date: string;
  adate: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given',
    date: '23/12/2019', adate: '23/12/2019'
  },
  {
    position: 'Rahul Jain2', name: 'Surplus from life csh flows (Lumpsum)1',
    weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal',
    status: 'Given', date: '23/12/2019', adate: '23/12/2019'
  },

]