import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
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
import { SubscriptionService } from '../../AdviserComponent/Subscriptions/subscription.service';
import { PeopleService } from '../../PeopleComponent/people.service';
import { SettingsService } from '../../AdviserComponent/setting/settings.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  fragmentData = { isSpinner: false };
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
  fromEmail: any;
  getOrgData: any;
  toEmail: any;
  clientId: any;
  storedData: any;
  isLoadingClient = false;
  advisorId: any;
  constructor(private authService: AuthService, private settingsService: SettingsService, private peopleService: PeopleService, private subscription: SubscriptionService, private cd: ChangeDetectorRef, private ngZone: NgZone, private utilService: UtilService, private dialog: MatDialog, private subInjectService: SubscriptionInject, private cusService: CustomerService, private Location: Location, private eventService: EventService, private activateRoute: ActivatedRoute, private route: Router, private datePipe: DatePipe) {
    // this.clientData = AuthService.getClientData();
    this.getOrgData = AuthService.getOrgDetails();
  }
  emailBody = `
  <html>
  <head></head>
  <body>
   
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Dear
              $client_name,</span></p>
     <p class="pt-10 roboto">Thank you for your consent & find the attached document for your reference. If you still wish to change/modify anything please do reply to this email.</p>
  </body>
  </html>`;
  // <p #subBody class="pt-28 f-700 roboto">Request for advice consent from $company_name.
  // </p>
  //   <p class="pt-10 roboto">You need to give your Consent in order to help us proceed further.You can go by
  //   clicking here or on the button below</p>
  //   <button mat-stroked-button class="btn-primary">PROCEED
  //  </button>
  //   <p class="pt-10 roboto">Consent link URL : http://www.my-planner/consent_confimramtion.html</p>
  //   <p class="pt-10 ">Feel free to get back to us if you have any questions</p>
  //   <i class="material-icons">
  //   more_horiz</i>
  displayedColumns2: string[] = ['position', 'investorName', 'policyName', 'currentValue', 'sumAssured', 'premium', 'advice', 'astatus', 'adate', 'view', 'actions'];
  displayedColumns: string[] = ['position', 'investorName', 'schemeDetails', 'currentValue', 'notionalGain', 'expDate', 'advice', 'astatus', 'adate', 'view', 'actions'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  selectedConsent = [];
  ngOnInit() {
    // this.fromEmail = (this.getOrgData ? this.getOrgData.email : '');
    this.getGlobalDataInsurance();
    this.activateRoute.queryParams.subscribe(
      params => {
        this.isLoading = true;
        this.getConsentDetails(params.groupId);
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
    if (data.adviceToLifeInsurance) {
      let catId = data.adviceToLifeInsurance.insuranceCategoryTypeId;
      let id = data ? (data.adviceToLifeInsurance ? (data.adviceToLifeInsurance.insuranceAdviceId) : this.adviceName) : this.adviceName;
      this.adviceName = (id == 0) ? 'Proposed policy' : (id == 1) ? 'Continue' : (id == 2) ? 'Surrender' : (id == 3) ? 'Stop paying premium' : (id == 4) ? 'Take loan' : (id == 5) ? 'Partial withdrawl' : ''
      this.heading = (catId == 42) ? 'Term Insurance' : (catId == 42) ? 'Term insurance' : (catId == 43) ? 'Traditional insurance' : 'Ulip insurance'
      data.adviceDetails = {
        adviceGivenDate: data.advice.createdDate, applicableDate: data.advice.applicableDate,
        adviceDescription: data.adviceToLifeInsurance.adviceDescription, adviceStatusId: data.adviceToLifeInsurance.adviceStatusId, adviceAllotment: data.adviceToInsuranceProperties.adviceAllotment ? data.adviceToInsuranceProperties.adviceAllotment : null
      };
    } else if (data.adviceToGenInsurance) {
      let catId = data.adviceToGenInsurance.genInsuranceCategoryTypeId;
      let id = data ? (data.adviceToGenInsurance ? (data.adviceToGenInsurance.genInsuranceAdviceId) : this.adviceName) : this.adviceName;
      this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : 'Proposed policy'
      this.heading = (catId == 34) ? 'Health Insurance' : (catId == 35) ? 'Personal accident' : (catId == 36) ? 'Critical illness' : (catId == 36) ? 'Critical illness' : (catId == 37) ? 'Motor insurance' :
        (catId == 38) ? 'Travel insurance' : (catId == 39) ? 'Home insurance' : 'Fire & special perils insurance'
      data.adviceDetails = {
        adviceGivenDate: data.advice.createdDate, applicableDate: data.advice.applicableDate,
        adviceDescription: data.adviceToGenInsurance.adviceDescription, adviceStatusId: data.adviceToGenInsurance.adviceStatusId, adviceAllotment: data.adviceToGenInsuranceProperties.adviceAllotment ? data.adviceToGenInsuranceProperties.adviceAllotment : null
      };
    }

    const dialogRef = this.dialog.open(DialogDetailedViewInsPlanningComponent, {
      width: '50%',
      data: {
        data: data,
        displayList: this.displayList,
        allInsurance: this.allInsurance,
        insuranceTypeId: data ? 1 : null,
        insuranceSubTypeId: data ? data.insuranceSubTypeId : null,
        adviceName: this.adviceName,
        showInsurance: { heading: this.heading },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // setTimeout(() => {
      //     this.bankList = this.enumService.getBank();
      // }, 5000);
    })

  }
  getClientAndAdvisorData() {
    const obj = {
      clientId: this.clientId
    };
    const obj2 = {
      advisorId: this.advisorId,
    };
    const clientData = this.peopleService.getClientOrLeadData(obj).pipe(
      catchError(error => of(null))
    );
    const advisorData = this.settingsService.getOrgProfile(obj2).pipe(
      catchError(error => of(null))
    );
    forkJoin(clientData, advisorData).subscribe(result => {
      this.isLoadingClient = true;
      if (result[0]) {
        this.clientData = result[0];
        this.dataSource.data = this.storedData;
        this.authService.setClientData(result[0]);
      }
      if (result[1]) {
        this.getOrgData = result[1];
        AuthService.setOrgDetails(result[1]);
      }
      this.ngZone.run(() => {
        this.isLoading = false;
        this.cd.detectChanges();
        // this.utilService.htmlToPdf(null, para.innerHTML, 'MF summary', 'true', this.fragmentData, '', '', true);
      });
      console.log('dddddddddddddddddddddddddddddddddd', this.clientData)
    }, err => {
      console.error(err);
    })
  }
  getClientData(clientId) {
    const obj = {
      clientId: clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        this.isLoadingClient = true;
        this.clientData = data;
        this.dataSource.data = this.storedData;
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cd.detectChanges();
          // this.utilService.htmlToPdf(null, para.innerHTML, 'MF summary', 'true', this.fragmentData, '', '', true);
        });
        console.log('dddddddddddddddddddddddddddddddddd', this.clientData)

      },
      err => {
        console.error(err);
      }
    );
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
    // if (data[val] && data[val] && data[val].hasOwnProperty("insuredMembers") &&
    //   data[val].insuredMembers.length > 0) {
    //   data[val].displayHolderName = data[val].insuredMembers[0].name;
    //   if (data[val].insuredMembers.length > 0) {
    //     for (let i = 1; i < data[val].insuredMembers.length; i++) {
    //       if (data[val].insuredMembers[i].name) {
    //         const firstName = (data[val].insuredMembers[i].name as string).split(' ')[0];
    //         data[val].displayHolderName += ', ' + firstName;
    //       }
    //     }
    //   }
    // } else {
    //   data[val].displayHolderName = data[val].policyHolderName;
    // }
    // if (data && data[val]) {
    //   this.clientId = data[val].clientId
    //   console.log('dddddddddddddddddddddddddddddddddddddddddddddd', this.clientId);
    //   if (!this.isLoadingClient) {
    //     this.getClientData(this.clientId);
    //     this.isLoadingClient = true;
    //   }
    // }
    if (data[val] && data[val].insuredMembers && data[val].hasOwnProperty("insuredMembers") &&
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
    if (!data[val].sumAssured && data[val].hasOwnProperty("insuredMembers") &&
      data[val].insuredMembers.length > 0) {
      data[val].sumAssured = 0;
      data[val].insuredMembers.forEach(ele => {
        data[val].sumAssured += ele.sumInsured;
      });
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
              if (element.stringObject.FICT && element.stringObject.REAL) {
                element.name = 'REAL'
                this.getSumAsssuredAndName(element.stringObject, 'FICT');
                this.getSumAsssuredAndName(element.stringObject, 'REAL');
                this.advisorId = element.stringObject.REAL.advisorId;
              } else if (element.stringObject.FICT) {
                element.name = 'FICT';
                this.getSumAsssuredAndName(element.stringObject, 'FICT');
                this.advisorId = element.stringObject.FICT.advisorId;
              } else {
                element.name = 'REAL';
                this.getSumAsssuredAndName(element.stringObject, 'REAL');
                this.advisorId = element.stringObject.REAL.advisorId;
              }
            }
          } else {
            if (element.stringObject.FICT) {
              element.stringObject.REAL = element.stringObject.FICT;
              this.advisorId = element.stringObject.REAL.advisorId;
              // this.getClientIdFun(element.stringObject, 'REAL')
            }
          }
          // if (!this.isLoadingClient) {
          //   this.clientId = element.clientId
          //   this.getClientData(this.clientId);
          //   this.isLoadingClient = true;
          // }
          if (!this.isLoadingClient) {
            this.clientId = element.clientId
            this.getClientAndAdvisorData();
            this.isLoadingClient = true;
          }
          let obj =
          {
            id: element.id,
            acceptedOrDeclined: element.acceptedOrDeclined,
            adviceId: element.adviceId,
            adviceUuid: this.paramData.groupId,
            actionPerformed: this.datePipe.transform(new Date(element.actionPerformed), 'yyyy-MM-dd'),
            advice: {
              "id": element.adviceId,
              "adviceToCategoryTypeMasterId": element.advice.adviceToCategoryTypeMasterId
            },
          }
          this.consentData.push(obj)
        });
        this.storedData = data;
        // this.dataSource.data = data;
        getAdviceSubs.unsubscribe();


      },
      error => {
        this.dataSource.data = [];
      }
    )

  }
  getOrgProfiles() {
    // this.utilService.loader(1)
    const obj = {
      advisorId: this.advisorId,
    };
    this.settingsService.getOrgProfile(obj).subscribe(
      data => {
        this.getOrgData = data;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.utilService.loader(-1);
      }
    );
  }
  getClientIdFun(data, val) {
    if (data && data[val]) {
      this.clientId = data[val].clientId
      console.log('dddddddddddddddddddddddddddddddddddddddddddddd', this.clientId);
      if (!this.isLoadingClient) {
        this.getClientData(this.clientId);
        this.isLoadingClient = true;
      }
    }
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
    const para = document.getElementById('templateEmail');
    console.log(para.innerHTML)
    this.toEmail = (this.clientData.emailList ? this.clientData.emailList[0].email : '');
    this.fromEmail = (this.getOrgData ? this.getOrgData.email : '');
    this.emailBody = this.emailBody.replace('$client_name', this.clientData.name);
    const obj = {
      messageBody: this.emailBody,
      emailSubject: 'Email advice request for consent ',
      fromEmail: this.fromEmail,
      toEmail: [{ emailAddress: this.toEmail }, { emailAddress: this.fromEmail }],
      documentList: [{ docText: para.innerHTML, documentName: 'Consent' }],
    };
    // this.utilService.htmlToPdf(null, para.innerHTML, 'MF summary', 'true', this.fragmentData, '', '', true);
    this.subscription.sendInvoiceEmail(obj).subscribe(
      data => {
        console.log(data)
      }, err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  acceptOrDeclineConsent(ele, index, choice) {
    ele.acceptedOrDeclined = choice;
    this.consentData[index].acceptedOrDeclined = choice;
    this.consentData[index].actionPerformed = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  dialogClose() {
    //this.Location.back();
    window.close();
  }
}
