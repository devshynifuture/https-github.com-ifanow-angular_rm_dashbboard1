import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-openmobile-popup',
  templateUrl: './openmobile-popup.component.html',
  styleUrls: ['./openmobile-popup.component.scss']
})
export class OpenmobilePopupComponent implements OnInit {
  advisorId: any;
  callBack: any;

  constructor(public dialogRef: MatDialogRef<OpenmobilePopupComponent>,
    private settingsService: SettingsService,
    private eventService: EventService,
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close()
  }
  callback() {
    let obj = {
      advisorId: this.advisorId,
      interestedIn: 'mobileApp'
    }
    this.settingsService.addCallBackMob(obj)
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.callBack = res;
          this.eventService.openSnackBarNoDuration('Request forwarded Successfully', 'Dismiss');
        } else {
          this.callBack = null;
        }
      }, err => {
        this.callBack = null;
        console.error(err);
      });
  }
}
