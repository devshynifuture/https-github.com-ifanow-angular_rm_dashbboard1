import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailAdviceComponent } from '../email-advice/email-advice.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../customer.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';
import { EventService } from 'src/app/Data-service/event.service';


@Component({
  selector: 'app-advice-all-portfolio',
  templateUrl: './advice-all-portfolio.component.html',
  styleUrls: ['./advice-all-portfolio.component.scss']
})
export class AdviceAllPortfolioComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'icons'];
  dataSource: any = new MatTableDataSource(ELEMENT_DATA);
  selectedAssetId = [];
  displayedColumns1: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'adate', 'icons'];
  dataSource1: any = new MatTableDataSource(ELEMENT_DATA1);
  
  constructor(private subInjectService: SubscriptionInject, private cusService: CustomerService, private eventService: EventService) { }
  @ViewChild("tableOne", { static: true }) sort1: MatSort;
  @ViewChild("tableTwo", { static: true }) sort2: MatSort;
  isLoading: boolean = false;
  ngOnInit() {
    this.dataSource.sort = this.sort1;
    this.dataSource1.sort = this.sort2;
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  checkSingle(flag, selectedData) {
    (flag.checked) ? this.selectedAssetId.push(selectedData.id) : this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.id), 1)
    console.log(this.selectedAssetId)
  }


  openEmailAdvice(data) {
    const fragmentData = {
      data,
      id: 1,
      state: 'open',
      componentName: EmailAdviceComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.eventService.openSnackBar('Bank added successfully', 'Ok');
         // this.getAccountList();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA = [
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya???s Higher education and Rahul???s Retirement goal', selected: false },
  { position: 'Rahul Jain1', name: 'Surplus from life csh flows (Lumpsum)1', weight: '35, 000', symbol: 'Invest towards Shreya???s Higher education and Rahul???s Retirement goal1', selected: false },

];

const ELEMENT_DATA1 = [
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya???s Higher education and Rahul???s Retirement goal', status: 'Given',
    date: '23/12/2019', adate: '23/12/2019', selected: false
  },
  {
    position: 'Rahul Jain2', name: 'Surplus from life csh flows (Lumpsum)1',
    weight: '35, 000', symbol: 'Invest towards Shreya???s Higher education and Rahul???s Retirement goal',
    status: 'Given', date: '23/12/2019', adate: '23/12/2019', selected: false
  },

]