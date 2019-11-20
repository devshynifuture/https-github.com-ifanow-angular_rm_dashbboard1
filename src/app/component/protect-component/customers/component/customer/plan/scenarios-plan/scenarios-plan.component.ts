import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-scenarios-plan',
  templateUrl: './scenarios-plan.component.html',
  styleUrls: ['./scenarios-plan.component.scss']
})
export class ScenariosPlanComponent implements OnInit {
  

  constructor(private subInjectService: SubscriptionInject) { }
   
  displayedColumns: string[] = ['description', 'year', 'month', 'lumpsum'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['member', 'year', 'status'];
  dataSource2 = ELEMENT_DATA2;
  ngOnInit() {
    
  }

  open(flagValue){
    const fragmentData = {
      Flag: flagValue,
      id: 1,
      state: 'open'
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
  description: string;
  year: string;
  month: string;
  lumpsum: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900'}, 
  {description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900'}, 
  {description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900'}, 
  {description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900'}, 
  {description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900'}, 
];



export interface PeriodicElement2 {
  member: string;
  year: string;
  status: string;
}


const ELEMENT_DATA2: PeriodicElement2[] = [
  {member: 'Rahul Jain', year: '2020 - 21', status: 'No impact'}, 
  {member: 'Shilpa Jain', year: '2020 - 21', status: '30,000'}, 
  {member: 'Aryan Jain', year: '2020 - 21', status: 'Not applicable'}, 
  {member: 'Shreya Jain', year: '2020 - 21', status: 'Not applicable'}, 
  {member: 'Aryan Jain ', year: '2020 - 21', status: 'Not applicable'}, 
];