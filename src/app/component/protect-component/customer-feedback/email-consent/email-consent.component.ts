import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-consent',
  templateUrl: './email-consent.component.html',
  styleUrls: ['./email-consent.component.scss']
})
export class EmailConsentComponent implements OnInit {

  constructor(private cusService: CustomerService, private Location: Location, private eventService: EventService, private activateRoute: ActivatedRoute) { }
  displayedColumns: string[] = ['position', 'investorName', 'schemeDetails', 'currentValue', 'notionalGain', 'advice', 'adviceStatus', 'applicableDate', 'actions'];
  dataSource;
  selectedConsent = [];
  ngOnInit() {
    this.activateRoute.queryParams.subscribe(
      params => {
        console.log(params)
        this.getConsentDetails(params.gropID);
      }
    )

  }
  getConsentDetails(data) {
    this.cusService.getAdviceConsent(data).subscribe(
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
  acceptConsent(data) {
    data.acceptedOrDeclined = 1
    console.log(this.dataSource)
  }
  declineConsent(data) {
    data.acceptedOrDeclined = 2
  }
  dialogClose() {
    this.Location.back();
  }
}
