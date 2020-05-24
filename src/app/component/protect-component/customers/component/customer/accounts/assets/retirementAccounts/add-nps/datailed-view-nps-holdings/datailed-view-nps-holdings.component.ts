import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {CustomerService} from '../../../../../customer.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-datailed-view-nps-holdings',
  templateUrl: './datailed-view-nps-holdings.component.html',
  styleUrls: ['./datailed-view-nps-holdings.component.scss']
})
export class DatailedViewNpsHoldingsComponent implements OnInit {
  npsData: any;
  schemeList: any = [];
  isLoading = false;

  dataSource: any = new MatTableDataSource();
  @ViewChild('epfListTable', {static: false}) holdingsTableSort: MatSort;
  displayedColumns = ['name', 'nav', 'units', 'amount', 'value'];
  name: any;
  bankList:any =[];
  ngOnInit() {
    this.getGlobalList();
    //link bank
    this.bankList = this.enumService.getBank();
    //link bank
  }

  getGlobalList() {
    this.custumService.getSchemeChoice().subscribe(
      data => this.getGlobalRes(data)
    );
  }

  constructor(private custumService: CustomerService,private enumService: EnumServiceService, private subInjectService: SubscriptionInject) {
  }

  getGlobalRes(data) {

    console.log('getGlobalRes', data);
    this.schemeList = data.npsSchemeList;
  }

  @Input()
  set data(data) {
    this.npsData = data;
    this.dataSource.data = data.holdingList;
    this.dataSource.sort = this.holdingsTableSort;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
