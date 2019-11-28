import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-mf-allocations',
  templateUrl: './mf-allocations.component.html',
  styleUrls: ['./mf-allocations.component.scss']
})
export class MfAllocationsComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    // this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  
}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Lumpsum', name: '4,55,814', weight: '1,20,529'},
  {position: 'Monthly', name: '35,907', weight: '12,835'},
  
];