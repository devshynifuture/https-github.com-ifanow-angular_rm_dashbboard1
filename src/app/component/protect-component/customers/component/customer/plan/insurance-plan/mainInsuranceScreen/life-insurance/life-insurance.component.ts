import { Component, OnInit, Input } from '@angular/core';
import { AddPlaninsuranceComponent } from '../../add-planinsurance/add-planinsurance.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddSuggestPolicyComponent } from '../../add-suggest-policy/add-suggest-policy.component';

@Component({
  selector: 'app-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: ['./life-insurance.component.scss']
})
export class LifeInsuranceComponent implements OnInit {
  inputData: any;
  setLogo = [{
    heading: 'Life insurance',
    logo: '/assets/images/svg/LIbig.svg',

  }, {
    heading: 'Health insurance',
    logo: '/assets/images/svg/HIbig.svg',

  }, {
    heading: 'Critical illness',
    logo: '/assets/images/svg/CIbig.svg',

  }, {
    heading: 'Cancer care',
    logo: '/assets/images/svg/CCbig.svg',

  }, {
    heading: 'Personal accident',
    logo: '/assets/images/svg/PAbig.svg',

  }, {
    heading: 'Fire insurance',
    logo: '/assets/images/svg/Fibig.svg',
  }, {
    heading: 'Householders',
    logo: '/assets/images/svg/Hbig.svg'
  }]
  logo: any;
  getData: any;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.setDetails(data)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('inputData', this.inputData)
  }
  setDetails(data) {
    this.getData = data
    this.setLogo.forEach(element => {
      if (element.heading == data.heading) {
        this.logo = element.logo
      }
    });
  }
  needAnalysis(data) {
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: AddPlaninsuranceComponent,
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
  suggestPolicy(data) {
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: AddSuggestPolicyComponent,
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
