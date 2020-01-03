import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionService } from '../../../subscription.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

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

  SettingProfileData: any;
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
      data => this.setAsPrimaryRes(data)
    );
  }

  setAsPrimaryRes(data) {
    console.log('setAsPrimaryRes', data);
    this.SettingProfileData.forEach(element => {
      if (data == element.id) {
        element.isPrimary = true;
        this.eventService.openSnackBar('primary set successfully', 'OK');
      } else {
        element.isPrimary = false;
      }
    });
  }

  getSettingProfileData() {
    const obj = {
      clientId: this.upperData.id,
    };
    this.subService.getSubscriptionClientsSettingProfile(obj).subscribe(
      data => this.getSettingProfileDataResponse(data)
    );
  }

  getSettingProfileDataResponse(data) {
    if (data == undefined) {
      this.noData = 'No Data Found';
    } else {
      console.log('getData biller', data);
      this.SettingProfileData = data;
    }
  }

  openPayeeSettings(profileData, value, state) {
    const fragmentData = {
      flag: value,
      data: profileData,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        this.getSettingProfileData();
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {

        this.subService.deleteClientProfileSubscriptionSetting(value.id).subscribe(
          data => {
            this.deletedData(data);
            this.getSettingProfileData();
            dialogRef.close();
          }
        )
      },
      negativeMethod: () => {
        console.log("negative method called");
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  deletedData(data) {
    if (data == true) {
      this.eventService.openSnackBar('Deleted successfully!', 'dismiss');
    }
  }

  dataTosendSetting(value) {
    console.log('data setting send by Output', value);
  }
}
