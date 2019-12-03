import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../../../subscription.service';

@Component({
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styleUrls: ['./fee-structure.component.scss']
})
export class FeeStructureComponent implements OnInit {
  advisorId: any;

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject, private eventService: EventService,private subService:SubscriptionService) {
  }

  _upperData;
  selectedFee;
  singleService;
  ngOnInit() {
    console.log('FeeStructureComponent init', this.upperData);
  }

  @Input()
  set upperData(upperData) {
    console.log('FeeStructureComponent upperData set : ', this.upperData);
    this.advisorId = AuthService.getAdvisorId();
    this._upperData = upperData;
    // setTimeout(() => {
    //   this.openPlanSliderFee(upperData, 'fixedFee', 'open');
    // }, 300);
  }

  get upperData(): any {
    return this._upperData;
  }

  selectedFees(feeType) {
    this.selectedFee = feeType;
  }

  openPlanSliderFee(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.eventService.sliderData(value);
    // this.subInjectService.rightSideData(data);
    // this.subInjectService.rightSliderData(state);
  }

  deleteService(singleService, value) {
    this.singleService = singleService
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document GD?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        const obj={
          advisorId:this.advisorId,
          id:this.singleService.id
        }
       this.subService.deleteService(obj).subscribe(
         data =>{this.deletedData(data);
          dialogRef.close();
        }
       )
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  Close() {
    this.eventService.changeUpperSliderState({state: 'close'});

  }
  deletedData(data) {
    if (data == true) {
      this.eventService.changeUpperSliderState({state: 'close'});
      this.eventService.openSnackBar('Deleted successfully!', 'dismiss');  
    }
  }
}
