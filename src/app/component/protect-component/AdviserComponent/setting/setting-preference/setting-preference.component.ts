import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { OrgSettingServiceService } from '../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OpenEmailVerificationComponent } from './open-email-verification/open-email-verification.component';
import { MatDialog } from '@angular/material';

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
  constructor(private orgSetting: OrgSettingServiceService, private eventService: EventService,public dialog: MatDialog,) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.getPortfolio()
  }
  getDomain(){
    let obj = {
      advisorId: 4443
    }
    this.orgSetting.getDomainSetting(obj).subscribe(
      data => this.getDomainSettingRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getDomainSettingRes(data){
    console.log(data)
    this.domainSetting = data
  }
  updateDomainSetting(){
    let obj  = {

    }
    this.orgSetting.updateDomainSetting(obj).subscribe(
      data => this.updateDomainSettingRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updateDomainSettingRes(data){
    console.log(data)
    this.updateDomain = data
  }
  getPortfolio() {
    let obj = {
      advisorId: 4443
    }
    this.orgSetting.getPortfolio(obj).subscribe(
      data => this.getPortfolioRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getPortfolioRes(data) {
    console.log('getPortfolioRes == ', data)
    this.portfolio = data
    this.mutualFund = this.portfolio.filter(element => element.portfolioOptionId == 1)
    this.mutualFund2 = this.portfolio.filter(element => element.portfolioOptionId == 2)
    this.factSheet = this.portfolio.filter(element => element.portfolioOptionId == 3)
    console.log('mutualfund ', this.mutualFund)
    console.log('mutualfund 2 ', this.mutualFund2)
  }

  getPlan() {
    let obj = {
      advisorId: 4443
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
  verifyEmail(){
    const dialogRef = this.dialog.open(OpenEmailVerificationComponent, {
      width: '470px',
      data: { bank: this.emailDetails, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==',this.element)
      let obj = {
        emailAddress:this.element,
        userId:12249
      }
      this.orgSetting.addEmailVerfify(obj).subscribe(
        data => this.addEmailVerfifyRes(data),
        err => this.eventService.openSnackBar(err, "Dismiss")
      );
    //  this.bankDetailsSend.emit(result);
    });
  }
  addEmailVerfifyRes(data){
    console.log(data)
    this.getEmailVerification()
  }
  getPlanRes(data) {
    console.log('getPortfolioRes == ', data)
    this.planSection = data
    this.planSec1 = this.planSection.filter(element => element.planOptionId == 1)
    console.log('planSec1 ', this.planSec1)
  }
  getEmailVerification(){
    let obj = {
      userId: 12249,
      advisorId: 414
    }
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => this.getEmailVerificationRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getEmailVerificationRes(data){
    console.log('email verify == get',data)
    this.emailDetails = data
    this.emailList = data.listItems
  }
  getEmailTemplate(){
    let obj = {
      advisorId: 4443
    }
    this.orgSetting.getEmailTempalate(obj).subscribe(
      data => this.getEmailTempalatRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getEmailTempalatRes(data){
    console.log('emailTemplate',data)
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
