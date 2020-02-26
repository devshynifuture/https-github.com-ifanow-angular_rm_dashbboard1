import { Component, OnInit } from '@angular/core';
import { OnlineTransactionService } from '../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-settings-empanelled-amc',
  templateUrl: './settings-empanelled-amc.component.html',
  styleUrls: ['./settings-empanelled-amc.component.scss']
})
export class SettingsEmpanelledAmcComponent implements OnInit {
  displayedColumns;
  dataSource;
  advisorId: any;
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
}
