import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { AddHealthInsuranceComponent } from '../add-health-insurance/add-health-insurance.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-insurance-upper',
  templateUrl: './add-insurance-upper.component.html',
  styleUrls: ['./add-insurance-upper.component.scss']
})
export class AddInsuranceUpperComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }

  ngOnInit() {
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: AddInsuranceUpperComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  openHelthInsurance(data){
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
