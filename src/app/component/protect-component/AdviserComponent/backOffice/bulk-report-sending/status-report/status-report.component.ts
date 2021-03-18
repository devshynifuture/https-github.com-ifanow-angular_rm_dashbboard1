import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { BackOfficeService } from '../../back-office.service';

@Component({
  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.scss']
})
export class StatusReportComponent implements OnInit {
  inputData: any;
  userInfo: any;
  refreshCount: any;
  displayedColumns: string[] = ['checkbox', 'name', 'mfoverview', 'status', 'action',];
  clientDetails = []
  isLoading: boolean;
  constructor(
    private subInjectService: SubscriptionInject,
    private backOfficeService: BackOfficeService,
  ) {
    this.userInfo = AuthService.getUserInfo();
    console.log('info ===', this.userInfo)
  }
  @Input()
  set data(data) {
    this.inputData = data;
    if (data) {
      console.log('This is Input data of proceed ', data);
    }
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.isLoading = false
    this.refresh()
    this.getLog()
  }
  refresh() {
    const obj = {
      id: this.inputData.id///5125
    };
    this.backOfficeService.refreshCount(obj).subscribe(
      data => {
        console.log('refreshCount ==', data)
        this.refreshCount = data
        console.log(this.refreshCount)
      }
    );
  }
  getLog() {
    this.isLoading = true
    const obj = {
      mfBulkEmailRequestId: this.inputData.id///5125
    };
    this.backOfficeService.getLog(obj).subscribe(
      data => {
        if (data) {
          console.log('getLog ==', data)
          this.clientDetails = data
          console.log('clientDetails', this.clientDetails)
        } else {
          this.clientDetails = []
        }
        this.isLoading = false
      }
    );
  }
  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
    });
  }
}
