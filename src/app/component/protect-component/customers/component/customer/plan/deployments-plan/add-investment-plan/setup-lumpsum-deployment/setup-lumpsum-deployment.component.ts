import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { SearchSchemeComponent } from '../../search-scheme/search-scheme.component';
import { MatDialog } from '@angular/material';
import { AddAmountComponent } from '../../add-amount/add-amount.component';
import { SelectAssetClassComponent } from '../../select-asset-class/select-asset-class.component';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-setup-lumpsum-deployment',
  templateUrl: './setup-lumpsum-deployment.component.html',
  styleUrls: ['./setup-lumpsum-deployment.component.scss']
})
export class SetupLumpsumDeploymentComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'icons'];
  // dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['name', 'weight', 'height', 'test', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  advisorId: any;
  clientId: any;
  filterSchemeData: any;
  deploymentList: any;
  dataSource: any;
  isLoading = false;
  schemeData: any;
  dataForAddAmount: any;
  validatorType = ValidatorType
  constructor(private subInjectService: SubscriptionInject, private planService: PlanService, private eventService: EventService, public dialog: MatDialog) { }
  @Input() set data(data) {
    let lumpsum = [];
    data.deploymentIdList.forEach(element => {
      lumpsum.push(element.id)
    });
    this.deploymentList = lumpsum
    this.getDeploymentData(this.deploymentList);

  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getMutualFundSchemeData();
    // this.filterScheme();
  }
  getDeploymentData(data) {
    this.isLoading = true;
    this.dataSource = {
      EQUITY: [{}, {}, {}],
      DEBT: [{}, {}, {}],
      equity_investment: [{}, {}, {}],
      debt_investment: [{}, {}, {}]
    }
    let obj =
    {
      deploymentIds: this.deploymentList
    }
    this.planService.getDeploymentDetailsdata(obj).subscribe(
      data => {
        this.isLoading = false;
        console.log('deployment data -------------->', data);
        if(data){
        this.dataSource = data;
        this.dataForAddAmount = {
          EQUITY: this.dataSource.EQUITY,
          DEBT: this.dataSource.DEBT
        }
        }else{
          this.dataSource = {
            EQUITY: [],
            DEBT: [],
            equity_investment: [],
            debt_investment: []
          }
        }

      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.isLoading = false;
      }
    )

  }
  getMutualFundSchemeData() {
    this.planService.getMututalFundSchemeData().subscribe(
      data => {
        console.log('Scheme LIst Get *********************---->', data)
        if(data){
          this.schemeData = data
        }
      }
    )
  }
  filterScheme() {
    let obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.planService.getFilterGoalScheme(obj).subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          element['name'] = ''
          element.forEach(singleData => {
            switch (true) {
              case (singleData.categoryId == 1):
                element.name = "DEBT";
                break;
              case (singleData.categoryId == 2):
                element.name = "EQUITY";
                break;
              default:
                console.log("Test")
            }
          });
        });
        this.filterSchemeData = data;
      }
    )
  }
  openPopup(value, data) {
    let dialogRef
    if (value == 'addAmount') {
      let sendData = {
        data: data,
        dataForAddAmount: this.dataForAddAmount,
        deploymentList: this.deploymentList
      }
      dialogRef = this.dialog.open(AddAmountComponent, {
        width: '600px',
        height: '300px',
        data: sendData
      });
    } else if (value == 'searchAndAdd') {
      dialogRef = this.dialog.open(SearchSchemeComponent, {
        width: '600px',
        height: '300px',
        data: value
      });
    } else {
      dialogRef = this.dialog.open(SelectAssetClassComponent, {
        width: '600px',
        height: '300px',
        data: data
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result.isRefreshRequired){
        this.getDeploymentData(this.deploymentList);
      }
    });

  }

  addPurchaseScheme() {
    let obj = {
      "deploymentList": [
        { "id": 1 },
        { "id": 2 },
        { "id": 3 }
      ],
      "categoryId": 1,
      "purchaseAmount": 1,
      "schemeCode": "127FMGP",
      "clientId": this.clientId,
      "advisorId": this.advisorId
    }
    this.planService.addPurchaseScheme(obj).subscribe(
      data => {
        console.log(data)
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Equity', name: '1,80,000', weight: '1,30,000' },
  { position: 'Equity mutual funds', name: '1,80,000', weight: '1,30,000' },
  { position: 'Equity', name: '1,80,000', weight: '1,30,000' },
];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: '     Debt mutual funds', name: '50,000', weight: '0' },

];
export interface PeriodicElement2 {
  name: string;
  // position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Aditya birla sun life - Equity Savings Fund Regular Plan - Dividend reinvestment / 0980989898', weight: '50,000' },

];
