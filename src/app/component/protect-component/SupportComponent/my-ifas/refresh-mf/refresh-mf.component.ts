import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { AdvisorMarketplaceService } from '../../../Advisor-Marketplace/advisor-marketplace.service';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from '../../../PeopleComponent/people.service';
import { SupportService } from '../../support.service';

@Component({
  selector: 'app-refresh-mf',
  templateUrl: './refresh-mf.component.html',
  styleUrls: ['./refresh-mf.component.scss']
})
export class RefreshMfComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    private advisorMarketPlaceService: AdvisorMarketplaceService,
    private eventService: EventService,
    private peopleService: PeopleService,
    private supportService: SupportService) { }

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'mobile', 'email', 'pan', 'refresh'];
  selection = new SelectionModel<any>(true, []);
  isLoading: boolean = false;
  @Input() data;
  stateCtrl = new FormControl('', [Validators.required]);
  filteredStates: any;
  clientList: any = [];
  selectedClientData: any = {};
  showSuggestion: boolean;
  showMedium: boolean = false;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Send request',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  showSpinnerOwner: boolean;

  reviewMedum = [];
  noClient: boolean;
  disableList: any;

  ngOnInit() {
    this.getClientList();
  }

  getClientList() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}]
    const obj = {
      advisorId: this.data.advisorId,
      status: 1,
      limit: -1,
      offset: 0
    };
    this.peopleService.getClientList(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.isLoading = false;
          data.forEach(element => {
            element['isLoader'] = false;
            if (element.emailList && element.emailList.length > 0) {
              element['emailId'] = element.emailList[0].email
            } else {
              element['emailId'] = '-'
            }
          });
          this.dataSource.data = data;
        } else {
          this.dataSource.data = []
          this.isLoading = false;
        }
      }, err => {
        this.dataSource.data = []
        this.isLoading = false;
      }
    )
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;


  filterTableByName(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    if (this.dataSource.filteredData.length == 0) {
      this.dataSource.data = [];
      this.stateCtrl.setErrors({ invalid: true })
    }
  }


  refreshMfOfClient(data) {
    data.isLoader = true;
    const obj = {
      clientId: data.clientId
    }
    this.supportService.refreshMutualFundList(obj).subscribe(res => {
      data.isLoader = false;
      this.eventService.openSnackBar(`${data.name} mutual fund list refreshed sucessfuylly`, "Dismiss");
    }, err => {
      data.isLoader = false;
      this.eventService.openSnackBar(err, "Dimiss");
    })
  }


  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: flag });
  }

}
