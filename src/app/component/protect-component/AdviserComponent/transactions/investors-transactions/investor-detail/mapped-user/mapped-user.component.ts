import { Component, OnInit } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OnlineTransactionService } from '../../../online-transaction.service';

@Component({
  selector: 'app-mapped-user',
  templateUrl: './mapped-user.component.html',
  styleUrls: ['./mapped-user.component.scss']
})
export class MappedUserComponent implements OnInit {

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'MAPPED',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  displayedColumns: string[] = ['position', 'name', 'weight', 'aid', 'euin', 'set',];
  fragmentData: any;
  storeData: any;
  iin: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private onlineTransaction: OnlineTransactionService
  ) { }

  get data() {
    return this.fragmentData;
  }

  set data(data) {
    this.fragmentData = { data };
    this.storeData = this.fragmentData.data;
    console.log(this.storeData)
    this.storeData.forEach(element => {
      element.selected = false
      element.iin = ''
    });
  }
  ngOnInit() {
  }
  changeCred(event, value) {
    console.log(event)
    console.log(value)
    this.storeData.forEach(element => {
      if (element.selected == value.selected && event.checked == true) {
        element.selected = event.checked
      } else {
        element.selected = false
      }
    });
  }
  closeRightSlider(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  mappedUser() {
    this.onlineTransaction.mappedExistingUser({})
      .subscribe(res => {
        if (res) {
          console.log('mappedUser', res)
          this.eventService.openSnackBar("Mapped exsting user Successfully", "Dismiss");
        } else {
          this.eventService.openSnackBar("Mapped exsting user Unsuccessful", "Dismiss");
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
  }
}
