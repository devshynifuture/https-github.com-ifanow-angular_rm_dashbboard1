import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-email-consent',
  templateUrl: './email-consent.component.html',
  styleUrls: ['./email-consent.component.scss']
})
export class EmailConsentComponent implements OnInit {
  consentData = [];

  constructor(private cusService: CustomerService, private Location: Location, private eventService: EventService, private activateRoute: ActivatedRoute, private route: Router, private datePipe: DatePipe) { }
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
        data.forEach(element => {
          let obj =
          {
            id: element.id,
            acceptedOrDeclined: element.acceptedOrDeclined,
            actionPerformed: this.datePipe.transform(new Date(element.actionPerformed), 'yyyy-MM-dd')
          }
          this.consentData.push(obj)
        });
        console.log(this.consentData)
      }
    )
  }
  save() {
    this.cusService.updateAssetConsent(this.consentData).subscribe(
      data => {
        console.log(data)
        this.eventService.openSnackBar("Consent updated", "dismiss")
        this.dialogClose()
      }
    )
  }
  acceptConsent(data, index) {
    this.consentData[index].acceptedOrDeclined = 1
    console.log(this.consentData[index])
  }
  declineConsent(data, index) {
    this.consentData[index].acceptedOrDeclined = 2
    console.log(this.consentData[index])

  }
  dialogClose() {
    this.Location.back();
  }
}
