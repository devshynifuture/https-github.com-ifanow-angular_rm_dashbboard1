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
  displayedColumns: string[] = ['checkbox', 'name', 'mfoverview', 'status'];
  clientDetails = []
  isLoading: boolean;
  dataForFilter: any[];
  selectAll: boolean = false
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
  resendNow() {
    let obj = {
      id: this.clientDetails[0].mfBulkEmailRequestId,
      clientIds: []
    }
    var list = []
    this.clientDetails.forEach(element => {
      if (element.checked == true) {
        list.push(element.clientId)
      }
    });
    obj.clientIds = list
    this.backOfficeService.resendNow(obj).subscribe(
      data => {
        if (data) {
          console.log('getLog ==', data)
        }
        this.isLoading = false
      }
    );
  }
  selectAllData(event, data) {
    this.selectAll = event.checked
    if (this.selectAll == true) {
      this.clientDetails.forEach(element => {
        element.checked = true
      });
    } else {
      this.clientDetails.forEach(element => {
        element.checked = false
      });
    }
  }
  selectToResend(event, value) {
    value.checked = event.checked
  }
  filterData(type) {
    if (type == 'ALL') {
      this.clientDetails = this.dataForFilter
    } else if (type == 'SENT') {
      this.clientDetails = this.dataForFilter.filter((x) => x.status == 1);
    } else if (type == 'NOT SENT') {
      this.clientDetails = this.dataForFilter.filter((x) => x.status == 0);
    }
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
          this.clientDetails.forEach(element => {
            element.checked = false
          });
          this.dataForFilter = this.clientDetails
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
