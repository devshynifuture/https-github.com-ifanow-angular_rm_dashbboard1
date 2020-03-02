import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-setup-tax-planning',
  templateUrl: './setup-tax-planning.component.html',
  styleUrls: ['./setup-tax-planning.component.scss']
})
export class SetupTaxPlanningComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'weight', 'symbol', 'symbol1'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }

  ngOnInit() {
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  symbol: string;
  weight: string;
  symbol1:string

}

const ELEMENT_DATA: PeriodicElement[] = [
  {  name: 'Ronak hindocha', weight: "200",symbol:'100',symbol1:'200' },

];
