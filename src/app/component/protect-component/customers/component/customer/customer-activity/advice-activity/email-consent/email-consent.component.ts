import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../customer.service';
import { Location } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-email-consent',
  templateUrl: './email-consent.component.html',
  styleUrls: ['./email-consent.component.scss']
})
export class EmailConsentComponent implements OnInit {

  constructor(private cusService: CustomerService, private Location: Location, private eventService: EventService) { }
  displayedColumns: string[] = ['position', 'investorName', 'schemeDetails', 'currentValue', 'notionalGain', 'advice', 'adviceStatus', 'applicableDate', 'actions'];
  dataSource;
  selectedConsent = [];
  ngOnInit() {
    this.getConsentDetails();
  }
  getConsentDetails() {
    this.cusService.getAdviceConsent(1).subscribe(
      data => {
        console.log(data)
        this.dataSource = data
      }
    )
  }
  save() {
    this.cusService.updateAssetConsent(this.dataSource).subscribe(
      data => {
        console.log(data)
        this.eventService.openSnackBar("Consent updated", "dismiss")
        this.dialogClose()
      }
    )
  }
  selectionConsent(data) {
    (data.acceptedOrDeclined == 1) ? data.acceptedOrDeclined = 2 : data.acceptedOrDeclined = 1
    console.log(this.dataSource)
  }
  dialogClose() {
    this.Location.back();
  }
}
