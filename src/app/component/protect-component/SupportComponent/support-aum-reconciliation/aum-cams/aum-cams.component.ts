import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';

@Component({
  selector: 'app-aum-cams',
  templateUrl: './aum-cams.component.html',
  styleUrls: ['./aum-cams.component.scss']
})
export class AumCamsComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  displayedColumns = ['rtId', 'advisorName', 'arnria', 'doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'report']
  dataSource = new MatTableDataSource<AumCamsI>(ELEMENT_DATA);
  rtId;
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  rtaList = [];

  constructor(
    public eventService: EventService,
    private reconService: ReconciliationService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res) {
          res.forEach(element => {
            if (element.name === "CAMS") {
              this.rtId = element.id;
            }
            if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
              this.rtaList.push({
                name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
                value: element.id
              });
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

  getRtName(id) {
    let obj = this.rtaList.find(c => c.value === id);
    return obj.name;
  }

  getAumHistoryData() {
    const data = {
      rtId: this.rtId,
      rmId: this.rmId
    }

    this.reconService.getAumReconHistoryDataValues(data)
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          let tableData = [];
          res.forEach(element => {
            tableData.push({
              id: element.id,
              rmId: element.rmId,
              advisorId: element.advisorId,
              brokerId: 4,
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
              flag: "report",
              rtName: this.getRtName(element.rtId)
            })
          });

          this.dataSource.data = tableData;
          this.dataSource.sort = this.sort;

        } else {
          this.dataSource.data = null;
          this.eventService.openSnackBar("No AUM History Found", "Dismiss");
        }
      })
  }

  openUpperModule(flag, data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag,
      id: 1,
      data: {
        ...data,
        clientName: data.advisorName,
        arnRiaCode: data.arnria,
        // no arnRiaNumber getting from backend
      },
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
            this.isLoading = true;
            this.dataSource.data = ELEMENT_DATA;
            this.getAumHistoryData();
          }
          subscription.unsubscribe();
        }
      }
    );

  }

}


export interface AumCamsI {
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

const ELEMENT_DATA: AumCamsI[] = [
  { rtId: '', advisorName: '', arnria: '', doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', report: '' },
  { rtId: '', advisorName: '', arnria: '', doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', report: '' },
  { rtId: '', advisorName: '', arnria: '', doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', report: '' },

];
