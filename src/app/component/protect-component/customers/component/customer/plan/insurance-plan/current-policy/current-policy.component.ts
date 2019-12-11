import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-current-policy',
  templateUrl: './current-policy.component.html',
  styleUrls: ['./current-policy.component.scss']
})
export class CurrentPolicyComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol','advice','icons'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  advice:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'LIC Jeevan Saral', name: '20,00,000', weight: '27,000', symbol: '4.78%',advice:'Stop paying premiums'},
 
];