import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionService } from '../../../subscription.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  SettingProfileData: any;

  constructor(public dialog: MatDialog,private fb:FormBuilder,public subInjectService:SubscriptionInject,
              private eventService:EventService, private subService:SubscriptionService) { }

  ngOnInit() {
    this.getSettingProfileData();
  }
  @Input() upperData;

  setPrimaryField(profileData){
    let obj = {
      clientId : this.upperData.id,
      id: profileData.id  
    }
    this.subService.setAsPrimary(obj).subscribe(
      data => this.setAsPrimaryRes(data)
     )
  }
  setAsPrimaryRes(data){
    console.log('setAsPrimaryRes',data)
      this.SettingProfileData.forEach(element => {
      if(data == element.id){
        element.isPrimary = true
      }else{
        element.isPrimary = false
      }
    });  
  }
  getSettingProfileData()
  {
    let obj={
    'clientId':this.upperData.id,
    }
    this.subService.getSubscriptionClientsSettingProfile(obj).subscribe(
     data => this.getSettingProfileDataResponse(data)
    )
  }
  getSettingProfileDataResponse(data)
  {
   console.log('getData biller',data)
   this.SettingProfileData=data;
  }
  openPayeeSettings(profileData,value,state)
  {
    this.eventService.sliderData(value);
    this.subInjectService.rightSliderData(state);
    this.subInjectService.rightSideData(profileData);
    console.log("profileData*********",profileData)
  }
  deleteModal(value) {
    let dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

}
  dataTosendSetting(value){
    console.log("data setting send by Output",value)
  }
}
