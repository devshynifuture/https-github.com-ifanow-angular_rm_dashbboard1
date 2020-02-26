import { Component, OnInit } from '@angular/core';
import { OnlineTransactionService } from '../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { apiConfig } from 'src/app/config/main-config';

@Component({
  selector: 'app-settings-empanelled-amc',
  templateUrl: './settings-empanelled-amc.component.html',
  styleUrls: ['./settings-empanelled-amc.component.scss']
})
export class SettingsEmpanelledAmcComponent implements OnInit {
  displayedColumns;
  dataSource;
  advisorId: any;
  isLoading: any;
  constructor(private tranService: OnlineTransactionService, private eventService: EventService) { }
  columns = [];
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getEmpanelledAmcData();
  }
  getEmpanelledAmcData() {
    let obj =
    {
      advisorId: this.advisorId
    }
    this.tranService.getHiddenAmcFromAdvisorIdAmcWise(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.getEmpanelledAmcDataRes(data);
        this.dataSource = data.amcMasterList;
      },
      err => this.eventService.openSnackBar(err, "dismiss")
    )
  }
  getEmpanelledAmcDataRes(data) {
    this.columns.push("AMC name");
    data.brokerList.forEach(element => {
      this.columns.push(element.brokerCode)
    });
    console.log(this.columns)
  }
  addDeleteHiddenAmc(checkBoxValue, Amcdata, singleBrokerData) {
    console.log(checkBoxValue, Amcdata, singleBrokerData)
    if (checkBoxValue.checked) {
      let obj =
      {
        id: singleBrokerData.tpHiddenAmcId
      }
      this.tranService.deleteHiddenAmc(obj).subscribe(
        data => console.log(data),
        err => {
          singleBrokerData.selected = true;
          this.eventService.openSnackBar(err, "dismiss")
        }
      )
    }
    else {
      let obj =
      {
        advisorId: this.advisorId,
        amcId: Amcdata.id,
        tpUserCredentialId: singleBrokerData.tpUserCredentialId
      }
      this.tranService.addHiddenAmc(obj).subscribe(
        data => {
          console.log(data);
          singleBrokerData['tpHiddenAmcId'] = data;
        },
        err => {
          singleBrokerData.selected = false;
          this.eventService.openSnackBar(err, "dismiss")
        }
      )
    }
  }
}
