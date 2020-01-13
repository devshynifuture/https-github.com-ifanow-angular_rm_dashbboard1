import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
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
    this.flowCash('')
  }
  flowCash(id) {
    var chart1 = new Highcharts.Chart('flowCash', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cash Flow'
      },

      xAxis: {
        categories: []
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: 'Number of fruits'
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointWidth: 6
        }
      },
      series: [{
        name: 'John',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
        color: '#69A901'
      }, {
        name: 'Jane',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
        color: '#08CCB4'
      }, {
        name: 'Joe',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
        color: '#B19D74'
      }]
    });
  }

  open(flagValue) {
    const fragmentData = {
      flag: flagValue,
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
  { description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900' },
  { description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900' },
  { description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900' },
  { description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900' },
  { description: 'Retirement', year: '2037 - 2067', month: '35,000', lumpsum: '1,25,67,900' },
];



export interface PeriodicElement2 {
  member: string;
  year: string;
  status: string;
}


const ELEMENT_DATA2: PeriodicElement2[] = [
  { member: 'Rahul Jain', year: '2020 - 21', status: 'No impact' },
  { member: 'Shilpa Jain', year: '2020 - 21', status: '30,000' },
  { member: 'Aryan Jain', year: '2020 - 21', status: 'Not applicable' },
  { member: 'Shreya Jain', year: '2020 - 21', status: 'Not applicable' },
  { member: 'Aryan Jain ', year: '2020 - 21', status: 'Not applicable' },
];