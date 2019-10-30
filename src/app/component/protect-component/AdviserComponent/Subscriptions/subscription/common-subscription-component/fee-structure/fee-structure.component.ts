import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styleUrls: ['./fee-structure.component.scss']
})
export class FeeStructureComponent implements OnInit {

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject, private eventService: EventService) {
  }

  _upperData = '';
  selectedFee;

  ngOnInit() {
    console.log('FeeStructureComponent init', this.upperData);
  }

  @Input()
  set upperData(upperData) {
    console.log('FeeStructureComponent upperData set : ', this.upperData);

    this._upperData = upperData;
    // setTimeout(() => {
    //   this.openPlanSliderFee(upperData, 'fixedFee', 'open');
    // }, 300)
  }

  get upperData(): any {
    return this._upperData;
  }

  selectedFees(feeType) {
    this.selectedFee = feeType;
  }

  openPlanSliderFee(data, value, state) {
    this.eventService.sliderData(value);
    this.subInjectService.rightSideData(data);
    this.subInjectService.rightSliderData(state);
  }

  deleteService(singleService, value) {
    console.log(singleService, value)

    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the service?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      serviceData: singleService
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
