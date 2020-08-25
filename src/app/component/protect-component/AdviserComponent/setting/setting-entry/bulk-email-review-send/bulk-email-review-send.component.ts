import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { element } from 'protractor';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bulk-email-review-send',
  templateUrl: './bulk-email-review-send.component.html',
  styleUrls: ['./bulk-email-review-send.component.scss']
})
export class BulkEmailReviewSendComponent implements OnInit {
  clientList: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'name', 'email'];
  isLoading = false
  dataCount: number;
  advisorId: any;
  mailForm: any;
  verifiedAccountsList: any = [];

  constructor(
    public authService: AuthService,
    protected eventService: EventService,
    public enumDataService: EnumDataService,
    private orgSetting: OrgSettingServiceService,
    private fb: FormBuilder
  ) { }

  logoText = 'Your Logo here';


  ngOnInit() {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId()
    if (data && data.length > 0) {
      data.forEach(element => {
        element.selected = false
      });
      this.dataSource.data = data
    }
    this.getEmailVerification();
    this.mailForm = this.fb.group({
      mail_body: [''],
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  selectAll(event) {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(element => {
        element['selected'] = event.checked;
        if (element['selected']) {
          this.dataCount++;
        }
      });
    }
  }

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item['selected']) {
        this.dataCount++;
      }
    });
  }

  getEmailVerification() {
    let obj = {
      userId: this.advisorId,
      // advisorId: this.advisorId
    }
    this.isLoading = true;
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => {
        this.getEmailVerificationRes(data);
        this.isLoading = false;
      },
    );
  }

  getEmailVerificationRes(data) {
    console.log(data)
    if (data && data.length > 0) {
      data.map(element => {
        if (element.emailVerificationStatus == 1) {
          this.verifiedAccountsList.push(element)
        }
      })
    }
  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: false });
  }
}
