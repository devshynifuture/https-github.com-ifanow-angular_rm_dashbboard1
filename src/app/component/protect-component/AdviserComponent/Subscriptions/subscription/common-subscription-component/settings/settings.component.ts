import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionService } from '../../../subscription.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { PayeeSettingsComponent } from '../payee-settings/payee-settings.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  advisorId: any;
  clientId: any;
  family: any;


  constructor(public dialog: MatDialog, private fb: FormBuilder, public subInjectService: SubscriptionInject,
    private eventService: EventService, private subService: SubscriptionService) {
  }


  SettingProfileData: Array<any> = [{ isPrimary: false }];
  isLoading = false;
  noData: string;

  @Input() upperData;

  ngOnInit() {
    this.getSettingProfileData();
  }

  setPrimaryField(profileData) {

    const obj = {
      clientId: this.upperData.id,
      id: profileData.id
    };
    this.subService.setAsPrimary(obj).subscribe(
      data => this.setAsPrimaryRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        // this.dataSource.data = [];
        this.SettingProfileData = [];
        this.isLoading = false;
      }
    );
  }

  setAsPrimaryRes(data) {
    this.SettingProfileData.forEach(element => {
      if (data == element.id) {
        element.isPrimary = true;
        this.eventService.openSnackBar('Primary set successfully', 'OK');
      } else {
        element.isPrimary = false;
      }
    });
  }

  getSettingProfileData() {
    this.isLoading = true;
    const obj = {
      clientId: this.upperData.id,
    };
    this.subService.getSubscriptionClientsSettingProfile(obj).subscribe(
      data => this.getSettingProfileDataResponse(data)
    );
  }

  getSettingProfileDataResponse(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No Data Found';
      this.SettingProfileData = []
    } else {
      this.SettingProfileData = data;
    }
  }

  openPayeeSettings(profileData, value) {
    profileData['clientData'] = this.upperData;
    profileData['flag'] = value;
    const fragmentData = {
      flag: value,
      data: profileData,
      id: 1,
      state: 'open',
      componentName: PayeeSettingsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.SettingProfileData = [{}];
            this.getSettingProfileData();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteModal(value, data) {
    if (data.isPrimary == true) {
      this.eventService.openSnackBar("You cannot delete primary client profile", "Dismiss")
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

        this.subService.deleteClientProfileSubscriptionSetting(data.id).subscribe(
          resData => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            // this.SettingProfileData = [{}];
            // this.getSettingProfileData();
            dialogRef.close(data.id);
          }
        )
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != undefined) {
        const tempList = this.SettingProfileData.filter(p => p.id != result);
        this.SettingProfileData = tempList;
      }
    });

  }

  // deletedData(data) {
  //   if (data == true) {

  //   }
  // }

  dataTosendSetting(value) {
  }
}
