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
  id: any;
  sumAssured: any;
  paramData: any;

  constructor(private cusService: CustomerService, private Location: Location, private eventService: EventService, private activateRoute: ActivatedRoute, private route: Router, private datePipe: DatePipe) { }
  displayedColumns: string[] = ['position', 'investorName', 'schemeDetails', 'currentValue', 'notionalGain', 'advice', 'adviceStatus', 'applicableDate', 'actions'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  selectedConsent = [];
  ngOnInit() {
    this.activateRoute.queryParams.subscribe(
      params => {
        this.isLoading = true;
        this.getConsentDetails(params.gropID);
        this.paramData = params;
        console.log(params)
      }
    )

  }
  getConsentDetails(data) {
    this.isLoading = true;
    const getAdviceSubs = this.cusService.getAdviceConsent(data).subscribe(
      data => {
        this.sumAssured = 0;
        this.dataSource.data = data;
        data.forEach(element => {
          this.id = element.advice.adviceToCategoryTypeMasterId;
          if (this.id == 4) {
            if (element.stringObject.hasOwnProperty("insuredMembers") &&
              element.stringObject.insuredMembers.length > 0) {
              element.stringObject.displayHolderName = element.stringObject.insuredMembers[0].name;
              if (element.stringObject.insuredMembers.length > 1) {
                for (let i = 1; i < element.stringObject.insuredMembers.length; i++) {
                  if (element.stringObject.insuredMembers[i].name) {
                    const firstName = (element.stringObject.insuredMembers[i].name as string).split(' ')[0];
                    element.stringObject.displayHolderName += ', ' + firstName;
                  }
                }
              }
            } else {
              element.stringObject.displayHolderName = element.stringObject.policyHolderName;
            }
            if (element.stringObject.hasOwnProperty("policyFeatures") &&
              element.stringObject.policyFeatures.length > 0) {
              element.stringObject.policyFeatures.forEach(ele => {
                this.sumAssured += ele.featureSumInsured;
              });
              element.stringObject.sumAssured = this.sumAssured;
              if (element.stringObject.sumAssured == 0) {
                element.stringObject.sumAssured = element.stringObject.sumInsuredIdv;
              }
            } else {
              element.stringObject.sumAssured = element.stringObject.sumInsuredIdv;
            }
            if (element.stringObject.hasOwnProperty("addOns") &&
              element.stringObject.addOns.length > 0 && !element.stringObject.sumAssured) {
              element.stringObject.addOns.forEach(ele => {
                element.stringObject.sumAssured += ele.addOnSumInsured;
              });
            }
          }
          let obj =
          {
            id: element.id,
            acceptedOrDeclined: element.acceptedOrDeclined,
            adviceId: element.adviceId,
            adviceUuid: this.paramData.gropID,
            actionPerformed: this.datePipe.transform(new Date(element.actionPerformed), 'yyyy-MM-dd'),
            advice: {
              "id": element.adviceId,
              "adviceToCategoryTypeMasterId": element.advice.adviceToCategoryTypeMasterId
            },
          }
          this.consentData.push(obj)
        });
        this.isLoading = false;
        getAdviceSubs.unsubscribe();
      },
      error=>{
        this.dataSource.data = [];
      }
    )
  }

  save() {
    this.cusService.updateAssetConsent(this.consentData).subscribe(
      data => {
        this.eventService.openSnackBar("Consent updated", "Dismiss")

        setTimeout(() => {
          this.dialogClose()
        }, 300);
      }
    )
  }

  acceptOrDeclineConsent(index, choice) {
    this.consentData[index].acceptedOrDeclined = choice;
    this.consentData[index].actionPerformed = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  dialogClose() {
    this.Location.back();
  }
}
