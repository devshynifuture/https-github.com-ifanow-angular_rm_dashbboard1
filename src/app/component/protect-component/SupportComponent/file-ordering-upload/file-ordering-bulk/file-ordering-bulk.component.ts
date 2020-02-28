import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { FileOrderingUpperComponent } from '../file-ordering-upper/file-ordering-upper.component';
import { FileOrderingSetupComponent } from './file-ordering-setup/file-ordering-setup.component';

@Component({
  selector: 'app-file-ordering-bulk',
  templateUrl: './file-ordering-bulk.component.html',
  styleUrls: ['./file-ordering-bulk.component.scss']
})
export class FileOrderingBulkComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject
  ) { }
  displayedColumns: string[] = ['rta', 'description', 'orderedby', 'startedOn', 'totalfiles', 'queue', 'ordering', 'ordered', 'failed', 'uploaded', 'refresh', 'empty'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
  }


  openUpperFileOrdering(flag, data) {
    data.flag = flag
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'clietns',
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

  openUpperBulkFileOrdering(data) {
    const fragmentData = {
      flag: 'openFileOrderingSetup',
      data,
      id: 1,
      state: 'open45',
      componentName: FileOrderingSetupComponent
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
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

}

export interface PeriodicElement {
  rta: string;
  description: string;
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
  { rta: 'Franklin', description: 'adjvbakdvj', orderedby: 'Satish Patel', startedOn: '08/01/2020 11:32', totalfiles: '1', queue: '5', ordering: '5', ordered: '58', failed: '51', uploaded: 'sa', refresh: '', empty: '' },
  { rta: 'Karvy', description: 'kdua', orderedby: 'Rahul Jain', startedOn: '09/02/2020 11:32', totalfiles: '4', queue: '3', ordering: '6', ordered: '3', failed: '354', uploaded: 'saq3', refresh: '', empty: '' },

];
