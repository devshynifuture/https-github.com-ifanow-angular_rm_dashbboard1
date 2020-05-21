import { Component, OnInit, ViewChild } from '@angular/core';
import { OnlineTransactionService } from '../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-settings-empanelled-amc',
  templateUrl: './settings-empanelled-amc.component.html',
  styleUrls: ['./settings-empanelled-amc.component.scss']
})
export class SettingsEmpanelledAmcComponent implements OnInit {
  displayedColumns;
  dataSource: any = new MatTableDataSource();
  advisorId: any;
  isLoading = false;
  credentialData: any;
  noData: string;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

 
  constructor(private tranService: OnlineTransactionService, private eventService: EventService) { }
  columns = [];
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    // this.getEmpanelledAmcData();
    this.getFilterOptionData();
  }
  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }
  getFilterOptionData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.tranService.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data),
      err => {
        this.isLoading = false;
        this.noData = 'No credentials found';
        this.dataSource.data = [];
      }
    );
  }

  getFilterOptionDataRes(data) {

    if (data) {
      this.credentialData = data;
      
      this.getEmpanelledAmcData();
    } else {
      this.isLoading = false;
      this.noData = 'No credentials found';
      this.dataSource.data = [];
    }
    // this.filterData = TransactionEnumService.setPlatformEnum(data);
  }
  getEmpanelledAmcData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId
    };
    this.tranService.getHiddenAmcFromAdvisorIdAmcWise(obj).subscribe(
      data => {
        this.isLoading = false;
        this.getEmpanelledAmcDataRes(data);
        this.dataSource.data = data.amcMasterList;
        this.dataSource.sort = this.sort;
      },
      err => {
        this.isLoading = false;
        this.eventService.openSnackBar(err, 'Dismiss');
        this.dataSource.data = [];
      }
    );
  }
  getEmpanelledAmcDataRes(data) {
    this.isLoading = false;
    this.columns.push('AMC name');
    data.brokerList.forEach(element => {
      this.columns.push(element.brokerCode);
    });
  }
  addDeleteHiddenAmc(checkBoxValue, Amcdata, singleBrokerData) {
    if (checkBoxValue.checked) {
      const obj = {
        id: singleBrokerData.tpHiddenAmcId
      };
      this.tranService.deleteHiddenAmc(obj).subscribe(
        err => {
          singleBrokerData.selected = true;
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    } else {
      const obj = {
        advisorId: this.advisorId,
        amcId: Amcdata.id,
        tpUserCredentialId: singleBrokerData.tpUserCredentialId
      };
      this.tranService.addHiddenAmc(obj).subscribe(
        data => {
          singleBrokerData.tpHiddenAmcId = data;
        },
        err => {
          singleBrokerData.selected = false;
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }
  }
}
