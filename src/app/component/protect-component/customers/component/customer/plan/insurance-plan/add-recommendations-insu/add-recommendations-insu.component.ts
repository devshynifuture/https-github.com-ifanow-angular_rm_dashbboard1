import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-recommendations-insu',
  templateUrl: './add-recommendations-insu.component.html',
  styleUrls: ['./add-recommendations-insu.component.scss']
})
export class AddRecommendationsInsuComponent implements OnInit {
  displayedColumns: string[] = ['policyName', 'sum', 'premium', 'returns', 'advice', 'empty'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  policyName: string;
  sum: string;
  premium: string;
  returns: string;
  advice: string;
  empty: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { policyName: 'LIC Jeevan Saral', sum: '20,00,000', premium: '27,000', returns: '4.78%', advice: 'Stop paying premiums', empty: '' },

];

