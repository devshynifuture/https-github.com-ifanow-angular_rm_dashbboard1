import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { OrderHistoricalFileComponent } from './../../order-historical-file/order-historical-file.component';
import { EventService } from './../../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { FileOrderingUpperComponent } from '../file-ordering-upper/file-ordering-upper.component';

@Component({
  selector: 'app-file-ordering-historical',
  templateUrl: './file-ordering-historical.component.html',
  styleUrls: ['./file-ordering-historical.component.scss']
})
export class FileOrderingHistoricalComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject
  ) { }
  displayedColumns: string[] = ['advisorName', 'rta', 'orderedby', 'startedOn', 'totalfiles', 'queue', 'ordering', 'ordered', 'failed', 'uploaded', 'refresh', 'empty'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterBy = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    console.log("this some event:::::::", event.value);

    // Add our filterBy
    if ((value || '').trim()) {
      this.filterBy.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  openUpperModule(flag, data) {
    const fragmentData = {
      flag: "clients",
      id: 1,
      data,
      direction: 'top',
      componentName: UpperSliderBackofficeComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();

        }
      }
    );

  }

  remove(filterBy): void {
    const index = this.filterBy.indexOf(filterBy);

    if (index >= 0) {
      this.filterBy.splice(index, 1);
    }
  }

  openHistoricalFileOrderingSlider(data) {
    const fragmentData = {
      flag: 'openHistoricalFileOrdering',
      data,
      id: 1,
      state: 'open50',
      componentName: OrderHistoricalFileComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openUpperFileOrdering(flag, data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag,
      id: 1,
      data,
      direction: 'top',
      componentName: FileOrderingUpperComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

}

export interface PeriodicElement {
  advisorName: string;
  rta: string;
  orderedby: string;
  startedOn: string;
  totalfiles: string;
  queue: string;
  ordering: string;
  ordered: string;
  failed: string;
  uploaded: string;
  refresh: string;
  empty: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { advisorName: 'Vivek Shah', rta: 'Franklin', orderedby: 'Satish Patel', startedOn: '08/01/2020 11:32', totalfiles: '1', queue: '5', ordering: '5', ordered: '58', failed: '51', uploaded: 'sa', refresh: '54', empty: '' },

];
