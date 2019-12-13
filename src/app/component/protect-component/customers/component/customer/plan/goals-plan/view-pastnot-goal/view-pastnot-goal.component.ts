import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-view-pastnot-goal',
  templateUrl: './view-pastnot-goal.component.html',
  styleUrls: ['./view-pastnot-goal.component.scss']
})
export class ViewPastnotGoalComponent implements OnInit {
  displayedColumns = ['checkbox','position', 'name',];
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
 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "24/07/2019", name: 'Nixxon mutual fund'},
  {position: "24/07/2019", name: 'Nixxon mutual fund'},
  {position: "24/07/2019", name: 'Nixxon mutual fund'},
];