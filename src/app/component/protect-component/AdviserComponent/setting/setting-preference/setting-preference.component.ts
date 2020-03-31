import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { OrgSettingServiceService } from '../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OpenEmailVerificationComponent } from './open-email-verification/open-email-verification.component';
import { MatDialog } from '@angular/material';
import { CommonFroalaComponent } from '../../Subscriptions/subscription/common-subscription-component/common-froala/common-froala.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-setting-preference',
  templateUrl: './setting-preference.component.html',
  styleUrls: ['./setting-preference.component.scss']
})
export class SettingPreferenceComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource1 = ELEMENT_DATA1;
  viewMode = 'tab1';
  advisorId: any;
  portfolio: any;
  mutualFund: any;
  mutualFund2: any;
  factSheet: any;
  planSec1: any;
  planSection: any;
  domainSetting: any;
  updateDomain: any;
  emailDetails: any;
  element: any;
  emailList: any;
  normalDomain: any;
  whiteLabledDomain: any;
  emailTemplateList: any;
  showUpdate = false;
  normalLable;
  whiteLable;
  domain: any;
  domainS: any;
  clientData
  userId: any;
  showUpdateWhite = false;
  isLoading = false
  constructor(private orgSetting: OrgSettingServiceService,
    public subInjectService: SubscriptionInject, private eventService: EventService, public dialog: MatDialog, private fb: FormBuilder, ) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.userId = AuthService.getUserId()
    console.log('3456893469 ===', this.userId)
    this.getPortfolio()
    this.getdataForm('')
    this.isLoading = false
    this.emailList =[]
    this.planSection = []
    this.emailTemplateList =[]
  }
  getdataForm(data) {
    this.domainS = this.fb.group({
      normalLable: [(!data) ? '' : data.emailId, [Validators.required]],
      whiteLable: [(!data) ? '' : data.emailId, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.domainS.controls;
  }
  getDomain() {
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getDomainSetting(obj).subscribe(
      data => this.getDomainSettingRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getDomainSettingRes(data) {
    console.log(data)
    this.domainSetting = data
    this.normalDomain = this.domainSetting.filter(element => element.domainOptionId == 1)
    this.whiteLabledDomain = this.domainSetting.filter(element => element.domainOptionId == 2)
    this.normalLable = this.normalDomain[0].optionValue
    this.whiteLable = this.whiteLabledDomain[0].optionValue
    this.domainS.controls.normalLable.setValue(this.normalLable)
    this.domainS.controls.whiteLable.setValue(this.whiteLable)
    console.log('normalDomain', this.normalDomain)
    console.log('whiteLabled', this.whiteLabledDomain)
  }
  updateDomainSetting(event, value) {
    console.log(event)
    this.domainSetting.forEach(element => {
      if (element.domainOptionId == value.domainOptionId) {
        if (value.domainOptionId == 1) {
          element.optionValue = this.domainS.controls.normalLable.value;
        } else {
          element.optionValue = this.domainS.controls.whiteLable.value;
        }

      }
    });
    this.orgSetting.updateDomainSetting(this.domainSetting).subscribe(
      data => this.updateDomainSettingRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updateDomainSettingRes(data) {
    console.log(data)
    this.updateDomain = data
    this.getDomain()
  }
  editDomain(flag, event, value) {
    if (flag == true) {
      if (event == 'white') {
        this.showUpdateWhite = true
      } else {
        this.showUpdate = true
      }

    } else {
      if (event == 'white') {
        this.showUpdateWhite = false
      } else {
        this.showUpdate = false
      }
      this.updateDomainSetting(event, value)
    }
  }
  getPortfolio() {
    this.isLoading = true;
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getPortfolio(obj).subscribe(
      data => this.getPortfolioRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getPortfolioRes(data) {
    this.isLoading = false
    console.log('getPortfolioReslase == ', data)
    this.portfolio = data
    this.mutualFund = this.portfolio.filter(element => element.portfolioOptionId == 1)
    this.mutualFund = this.mutualFund[0]
    this.mutualFund2 = this.portfolio.filter(element => element.portfolioOptionId == 2)
    this.mutualFund2 = this.mutualFund2[0]
    this.factSheet = this.portfolio.filter(element => element.portfolioOptionId == 3)
  }

  getPlan() {
    this.isLoading = true
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getPlans(obj).subscribe(
      data => this.getPlanRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  test = []
  selectMutualFund(event, value) {

    this.portfolio.forEach(element => {
      if (element.planOptionId == value.planOptionId) {
        element.selectedOrDeselected = (event.checked == true) ? 1 : 0;
      }
    });
    console.log(this.portfolio)
    const obj = this.portfolio
    this.orgSetting.updatePortFolio(obj).subscribe(
      data => this.updatePortFolioRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updatePortFolioRes(data) {
    console.log('updatePortFolio', data)
  }
  selectPlan(event, value) {
    this.planSection.forEach(element => {
      if (element.portfolioOptionId == value.planOptionId) {
        element.selectedOrDeselected = (event.checked == true) ? 1 : 0;
      }
    });
    console.log(this.planSection)
    var obj = this.planSection
    this.orgSetting.updatePlanSection(obj).subscribe(
      data => this.updatePlanSectionRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updatePlanSectionRes(data) {
    console.log('updatePlanSectionRes ==', data)
  }
  verifyEmail(value) {
    const dialogRef = this.dialog.open(OpenEmailVerificationComponent, {
      width: '400px',
      data: { bank: value, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
      let obj = {
        emailAddress: this.element,
        userId: 12249
      }
      this.orgSetting.addEmailVerfify(obj).subscribe(
        data => this.addEmailVerfifyRes(data),
        err => this.eventService.openSnackBar(err, "Dismiss")
      );
      //  this.bankDetailsSend.emit(result);
    });
  }
  addEmailVerfifyRes(data) {
    console.log(data)
    this.getEmailVerification()
  }
  getPlanRes(data) {
    console.log('getPortfolioRes == ', data)
    if(data){
      this.planSection = data
      this.planSec1 = this.planSection.filter(element => element.planOptionId == 1)
      console.log('planSec1 ', this.planSec1)
    }else{
      this.isLoading = false
      this.planSection = []
    }
   
  }
  getEmailVerification() {
    this.isLoading = true
    let obj = {
      userId: 12249,
      advisorId: 414
    }
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => this.getEmailVerificationRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getEmailVerificationRes(data) {
    this.isLoading = false
    console.log('email verify == get', data)
    if(data){
      this.emailDetails = data
      this.emailList = data.listItems
    }else{
      this.emailList = []
    }
   
  }
  getEmailTemplate() {
    this.isLoading = true
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getEmailTempalate(obj).subscribe(
      data => this.getEmailTempalatRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getEmailTempalatRes(data) {
    this.isLoading = false
    if(data){
      console.log('emailTemplate', data)
      this.emailTemplateList = data
    }else{
      this.emailTemplateList = []
    }
   
  }
  OpenEmail(value, data) {
    if (this.isLoading) {
      return;
    }
    let obj = {
      documentText: data.body
    }
    const fragmentData = {
      flag: value,
      data: obj,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getEmailTemplate();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'archit.gupta@acmefinancial.com', name: 'Verified' },
  { position: 'welcome@acmefinancial.com', name: 'Verification in process' },
  { position: 'info@acmefinancial.com', name: 'Verification failed' },

];



export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Welcome email', name: 'Used when creating a new client or converting prospect to client',
    weight: 'welcome@acmefinancial.com',
  },

];
