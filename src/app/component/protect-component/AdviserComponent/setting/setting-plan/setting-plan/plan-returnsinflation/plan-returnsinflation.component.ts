import { Component, OnInit } from '@angular/core';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';


@Component({
  selector: 'app-plan-returnsinflation',
  templateUrl: './plan-returnsinflation.component.html',
  styleUrls: ['./plan-returnsinflation.component.scss']
})
export class PlanReturnsinflationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  advisorId: any;
  constructor(private orgSetting: OrgSettingServiceService, private eventService: EventService) { 
    this.advisorId = AuthService.getAdvisorId()
  }

  shortTermAsset =  [
      {
        "inflation_rate": 7,
        "class": "Debt Asset Class",
        "type": "Asset Class",
        extend: true 
      },
      {
        "inflation_rate": 12,
        "class": "Equity Asset Class"
      },
      {
        "inflation_rate": 7,
        "class": "Debt Funds",
        "type": "Mutual funds",
        extend: true 
      },
      {
        "inflation_rate": 12,
        "class": "Equity Funds"
      },
      {
        "inflation_rate": 8,
        "class": "Balanced Funds"
      },
      {
        "type": "Other Assets",
        extend: true ,
        "inflation_rate": 14,
        "class": "Stocks"
      },
      {
        "inflation_rate": 9,
        "class": "Real Estates"
      },
      {
        "inflation_rate": 4,
        "class": "Bank Accounts Saving"
      },
      {
        "inflation_rate": 7,
        "class": "Commodities - Gold"
      },
      {
        "inflation_rate": 7,
        "class": "Commodities- Others"
      }
    ]

  longTermAsset = [
    {
      "type": "Asset Class",
      extend: true, 
      "inflation_rate": 6,
      "class": "Debt Asset Class"
    },
    {
      "inflation_rate": 10,
      "class": "Equity Asset Class"
    },
    {
      "inflation_rate": 6,
      "class": "Debt Funds",
      "type": "Mutual funds",
      extend: true 
    },
    {
      "inflation_rate": 10,
      "class": "Equity Funds"
    },
    {
      "inflation_rate": 7,
      "class": "Balanced Funds"
    },
    {
      "inflation_rate": 12,
      "class": "Stocks",
      "type": "Other Assets",
      extend: true 
    },
    {
      "inflation_rate": 8,
      "class": "Real Estates"
    },
    {
      "inflation_rate": 3,
      "class": "Bank Accounts Saving"
    },
    {
      "inflation_rate": 6,
      "class": "Commodities - Gold"
    },
    {
      "inflation_rate": 6,
      "class": "Commodities- Others"
    }
  ]

  isExtendedRow = (index, item) => item.extend;

  ngOnInit() {
    // this.getAssetAllocationReturns()
  }

  // getAssetAllocationReturns() {
  //   let obj = {
  //     advisorId: this.advisorId
  //   }
  //   this.orgSetting.getRetuns(obj).subscribe(
  //     data => this.getReturnsRes(data),
  //     err => this.eventService.openSnackBar(err, "Dismiss")
  //   );
  // }
  // getReturnsRes(data){
  //   console.log('getReturnsRes',data)
  //   this.shortTerm = data.short_term
  //   this.longTerm =data.long_term
  // }

}
export interface PeriodicElement {

  position: string;
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Inflation rate', name: '7%' },

];