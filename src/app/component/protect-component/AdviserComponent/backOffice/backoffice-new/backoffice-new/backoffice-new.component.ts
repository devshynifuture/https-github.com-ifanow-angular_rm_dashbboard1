import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { UtilService } from 'src/app/services/util.service';
import { FormControl } from '@angular/forms';
import { BackOfficeService } from '../../back-office.service';
import { element } from 'protractor';

@Component({
  selector: 'app-backoffice-new',
  templateUrl: './backoffice-new.component.html',
  styleUrls: ['./backoffice-new.component.scss']
})
export class BackofficeNewComponent implements OnInit {

  assetTypeList = new MatTableDataSource([{}, {}, {}])
  displayedColumns: string[] = ['position', 'schemeName', 'number', 'investName', 'dueDate'];
  isLoading: boolean;
  advisorId: any;
  selectedNextDate = new FormControl("7");
  EndDate: any;
  StartDate: any;
  filterOption: any;
  filterOptionControl = new FormControl("Fixed Deposit");
  selectedSubType = new FormControl();
  reminderType: any;
  fixedDepositFilter: any;
  constructor(private eventService: EventService,
    private customerService: CustomerService,
    private backOffice: BackOfficeService) { }


  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.selectedNextDate.setValue('7');
    this.StartDate = UtilService.getEndOfDay(new Date()).getTime();
    this.getEndDate(this.selectedNextDate.value);
    this.getGlobalFilter();

  }

  getGlobalFilter() {
    const obj = {}
    this.backOffice.getGlobalReminderFilter(obj).subscribe(
      data => {
        this.getGlobalFilterRes(data);
      }
    )
  }

  getGlobalFilterRes(data) {
    if (data) {
      console.log(data)
      this.filterOption = data;
      this.fixedDepositFilter = data.filter(element => element.name == 'Fixed Deposit');
      this.selectedSubType.setValue(data[0].reminderType);
      this.getFixedDepositList();
    }
  }

  getFixedDepositList() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getFixedDeposit(obj).subscribe(
      data => this.getFixedDepositRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getFixedDepositRes(data) {
    if (data && data.length > 0) {
      this.assetTypeList.data = data;
    } else {
      this.assetTypeList.data = [];
      this.isLoading = false;
    }
  }

  sortDateFilter(event) {
    this.getEndDate(event.value);
    this.getFixedDepositList();
  }

  changeSubAssetType(event) {
    console.log(event.value);
    this.selectedSubType.setValue(event.value);
    this.getFixedDepositList();
  }


  getEndDate(value) {
    this.EndDate = UtilService.getStartOfTheDay(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * Number(value))).getTime();
  }

}
