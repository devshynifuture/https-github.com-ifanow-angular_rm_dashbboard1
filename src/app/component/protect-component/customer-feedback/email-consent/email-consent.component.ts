import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-email-consent',
  templateUrl: './email-consent.component.html',
  styleUrls: ['./email-consent.component.scss']
})
export class EmailConsentComponent implements OnInit {
  consentData = [];
  isLoading: boolean;

  constructor(private cusService: CustomerService, private Location: Location, private eventService: EventService, private activateRoute: ActivatedRoute, private route: Router, private datePipe: DatePipe) { }
  displayedColumns: string[] = ['position', 'investorName', 'schemeDetails', 'currentValue', 'notionalGain', 'advice', 'adviceStatus', 'applicableDate', 'actions'];
  dataSource = new MatTableDataSource();
  selectedConsent = [];
  ngOnInit() {
    this.activateRoute.queryParams.subscribe(
      params => {
        console.log(params)
        this.isLoading = true;
        this.getConsentDetails(params.gropID);
      }
    )

  }
  getConsentDetails(data) {
    this.isLoading = true;
    this.cusService.getAdviceConsent(data).subscribe(
      data => {

        this.isLoading = false;
        this.dataSource.data = data;
        data.forEach(element => {
          let obj =
          {
            id: element.id,
            acceptedOrDeclined: element.acceptedOrDeclined,
            actionPerformed: this.datePipe.transform(new Date(element.actionPerformed), 'yyyy-MM-dd')
          }
          this.consentData.push(obj)
        });
      }
    )
  }

  save() {
    this.cusService.updateAssetConsent(this.consentData).subscribe(
      data => {
        console.log("this is consent Data  after clicking ok::::", this.consentData);
        console.log(data);
        this.eventService.openSnackBar("Consent updated", "dismiss")

        setTimeout(() => {
          this.dialogClose()
        }, 300);
      }
    )
  }

  acceptOrDeclineConsent(data, index, choice) {
    this.consentData[index].acceptedOrDeclined = choice;
    this.consentData[index].actionPerformed = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    console.log(this.consentData[index]);
  }

  dialogClose() {
    this.Location.back();
  }
}
