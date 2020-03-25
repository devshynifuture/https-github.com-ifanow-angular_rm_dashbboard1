import { ReconciliationDetailsViewComponent } from './../../../../SupportComponent/common-component/reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ReconciliationService } from '../reconciliation/reconciliation.service';
import { FolioMasterDetailViewComponent } from '../folio-master-detail-view/folio-master-detail-view.component';
import { AuthService } from '../../../../../../auth-service/authService';

@Component({
  selector: 'app-folio-query',
  templateUrl: './folio-query.component.html',
  styleUrls: ['./folio-query.component.scss']
})
export class FolioQueryComponent implements OnInit {
  advisorId = AuthService.getAdvisorId();

  constructor(
    private reconService: ReconciliationService,
    private subInjectService: SubscriptionInject
  ) { }
  displayedColumns: string[] = ['folioNumber', 'schemeName', 'investorName', 'arnRiaCode', 'reconStatus', 'transactions', 'folioDetails'];
  isSearchDone: boolean = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<folioQueryI>(ELEMENT_DATA);

  optionList = [];

  ngOnInit() {
    this.dataSource.data = ELEMENT_DATA;
  }

  search(flag, value) {
    // search query logic
    // on hold
    console.log(typeof value);
    const data = {
      flag_search: flag,
      advisorId: this.advisorId,
      key: value
    };

    this.reconService.getFolioQueryDataListValues(data)
      .subscribe(res => {
        console.log(res);
        // toggling view
        this.isSearchDone = !this.isSearchDone;
      })

  }

  openReconDetailView(element) {

  }

  openFolioMasterDetailView(flag, data) {
    const fragmentData = {
      flag,
      data,
      id: 1,
      state: 'open40',
      componentName: FolioMasterDetailViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: is refresh Required??? ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


}

interface folioQueryI {
  folioNumber: string;
  schemeName: string;
  investorName: string;
  arnRiaCode: string;
  reconStatus: string;
  transactions: string;
  folioDetails: string;
}

const ELEMENT_DATA: folioQueryI[] = [
  { folioNumber: '3423', schemeName: 'sdfbhsf', investorName: 'wrgerfgsd', arnRiaCode: 'warsgherfg', reconStatus: 'adgjnadfha', transactions: 'adfhdfhdyh', folioDetails: 'sdthsdfhsd' },
  { folioNumber: '34234', schemeName: 'sdfsdf', investorName: 'sthaseg', arnRiaCode: 'agfsdag', reconStatus: 'astfhbdf', transactions: 'afgbdgbsdf', folioDetails: 'sdgfhsdfh' },
  { folioNumber: '5434', schemeName: 'sdgasdrfg', investorName: 'argaweras', arnRiaCode: 'dgnhsdfsd', reconStatus: 'aerhagdsfhsd', transactions: 'sdfhdfgsd', folioDetails: 'eshbdfh' },

]
