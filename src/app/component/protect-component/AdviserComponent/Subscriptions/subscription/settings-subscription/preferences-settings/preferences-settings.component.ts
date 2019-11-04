import {Component, OnInit} from '@angular/core';
import {SubscriptionService} from '../../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {PreferenceEmailInvoiceComponent} from '../../common-subscription-component/preference-email-invoice/preference-email-invoice.component';
import {AuthService} from '../../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-preferences-settings',
  templateUrl: './preferences-settings.component.html',
  styleUrls: ['./preferences-settings.component.scss']
})
export class PreferencesSettingsComponent implements OnInit {
  storeData: any;
  advisorId;
  viewMode = 'tab1';
  dataTOget: object;

  constructor(public subService: SubscriptionService, private fb: FormBuilder,
              public dialog: MatDialog, private subscription: SubscriptionService,
              public subInjectService: SubscriptionInject, private eventService: EventService) {
  }
  prefixData;
  showLoader = false;
  billerProfileData;
  PrefixData;
  selected;

  ngOnInit() {
    this.viewMode = 'tab1';
    this.advisorId = AuthService.getAdvisorId();
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
    this.subscription.getPreferenceBillerProfile(this.advisorId).subscribe(
      data => this.getProfileBillerDataResponse(data)
    );
  }

  getPrefixData(type) {
    const obj = {
      advisorId: this.advisorId,
      type
    };
    this.showLoader = true;
    this.subscription.getPreferenceInvoiceQuotations(obj).subscribe(
      data => this.getInvoiceQuotationResponse(data, type)
    );
  }

  savePrefix(data) {
    const obj = {
      // advisorId: 2735,
      advisorId: this.advisorId,
      id: 0,
      nextNumber: this.prefixData.nextNo,
      prefix: this.prefixData.prefix,
      type: 1
    };

    this.subscription.updatePreferenceInvoiceQuotationsSubscription(obj).subscribe(
      data => this.savePrefixResponse(data)
    );
    this.subscription.savePreferenceInvoiceQuotationsSubscription(obj).subscribe(
      data => this.savePrefixResponse(data)
    );
  }

  savePrefixResponse(data) {
    this.prefixData = data;
  }

  getProfileBillerDataResponse(data) {
    console.log('getProfileBillerDataResponse', data);
    this.billerProfileData = data;
  }

  getInvoiceQuotationResponse(data, type) {
    this.showLoader = false;
    this.prefixData = this.fb.group({
      prefix: [data.prefix],
      nextNo: [data.nextNumber]
    });

  }

  Open(singleProfile, value, state) {
    this.selected = 0;
   
    const fragmentData = {
      Flag: value,
      data:singleProfile,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        this.getProfileBillerData()
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', );
          rightSideDataSub.unsubscribe();
        }
      }
      
    );
    // this.billerProfileData = this.dataTOget.data
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  openEmailInvoice(data) {
    const Fragmentdata = {
      Flag: data,
      id: 1
    };

    const dialogRef = this.dialog.open(PreferenceEmailInvoiceComponent, {
      width: '1400px',
      data: Fragmentdata,
      autoFocus: false,
      panelClass: 'dialogBox',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
