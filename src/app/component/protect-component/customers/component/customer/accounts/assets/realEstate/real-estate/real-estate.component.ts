import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import * as _ from 'lodash';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { AddRealEstateComponent } from '../add-real-estate/add-real-estate.component';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {
  advisorId: any;
  datasource3: any;
  clientId: any;
  ownerName: any;
  sumOfMarketValue: any;
  sumOfpurchasedValue: any;
  showLoader: boolean;

  constructor(public subInjectService:SubscriptionInject,publicutilService:UtilService,public custmService:CustomerService,public cusService:CustomerService,public eventService:EventService,public dialog: MatDialog) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.showLoader=true;
    this.getRealEstate();
  }
  displayedColumns3 = ['no', 'owner', 'type', 'value', 'pvalue', 'desc', 'status', 'icons'];
  // datasource3 = ELEMENT_DATA3;

  getRealEstate() {
    let obj = {
      'advisorId': this.advisorId,
      'clientId': this.clientId
    }
    this.custmService.getRealEstate(obj).subscribe(
      data => this.getRealEstateRes(data)
    );
  }
  getRealEstateRes(data){
    console.log(data)
    if(data){
      this.showLoader=false
    }
    data.realEstateList.forEach(element => {
      if (element.realEstateOwners.length!=0) {
        var array=element.realEstateOwners;
        var ownerName = _.filter(array, function (n) {
          return n.owner == true;
        });
        if(ownerName.length!=0){
          this.ownerName=ownerName[0].ownerName;
          element.ownerName=this.ownerName
        }
      }
    });
  

    this.datasource3=data.realEstateList;
    this.sumOfMarketValue=data.sumOfMarketValue;
    this.sumOfpurchasedValue=data.sumOfpurchasedValue;
  }
  deleteModal(value,data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteRealEstate(data.id).subscribe(
          data=>{
            this.eventService.openSnackBar("Real estate is deleted","dismiss")
            dialogRef.close();
            this.getRealEstate();
          },
          err=>this.eventService.openSnackBar(err)
        )
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  open(value, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName:AddRealEstateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getRealEstate();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement3 {
  no: string;
  owner: string;
  type: string;
  value: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { no: '1.', owner: 'Rahul Jain', type: 'Type', value: '60,000', pvalue: '60,000', desc: 'ICICI FD', status: 'ICICI FD' },
  { no: '1.', owner: 'Rahul Jain', type: 'Type', value: '60,000', pvalue: '60,000', desc: 'ICICI FD', status: 'ICICI FD' },
  { no: ' ', owner: 'Total', type: '', value: '1,28,925', pvalue: '1,28,925', desc: '', status: ' ' },
];