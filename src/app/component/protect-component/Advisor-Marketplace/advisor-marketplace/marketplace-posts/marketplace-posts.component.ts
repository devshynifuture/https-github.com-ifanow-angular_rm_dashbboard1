import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketplace-posts',
  templateUrl: './marketplace-posts.component.html',
  styleUrls: ['./marketplace-posts.component.scss']
})
export class MarketplacePostsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','views','likes','menu'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  views:string;
  likes:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Five things to do for your personal finance durning Covid-19 Outbreak', 
  name: 'Financial Planning,Budgeting', weight: 'Basic,Advance', symbol: '30/03/2020',views:'479',likes:'29'},
  
];