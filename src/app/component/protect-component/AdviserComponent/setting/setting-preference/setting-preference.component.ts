import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { OrgSettingServiceService } from '../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OpenEmailVerificationComponent } from './open-email-verification/open-email-verification.component';
import { MatDialog } from '@angular/material';
import { CommonFroalaComponent } from '../../Subscriptions/subscription/common-subscription-component/common-froala/common-froala.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { ConfirmDialogComponent } from '../../../common-component/confirm-dialog/confirm-dialog.component';
import { EmailOnlyComponent } from '../../Subscriptions/subscription/common-subscription-component/email-only/email-only.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-setting-preference',
  templateUrl: './setting-preference.component.html',
  styleUrls: ['./setting-preference.component.scss']
})
export class SettingPreferenceComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  subcription = new Subscription();
  viewMode = 'tab1';
  advisorId: any;
  portfolio: any;
  mutualFund: any = {};
  mutualFund2: any = {};
  mutualFund3: any = {};
  factSheet: any;
  planSec1: any;
  planSection: any = {};
  domainSetting: any = {};
  updateDomain: any = {};
  emailDetails: any = {};
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
  brandVisibility: any;
  showUpdateBrand: boolean = false;
  brandVisible: any;
  counter: number = 0;
  appearanceFG:FormGroup;
  appearanceUpdateFlag: boolean;
  constructor(private orgSetting: OrgSettingServiceService,
    public subInjectService: SubscriptionInject, private eventService: EventService, public dialog: MatDialog, private fb: FormBuilder, ) {
      
    this.advisorId = AuthService.getAdvisorId()
    this.userId = AuthService.getUserId()
  }

  ngOnInit() {
    this.getPortfolio()
    this.getdataForm('')
    this.emailList = []
    this.planSection = []
    this.emailTemplateList = []
    this.createAppearanceForm();
    this.addAppearanceFormListener();
  }
  getdataForm(data) {
    this.domainS = this.fb.group({
      normalLable: [(!data) ? '' : data.emailId, [Validators.required]],
      whiteLable: [(!data) ? '' : data.emailId, [Validators.required]],
      brandVisible: [(!data) ? '' : data.emailId, [Validators.required]]
    });
  }

  getFormControl(): any {
    return this.domainS.controls;
  }
  getDomain() {
    this.loader(1);
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getDomainSetting(obj).subscribe(
      data => this.getDomainSettingRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getDomainSettingRes(data) {
    this.loader(-1);
    this.domainSetting = data
    this.normalDomain = this.domainSetting.filter(element => element.domainOptionId == 1)
    this.whiteLabledDomain = this.domainSetting.filter(element => element.domainOptionId == 2)
    this.brandVisibility = this.domainSetting.filter(element => element.domainOptionId == 3)
    this.normalLable = this.normalDomain[0].optionValue
    this.whiteLable = this.whiteLabledDomain[0].optionValue
    this.brandVisible = (this.brandVisibility[0].optionValue == null) ? '' : this.brandVisibility[0].optionValue
    this.domainS.controls.normalLable.setValue(this.normalLable)
    this.domainS.controls.whiteLable.setValue(this.whiteLable)
    this.domainS.controls.brandVisible.setValue(this.brandVisible)
  }

  updateDomainSetting(event, value) {
    this.domainSetting.forEach(element => {
      if (element.domainOptionId == value.domainOptionId) {
        if (value.domainOptionId == 1) {
          element.optionValue = this.domainS.controls.normalLable.value;
        } else if (value.domainOptionId == 2) {
          element.optionValue = this.domainS.controls.whiteLable.value;
        } else {
          element.optionValue = this.domainS.controls.brandVisible.value;
        }
      }
      element.advisorId = this.advisorId;
    });
    this.orgSetting.updateDomainSetting(this.domainSetting).subscribe(
      data => this.updateDomainSettingRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  updateDomainSettingRes(data) {
    this.updateDomain = data
    this.getDomain()
  }

  editDomain(flag, event, value) {
    if (flag == true) {
      if (event == 'white') {
        this.showUpdateWhite = true
      } else if (event == 'normal') {
        this.showUpdate = true
      } else {
        this.showUpdateBrand = true
      }

    } else {
      if (event == 'white') {
        this.showUpdateWhite = false
      } else if (event == 'normal') {
        this.showUpdate = false
      } else {
        this.showUpdateBrand = false
      }
      this.updateDomainSetting(event, value)
    }
  }

  getPortfolio() {
    this.loader(1);
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getPortfolio(obj).subscribe(
      data => this.getPortfolioRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getPortfolioRes(data) {
    this.loader(-1);
    this.portfolio = data
    this.mutualFund = this.portfolio.find(element => element.portfolioOptionId == 1)
    this.mutualFund2 = this.portfolio.find(element => element.portfolioOptionId == 2)
    this.mutualFund3 = this.portfolio.find(element => element.portfolioOptionId == 3)
  }

  getPlan() {
    this.loader(1);
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getPlans(obj).subscribe(
      data => this.getPlanRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  
  selectMutualFund(event, value) {
    this.portfolio.forEach(element => {
      if (element.portfolioOptionId == value.portfolioOptionId) {
        element.selectedOrDeselected = (event.checked == true) ? 1 : 0;
        value.selectedOrDeselected = element.selectedOrDeselected;
      }
      element.advisorId = this.advisorId;
    });

    if(value.portfolioOptionId == 2 && !event.checked) {
      this.mutualFund3.selectedOrDeselected = 0;
      this.mutualFund3 = JSON.parse(JSON.stringify(this.mutualFund3));
      this.portfolio.forEach(element => {
        if (element.portfolioOptionId == this.mutualFund3.portfolioOptionId) {
          element.selectedOrDeselected = this.mutualFund3.selectedOrDeselected;
        }
      });
    }
    
    const obj = this.portfolio
    this.orgSetting.updatePortFolio(obj).subscribe(
      data => this.updatePortFolioRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updatePortFolioRes(data) {
  }
  selectPlan(event, value) {
    this.planSection.forEach(element => {
      if (element.planOptionId == value.planOptionId) {
        element.selectedOrDeselected = (event.checked == true) ? 1 : 0;
      }
      element.advisorId = this.advisorId;
    });
    var obj = this.planSection
    this.orgSetting.updatePlanSection(obj).subscribe(
      data => this.updatePlanSectionRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updatePlanSectionRes(data) {
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
      this.element = result;
      let obj = {
        id: this.element.id,
        emailAddress: this.element.emailAddress,
        userId: this.userId
      }
      this.orgSetting.addEmailVerfify(obj).subscribe(
        data => this.addEmailVerfifyRes(data),
        err => this.eventService.openSnackBar(err, "Dismiss")
      );
      //  this.bankDetailsSend.emit(result);
    });
  }
  addEmailVerfifyRes(data) {
    this.eventService.openSnackBar("An email has been sent to your registered email address", "Dismiss");
    this.getEmailVerification()
  }
  deleteEmailModal(value, data) {
    if(data.defaultFlag == 1) {
      this.eventService.openSnackBar("Email dependency found!", "Dismiss");
      return;
    }
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.orgSetting.deleteEmailVerify(data.id).subscribe(
          data => {
            dialogRef.close();
            this.getEmailVerification();
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });
  }
  getPlanRes(data) {
    if (data) {
      this.planSection = data
      this.planSec1 = this.planSection.filter(element => element.planOptionId == 1)
      this.planSec1 = this.planSec1[0];
    } else {
      this.planSection = []
    }
    this.loader(-1);
  }

  getEmailVerification() {
    this.loader(1);
    let obj = {
      userId: this.userId,
      // advisorId: this.advisorId
    }
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => this.getEmailVerificationRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getEmailVerificationRes(data) {
    if (data) {
      this.emailDetails = data
      this.emailList = data.listItems
    } else {
      this.emailList = []
    }
    this.loader(-1);
  }
  getEmailTemplate() {
    this.loader(1);
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getEmailTempalate(obj).subscribe(
      data => this.getEmailTempalatRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getEmailTempalatRes(data) {
    if (data) {
      this.emailTemplateList = data
    } else {
      this.emailTemplateList = []
    }
    this.loader(-1);
  }
  OpenEmail(value, data) {
    if (this.isLoading) {
      return;
    }
    let obj = {
      clientData: {documentText: data.body},
      showfromEmail: true,
      fromEmail: data.fromEmail || '',
      documentList: [],
      id: data.id,
      subject: data.subject,
      emailTemplateTypeId: data.emailTemplateTypeId,
      subjectChange: !data.subjectEditable,
      bodyChange: !data.bodyEditable,
      component_type: 'email_template',
      email_header: data.title,
    }
    const fragmentData = {
      flag: value,
      data: obj,
      id: 1,
      state: 'open',
      componentName: EmailOnlyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getEmailTemplate();
            this.getEmailTemplate()
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  loader(increament) {
    this.counter += increament;
    if(this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

  getAppearance(){
    this.loader(1);
    let obj = {
      advisorId: this.advisorId
    }
    this.appearanceUpdateFlag = false;
    this.orgSetting.getAppearancePreference(obj).subscribe(
      data => {
        this.appearanceFG.controls.portfolioOpt.setValue(data.find(data => data.appearanceOptionId == 1).advisorOrOrganisation);
        this.appearanceFG.controls.financialOpt.setValue(data.find(data => data.appearanceOptionId == 1).advisorOrOrganisation);
        this.appearanceFG.controls.clientOpt.setValue(data.find(data => data.appearanceOptionId == 1).advisorOrOrganisation);
        this.appearanceUpdateFlag = true;
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  createAppearanceForm() {
    this.appearanceFG = this.fb.group({
      portfolioOpt: '',
      financialOpt: '',
      clientOpt: '',
    })
  }

  addAppearanceFormListener(){
    this.subcription.add(
      this.appearanceFG.valueChanges.subscribe(value => {
        let jsonArr = [];
        let counter = 0;
        for(let k in value) {
          counter++;
          jsonArr.push({
            advisorId: this.advisorId,
            appearanceOptionId: counter,
            advisorOrOrganisation: value[k]
          })
        }

        if(this.appearanceUpdateFlag)
          this.orgSetting.updateAppearancePreferance(jsonArr).subscribe();
      })
    );
  }

  changeView(tab) {
    this.viewMode = tab;
    switch(tab) {
      case 'tab1': 
        this.getPortfolio();
        break;
        
      case 'tab2': 
        this.getPlan();
        break;
        
      // case 'tab3': 
      //   this.getPortfolio();
      //   break;
        
      case 'tab4': 
        this.getEmailVerification();
        break;
      
      case 'tab5': 
        this.getEmailTemplate();
        break;
        
      // case 'tab6': 
      //   this.getPortfolio();
      //   break;
      
      case 'tab7': 
        this.getDomain();
        break;
        
      // case 'tab8': 
      //   this.getPortfolio();
      //   break;
        
      case 'tab9': 
        this.getAppearance();
        break;
    }
  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }
}