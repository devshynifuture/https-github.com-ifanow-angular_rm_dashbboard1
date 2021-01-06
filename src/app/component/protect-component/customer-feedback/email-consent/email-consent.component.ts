import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DetailedViewInsurancePlanningComponent } from '../../customers/component/customer/plan/insurance-plan/detailed-view-insurance-planning/detailed-view-insurance-planning.component';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { DialogDetailedViewInsPlanningComponent } from '../../customers/component/customer/plan/insurance-plan/dialog-detailed-view-ins-planning/dialog-detailed-view-ins-planning.component';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-email-consent',
  templateUrl: './email-consent.component.html',
  styleUrls: ['./email-consent.component.scss']
})
export class EmailConsentComponent implements OnInit {
  consentData = [];
  isLoading: boolean;
  id: any;
  sumAssured: any;
  paramData: any;

  allInsurance = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }, {
    name: 'Health',
    id: 5
  }, { name: 'Personal accident', id: 7 }, { name: 'Critical illness', id: 6 }, {
    name: 'Motor',
    id: 4
  }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }];
  displayList: any;
  name: string;
  adviceName: any;
  heading: any;
  clientData: any;
  constructor(private dialog: MatDialog,private subInjectService: SubscriptionInject, private cusService: CustomerService, private Location: Location, private eventService: EventService, private activateRoute: ActivatedRoute, private route: Router, private datePipe: DatePipe) { 
    this.clientData = AuthService.getClientData();
  }
  displayedColumns2: string[] = ['position', 'investorName', 'policyName', 'currentValue', 'sumAssured', 'premium','advice','astatus','adate', 'view', 'actions'];
  displayedColumns: string[] = ['position', 'investorName', 'schemeDetails', 'currentValue', 'notionalGain', 'expDate','advice','astatus','adate', 'view', 'actions'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  selectedConsent = [];
  ngOnInit() {
    this.getGlobalDataInsurance();
    this.activateRoute.queryParams.subscribe(
      params => {
        this.isLoading = true;
        this.getConsentDetails(params.gropID);
        this.paramData = params;
        console.log(params)
      }
    )

  }
  getGlobalDataInsurance() {
    const obj = {};
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
          this.displayList = data;
      }
    );
  }
  openDialog(data): void {
    if(data.adviceToLifeInsurance){
      let catId = data.adviceToLifeInsurance.insuranceCategoryTypeId;
      let id = data ? (data.adviceToLifeInsurance ? (data.adviceToLifeInsurance.insuranceAdviceId) :this.adviceName ) :this.adviceName;
      this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Surrender' : (id == 3) ? 'Stop paying premium' : (id == 4) ? 'Take loan' : (id == 5) ? 'Partial withdrawl' : ''
      this.heading = (catId == 42) ? 'Term Insurance' : (catId == 42) ? 'Term insurance' : (catId == 43) ? 'Traditional insurance' : 'Ulip insurance'
      data.adviceDetails={adviceGivenDate:data.advice.createdDate,applicableDate:data.advice.applicableDate,
      adviceDescription:data.adviceToLifeInsurance.adviceDescription,adviceStatusId:data.adviceToLifeInsurance.adviceStatusId,adviceAllotment:data.adviceToInsuranceProperties.adviceAllotment ? data.adviceToInsuranceProperties.adviceAllotment : null};
    }else if(data.adviceToGenInsurance){
      let catId = data.adviceToGenInsurance.genInsuranceCategoryTypeId;
      let id = data ? (data.adviceToGenInsurance ? (data.adviceToGenInsurance.genInsuranceAdviceId) :this.adviceName ) :this.adviceName;
      this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' :  'Proposed policy'
      this.heading = (catId == 34) ? 'Health Insurance' : (catId == 35) ? 'Personal accident' : (catId == 36) ? 'Critical illness' : (catId == 36) ? 'Critical illness' : (catId == 37) ? 'Motor insurance' :
      (catId == 38) ? 'Travel insurance' :(catId == 39) ? 'Home insurance' : 'Fire & special perils insurance'
      data.adviceDetails={adviceGivenDate:data.advice.createdDate,applicableDate:data.advice.applicableDate,
        adviceDescription:data.adviceToGenInsurance.adviceDescription,adviceStatusId:data.adviceToGenInsurance.adviceStatusId,adviceAllotment:data.adviceToGenInsuranceProperties.adviceAllotment ? data.adviceToGenInsuranceProperties.adviceAllotment : null};
    }
    
    const dialogRef = this.dialog.open(DialogDetailedViewInsPlanningComponent, {
        width: '50%',
        data: {data: data,
          displayList: this.displayList,
          allInsurance: this.allInsurance,
          insuranceTypeId: data ? 1 : null,
          insuranceSubTypeId: data ? data.insuranceSubTypeId : null,
          adviceName : this.adviceName,
          showInsurance: {heading :this.heading},
         }
    });

    dialogRef.afterClosed().subscribe(result => {
        // setTimeout(() => {
        //     this.bankList = this.enumService.getBank();
        // }, 5000);
    })

}
  openDetailedView(data) {
    const sendData = {
      flag: 'detailedView',
      data: {},
      state: 'open',
      componentName: DetailedViewInsurancePlanningComponent
    };
    sendData.data = {
      data: data,
      displayList: this.displayList,
      allInsurance: this.allInsurance,
      showInsurance: null,


    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(sendData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  getSumAsssuredAndName(data, val) {
    if (data[val] && data[val] && data[val].hasOwnProperty("insuredMembers") &&
      data[val].insuredMembers.length > 0) {
      data[val].displayHolderName = data[val].insuredMembers[0].name;
      if (data[val].insuredMembers.length > 1) {
        for (let i = 1; i < data[val].insuredMembers.length; i++) {
          if (data[val].insuredMembers[i].name) {
            const firstName = (data[val].insuredMembers[i].name as string).split(' ')[0];
            data[val].displayHolderName += ', ' + firstName;
          }
        }
      }
    } else {
      data[val].displayHolderName = data[val].policyHolderName;
    }
    if (data[val].hasOwnProperty("policyFeatures") &&
      data[val].policyFeatures.length > 0) {
      data[val].policyFeatures.forEach(ele => {
        this.sumAssured += ele.featureSumInsured;
      });
      data[val].sumAssured = this.sumAssured;
      if (data[val].sumAssured == 0) {
        data[val].sumAssured = data[val].sumInsuredIdv;
      }
    } else {
      data[val].sumAssured = data[val].sumInsuredIdv;
    }
    if (data[val].hasOwnProperty("addOns") &&
      data[val].addOns.length > 0 && !data[val].sumAssured) {
      data[val].addOns.forEach(ele => {
        data[val].sumAssured += ele.addOnSumInsured;
      });
    }
  }
  getConsentDetails(data) {
    this.isLoading = true;
    const getAdviceSubs = this.cusService.getAdviceConsent(data).subscribe(
      data => {
        this.sumAssured = 0;
        data.forEach(element => {
          this.id = element.advice.adviceToCategoryTypeMasterId;
          if (this.id == 4) {
            if (element.stringObject) {
              if(element.stringObject.FICT && element.stringObject.REAL){
                this.getSumAsssuredAndName(element.stringObject, 'FICT');
                this.getSumAsssuredAndName(element.stringObject, 'REAL');
                this.name = 'REAL';
              }else if(element.stringObject.FICT){
                this.getSumAsssuredAndName(element.stringObject, 'FICT');
                this.name = 'FICT';
              }else{
                this.getSumAsssuredAndName(element.stringObject, 'REAL');
                this.name = 'REAL';
              }
            }
          }
          let obj =
          {
            id: element.id,
            acceptedOrDeclined: element.acceptedOrDeclined,
            adviceId: element.adviceId,
            adviceUuid: this.paramData.gropID,
            actionPerformed: this.datePipe.transform(new Date(element.actionPerformed), 'yyyy-MM-dd'),
            advice: {
              "id": element.adviceId,
              "adviceToCategoryTypeMasterId": element.advice.adviceToCategoryTypeMasterId
            },
          }
          this.consentData.push(obj)
        });
        this.dataSource.data = data;
        this.isLoading = false;
        getAdviceSubs.unsubscribe();
      },
      error => {
        this.dataSource.data = [];
      }
    )
  }

  save() {
    this.cusService.updateAssetConsent(this.consentData).subscribe(
      data => {
        this.eventService.openSnackBar("Consent updated", "Dismiss")

        setTimeout(() => {
          this.dialogClose()
        }, 300);
      }
    )
  }

  acceptOrDeclineConsent(ele, index, choice) {
    ele.acceptedOrDeclined = choice;
    this.consentData[index].acceptedOrDeclined = choice;
    this.consentData[index].actionPerformed = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  dialogClose() {
    this.Location.back();
  }
}
