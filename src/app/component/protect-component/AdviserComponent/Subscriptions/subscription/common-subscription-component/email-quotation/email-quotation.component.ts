import {Component, OnInit, Input} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {MatDialog} from '@angular/material';
import {HowItWorksComponent} from '../how-it-works/how-it-works.component';

@Component({
  selector: 'app-email-quotation',
  templateUrl: './email-quotation.component.html',
  styleUrls: ['./email-quotation.component.scss']
})
export class EmailQuotationComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, public dialog: MatDialog) {
  }

  @Input() headerData;
  @Input() headerDataInvoice;
  @Input() headerDataDocuments;
  showSent = 'false';

  ngOnInit() {
    this.showSent = 'false';
    console.log('this.headerData', this.headerData)
  }

  Close(state) {
    this.subInjectService.rightSliderData(state)
    this.subInjectService.rightSideData(state)
    this.showSent = 'false';

  }

  closeTab(state, value) {
    console.log(state)
    this.subInjectService.rightSliderData(state)
    this.subInjectService.closeSlider(value)
  }

  sentMail() {
    this.showSent = 'true';
  }

  openModel(data) {
    let Fragmentdata = {
      Flag: data,
    }
    const dialogRef = this.dialog.open(HowItWorksComponent, {
      width: '50%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
