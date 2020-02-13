import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-aum-all-rta',
  templateUrl: './aum-all-rta.component.html',
  styleUrls: ['./aum-all-rta.component.scss']
})
export class AumAllRtaComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  displayedColumns = ['rt', 'advisorName', 'arnria', 'doneOn', 'doneBy', 'total', 'before', 'after', 'aumBalance', 'transaction', 'report']
  dataSource = ELEMENT_DATA;

  constructor(public eventService: EventService, ) { }

  ngOnInit() {
  }


  openUpperModule(flag, data) {
    data.flag = flag
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'clietns',
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

}


const ELEMENT_DATA = [
  { rt: 'Admin Name', advisorName: 'Hydrogen', arnria: 1.0079, doneOn: 'H', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
  { rt: 'Admin Name', advisorName: 'Helium', arnria: 4.0026, doneOn: 'He', doneBy: '30 mins ago', total: 'active', before: 'planName', after: '18/03/2020', aumBalance: '3', transaction: '1', report: '' },
];
