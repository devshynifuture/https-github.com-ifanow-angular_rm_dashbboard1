import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';
import { MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit {

  @Input() data:any = {};
  tabIndex = 0;

  isRTALoaded:boolean = false;
  isTeamLoaded:boolean = false;

  camsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  karvyDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  frankDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  fundsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  userList: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);

  rtaAPIError:boolean = false;
  teamAPIError:boolean = false;

  constructor(
    public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    public utilservice: UtilService,
    private settingsService: SettingsService,
    private eventService: EventService,
  ) { }
  displayedColumns: string[] = ['name', 'email', 'mobile', 'role'];
  displayedColumns1: string[] = ['arn', 'regEmailId', 'scheduleExp'];
  displayedColumns2: string[] = ['arn', 'loginId', 'registeredId', 'userOrdering'];
  displayedColumns3: string[] = ['arn', 'loginId', 'registeredId'];
  displayedColumns4: string[] = ['arn', 'loginId'];

  onboardingActivityForm = this.fb.group({
    "firstCall": [,],
    "autoForwardStep": [,],
    "dataUploadAndAumReconciliation": [,],
    "dailyScheduleNCamsExpiryDateAdd": [,],
    "demoAndHandover": [,],
    "done": [,]
  })

  ngOnInit() {
    this.utilservice.loader(0);
  }

  changeTab(index) {
    switch (index) {
      case 2:
        if(!this.isRTALoaded) {
          this.loadRTAList()
        }
        break;

      case 3:
        if(!this.isTeamLoaded) {
          this.loadUsers()
        }

    }
  }

  loadRTAList() {
    const jsonData = {advisorId: this.data.advisorId};
    this.utilservice.loader(1)
    this.rtaAPIError = false;
    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
      let mfRTAlist = res || [];
      this.camsDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 1));
      this.karvyDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 2));
      this.frankDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 3));
      this.fundsDS = new MatTableDataSource(mfRTAlist.filter((data) => data.rtTypeMasterid == 4));
      this.isRTALoaded = true;
      this.utilservice.loader(-1);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.rtaAPIError = true;
      this.utilservice.loader(-1);
    });
  }
  loadUsers() {
    this.utilservice.loader(1);
    const dataObj = {
      advisorId: this.data.advisorId
    };
    this.teamAPIError = false;
    this.settingsService.getTeamMembers(dataObj).subscribe((res) => {
      this.userList = new MatTableDataSource(res);
      this.utilservice.loader(-1);
      this.isTeamLoaded = true;
    }, err=> {
      this.eventService.openSnackBar(err, "Dismiss");
      this.teamAPIError = true;
      this.utilservice.loader(-1);
    });
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}