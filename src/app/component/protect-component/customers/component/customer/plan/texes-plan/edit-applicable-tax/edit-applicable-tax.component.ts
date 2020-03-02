import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-edit-applicable-tax',
  templateUrl: './edit-applicable-tax.component.html',
  styleUrls: ['./edit-applicable-tax.component.scss']
})
export class EditApplicableTaxComponent implements OnInit {
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'symbol1'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject,) { }

  ngOnInit() {
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}

export interface PeriodicElement {
  name: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul Jain' },
  { name: 'Shilpa Jain' },
];