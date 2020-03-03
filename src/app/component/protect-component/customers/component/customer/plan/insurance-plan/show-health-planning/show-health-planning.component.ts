import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SuggestHealthInsuranceComponent } from '../suggest-health-insurance/suggest-health-insurance.component';
import { AddHealthInsuranceComponent } from '../add-health-insurance/add-health-insurance.component';

@Component({
  selector: 'app-show-health-planning',
  templateUrl: './show-health-planning.component.html',
  styleUrls: ['./show-health-planning.component.scss']
})
export class ShowHealthPlanningComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'advice', 'icons'];
  dataSource = ELEMENT_DATA;
  inputData: any;
  showInsurance: any;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }


  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('insurance data',this.inputData)
    this.showInsurance = this.inputData
  }
  close(data){
    const fragmentData = {
      direction: 'top',
      componentName: ShowHealthPlanningComponent,
      state: 'close',
      data,
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  openSuggestHealth(data){
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: SuggestHealthInsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openHelthInsurance(data){
    if(data == null){
      data = {}
      data.showExisting = true
    }else{
      data.showExisting = true
    }
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: AddHealthInsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  advice: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Apollo Munich Optima Restore', name: '27,290/year', weight: 'Rahul Jain | 38Y',
    symbol: '5,00,000', advice: 'Port policy'
  },

];