import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { SupportAumReconService } from '../support-aum-recon.service';

@Component({
  selector: 'app-aum-all-rta',
  templateUrl: './aum-all-rta.component.html',
  styleUrls: ['./aum-all-rta.component.scss']
})
export class AumAllRtaComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  displayedColumns = ['rtId', 'advisorName', 'arnria', 'doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'report']
  dataSource = new MatTableDataSource<AumAllRtaI>(ELEMENT_DATA);
  rtId;

  advisorId = 2808;

  constructor(
    public eventService: EventService,
    private reconService: ReconciliationService,
    private supportAumReconService: SupportAumReconService
  ) { }

  ngOnInit() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res) {
          res.forEach(element => {
            if (element.name === "All") {
              this.rtId = element.id;
            }
          });
          this.getAumHistoryData();

          // this.supportAumReconService.getRmUserInfo({})
          //   .subscribe(res=>{
          //     console.log(res);
          //     if(res){
          //       res.forEach(element => {
          //         if(element.id === 1){

          //         }
          //       });
          //     }
          //   });
        }
      }, err => {
        console.error(err);
      });
  }

  getAumHistoryData() {
    this.isLoading = true;
    const data = {
      advisorId: 2808,
      brokerId: 0,
      rtId: this.rtId,
      // rtId: 0,
      rmId: 3
    }

    this.reconService.getAumReconHistoryDataValues(data)
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          let tableData = [];
          console.log(res)
          res.forEach(element => {
            tableData.push({
              id: element.id,
              rmId: element.rmId,
              advisorId: element.advisorId,
              brokerId: element.brokerId,
              orderTypeId: element.orderTypeId,
              matchedCount: element.matchedCount,
              rtId: element.rtId,
              advisorName: element.advisorName,
              arnria: '---',
              doneOn: element.doneOn,
              doneBy: element.doneBy,
              totalFolioCount: element.totalFolioCount,
              unmatchedCountBeforeRecon: element.unmatchedCountBeforeRecon,
              unmatchedCountAfterRecon: element.unmatchedCountAfterRecon,
              aumBalanceDate: element.aumBalanceDate,
              transactionDate: element.transactionDate,
              report: '',
              orderSuccess: element.orderSuccess,
              orderFailed: element.orderFailed,
              reordered: element.reordered,
              deleted: element.deleted,
              startRecon: false,
              flag: "report"
            })
          });

          this.dataSource.data = tableData;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        } else {
          this.dataSource.data = null;
          this.eventService.openSnackBar("No AUM History Found", "DISMISS");
        }
      })
  }

  openUpperModule(flag, data) {
    console.log('hello mf button clicked');

    // const fragmentData = {
    //   flag,
    //   id: 1,
    //   data: {
    //     ...data,
    //     startRecon: flag === 'startReconciliation' ? true : (flag === 'report' ? false : null),
    //     brokerId: this.selectBrokerForm.get('selectBrokerId').value,
    //     rtId: this.rtId,
    //     flag,
    //   },
    //   direction: 'top',
    //   componentName: UpperSliderBackofficeComponent,
    //   state: 'open'
    // };

    const fragmentData = {
      flag,
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
          if (UtilService.isRefreshRequired(upperSliderData)) {
            this.dataSource.data = ELEMENT_DATA;
            this.getAumHistoryData();
          }
          subscription.unsubscribe();
        }
      }
    );

  }
}


export interface AumAllRtaI {
  rtId: string;
  advisorName: string;
  arnria: string;
  doneOn: string;
  doneBy: string;
  totalFolioCount: string;
  unmatchedCountBeforeRecon: string;
  unmatchedCountAfterRecon: string;
  aumBalanceDate: string;
  transactionDate: string;
  report: string;
}

const ELEMENT_DATA: AumAllRtaI[] = [
  { rtId: '', advisorName: '', arnria: '', doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', report: '' },
  { rtId: '', advisorName: '', arnria: '', doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', report: '' },
  { rtId: '', advisorName: '', arnria: '', doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', report: '' },
];
