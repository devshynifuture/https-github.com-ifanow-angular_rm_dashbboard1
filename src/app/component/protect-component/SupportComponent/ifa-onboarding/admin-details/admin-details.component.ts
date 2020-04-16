import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { SettingsService } from '../../../AdviserComponent/setting/settings.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit {

  @Input() data:any = {};
  globalData: any = {};
  mfRTAlist: any[] = [{}];
  tabIndex = 0;

  isRTALoaded:boolean = false;

  camsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  karvyDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  frankDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);
  fundsDS: MatTableDataSource<any> = new MatTableDataSource([{}, {}, {}]);

  constructor(
    public subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private utilservice: UtilService,
    private settingsService: SettingsService,
  ) { }
  displayedColumns: string[] = ['name', 'email', 'mobile', 'role'];
  dataSource = ELEMENT_DATA;

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
    }
  }

  loadRTAList() {
    const jsonData = {advisorId: this.data.advisorId};
    this.utilservice.loader(1)
    this.settingsService.getMFRTAList(jsonData).subscribe((res) => {
      this.mfRTAlist = res || [];
      this.camsDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 1));
      this.karvyDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 2));
      this.frankDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 3));
      this.fundsDS = new MatTableDataSource(this.mfRTAlist.filter((data) => data.rtTypeMasterid == 4));
      this.isRTALoaded = true;
      this.utilservice.loader(-1);
    });
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}


export interface PeriodicElement {
  name: string;
  email: string;
  mobile: string;
  role: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Rinku Singh', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
];