import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatSort} from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../../../../customer.service';

@Component({
  selector: 'app-datailed-view-nps-holdings',
  templateUrl: './datailed-view-nps-holdings.component.html',
  styleUrls: ['./datailed-view-nps-holdings.component.scss']
})
export class DatailedViewNpsHoldingsComponent implements OnInit {
  npsData: any;
  schemeList:any=[]
  dataSource: any = new MatTableDataSource();
  @ViewChild('epfListTable', { static: false }) holdingsTableSort: MatSort;
  displayedColumns = ['name', 'units', 'amount', 'value'];
  constructor(private custumService: CustomerService,private subInjectService: SubscriptionInject) { }
  ngOnInit() {
    this.getGlobalList();
  }

  getGlobalList() {
    this.custumService.getSchemeChoice().subscribe(
      data => this.getGlobalRes(data)
    );
  }
  name:any;
  getGlobalRes(data) {

    console.log('getGlobalRes', data)
    this.schemeList = data.npsSchemeList;
  }
  @Input()
  set data(data) {
    this.npsData = data;
    this.dataSource.data = data.holdingList;
    this.dataSource.sort = this.holdingsTableSort;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
