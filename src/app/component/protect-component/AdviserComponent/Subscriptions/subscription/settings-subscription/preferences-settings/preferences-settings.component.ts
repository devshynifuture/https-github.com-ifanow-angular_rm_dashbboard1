import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PreferenceEmailInvoiceComponent } from '../../common-subscription-component/preference-email-invoice/preference-email-invoice.component';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { BillerProfileAdvisorComponent } from '../../common-subscription-component/biller-profile-advisor/biller-profile-advisor.component';
import { SubscriptionDataService } from '../../../subscription-data.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-preferences-settings',
  templateUrl: './preferences-settings.component.html',
  styleUrls: ['./preferences-settings.component.scss']
})
export class PreferencesSettingsComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
  storeData: any;
  advisorId;
  viewMode = 'tab1';
  dataTOget: object;
  saveUpdateFlag: any;

  constructor(public subService: SubscriptionService, private fb: FormBuilder,
    public dialog: MatDialog, private subscription: SubscriptionService,
    public subInjectService: SubscriptionInject, private eventService: EventService, private utilservice: UtilService) {
  }
  prefixData:FormGroup;
  isLoading = false;
  billerProfileData: Array<any>;
  // PrefixData;

  selected;

  ngOnInit() {

    this.viewMode = 'tab1';
    this.advisorId = AuthService.getAdvisorId();
    (SubscriptionDataService.getLoderFlag(5) == false) ? this.billerProfileData = undefined : this.billerProfileData = [{}, {}, {}]
    this.getProfileBillerData();
    this.getTemplate();
  }

  getTemplate() {

    const obj = {
      // advisorId: 2727
      advisorId: this.advisorId
    };
    this.subService.getEmailTemplate(obj).subscribe(
      data => this.getTemplateDate(data)
    );
  }

  getTemplateDate(data) {
    console.log(data);
    this.storeData = data;
  }

  getProfileBillerData() {
    this.isLoading = true;
    // this.billerProfileData = [{ isPrimary: false }];
    this.subscription.getPreferenceBillerProfile(this.advisorId).subscribe(
      data => this.getProfileBillerDataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        // this.dataSource.data = [];
        this.billerProfileData = [];
        this.isLoading = false;
      }
    );
  }
  getBillerPrimary(data) {
    let obj = {
      advisorId: this.advisorId,
      id: data.id
    }
    this.subscription.setBillerPrimary(obj).subscribe(
      data => this.setBillerPrimaryRes(data)
    );
  }
  setBillerPrimaryRes(data) {

    console.log(data)
    this.billerProfileData.forEach(element => {
      if (element.id == data) {
        element.isPrimary = true
        this.eventService.openSnackBar('primary set successfully', 'OK');
      } else {
        element.isPrimary = false
      }
    });
  }
  getPrefixData(type) {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      type
    };
    this.subscription.getPreferenceInvoiceQuotations(obj).subscribe(
      data => this.getInvoiceQuotationResponse(data, type)
    );
  }

  savePrefix(data) {
    if(this.prefixData.invalid){
      this.prefixData.get('prefix').markAsTouched();
      this.prefixData.get('nextNo').markAsTouched();
    }
    else{
      this.barButtonOptions.active = true;
      const obj = {
        // advisorId: 2735,
        advisorId: this.advisorId,
        id: 0,
        nextNumber: parseInt(this.prefixData.value.nextNo),
        prefix: this.prefixData.value.prefix,
        type: data
      };
      if (this.saveUpdateFlag.prefix != undefined && this.saveUpdateFlag.nextNumber != undefined) {
        this.subscription.updatePreferenceInvoiceQuotationsSubscription(obj).subscribe(
          data =>{
            this.savePrefixResponse(data);
          },
          err=>{
            console.log(err, "updatePreferenceInvoiceQuotationsSubscription error");
            this.barButtonOptions.active = false;
          }
        );
      } else {
        this.subscription.savePreferenceInvoiceQuotationsSubscription(obj).subscribe(
          data =>{
            this.savePrefixResponse(data);
          },
          err=>{
            console.log(err, "savePreferenceInvoiceQuotationsSubscription error");
            this.barButtonOptions.active = false;
          }
        );
      }
    }

  }

  savePrefixResponse(data) {
    console.log(data, "prefixData check");  
    this.barButtonOptions.active = false;
    this.prefixData.get('nextNo').setValue(data.prefix);
    this.prefixData.get('nextNo').setValue(data.nextNumber);
    // this.prefixData = data;
  }

  getProfileBillerDataResponse(data) {
    this.isLoading = false;
    console.log('getProfileBillerDataResponse', data);
    this.billerProfileData = data;
  }

  getInvoiceQuotationResponse(data, type) {
    this.isLoading = false;
    this.saveUpdateFlag = data;
    this.prefixData = this.fb.group({
      prefix: [data.prefix, [Validators.required]],
      nextNo: [data.nextNumber, [Validators.required]]
    });

  }

  Open(singleProfile, value) {
    this.selected = 0;
    const fragmentData = {
      flag: value,
      data: singleProfile,
      id: 1,
      state: 'open',
      componentName: BillerProfileAdvisorComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getProfileBillerData()
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }

    );
    // this.billerProfileData = this.dataTOget.data
  }

  deleteModal(singleBillerProfile) {
    if (singleBillerProfile.isPrimary == true) {
      this.eventService.openSnackBar("You cannot delete primary biller profile", "dismiss")
      return;
    }
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete the biller profile?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteSubSettingBillerProfile(singleBillerProfile.id).subscribe(
          data => {
            this.getProfileBillerData();
            dialogRef.close();
            this.eventService.openSnackBar("Biller is deleted", "dismiss")
          },
          error => this.eventService.showErrorMessage(error)
        );

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
  openEmailInvoice(data) {
    const fragmentData = {
      flag: 'app-preference-email-invoice',
      id: 1,
      data,
      direction: 'top',
      componentName: PreferenceEmailInvoiceComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

}
