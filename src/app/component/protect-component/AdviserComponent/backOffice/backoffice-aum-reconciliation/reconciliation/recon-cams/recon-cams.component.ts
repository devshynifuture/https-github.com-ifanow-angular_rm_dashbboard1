import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UpperSliderBackofficeComponent } from './../../../../../SupportComponent/common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { Component, OnInit, Input } from '@angular/core';
import { ReconciliationService } from '../reconciliation.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recon-cams',
  templateUrl: './recon-cams.component.html',
  styleUrls: ['./recon-cams.component.scss']
})
export class ReconCamsComponent implements OnInit {

  constructor(
    private reconService: ReconciliationService,
    private eventService: EventService,
    private fb: FormBuilder
  ) { }

  brokerList: any[] = [];
  dataSource;
  advisorId;
  isLoading: boolean = false;
  selectBrokerForm = this.fb.group({
    selectBrokerId: [, Validators.required]
  });

  isBrokerSelected: boolean = false;

  @Input() rtId;
  displayedColumns: string[] = ['doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'deleted', 'reordered', 'orderSuccess', 'orderFailed', 'action']

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ElementI>(ELEMENT_DATA);
    this.getBrokerList();
    console.log('my id is ::', this.rtId);
  }

  getBrokerList() {
    this.advisorId = AuthService.getAdvisorId();

    this.reconService.getBrokerListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        console.log(res);
        res.forEach(item => {
          const { id } = item;
          const { brokerCode } = item;
          this.brokerList.push({
            id,
            brokerCode
          })
        });
        console.log(this.brokerList);
      })
  }

  getAumReconHistoryData(event) {
    if (this.selectBrokerForm.get('selectBrokerId').value) {
      this.isLoading = true;
      this.isBrokerSelected = true;
      console.log(event);
      const data = {
        advisorId: this.advisorId,
        brokerId: this.selectBrokerForm.get('selectBrokerId').value,
        rmId: 0,
        rtId: this.rtId
      }
      this.reconService.getAumReconHistoryDataValues(data)
        .subscribe(res => {
          this.isLoading = false;
          console.log("this is some values ::::::::::", res);
          this.dataSource.data = res;
        })
    }
  }

  openAumReconciliation(flag, data) {
    const fragmentData = {
      flag: 'startAumReconciliation',
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

export interface ElementI {
  doneOn: string,
  doneBy: string,
  totalFolioCount: string,
  unmatchedCountBeforeRecon: string,
  unmatchedCountAfterRecon: string,
  aumBalanceDate: string,
  transactionDate: string,
  deleted: string,
  reordered: string,
  orderSuccess: string,
  orderFailed: string
  action: string
}

const ELEMENT_DATA: ElementI[] = [
  { doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', deleted: '', reordered: '', orderSuccess: '', orderFailed: '', action: '' },
  { doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', deleted: '', reordered: '', orderSuccess: '', orderFailed: '', action: '' },
  { doneOn: '', doneBy: '', totalFolioCount: '', unmatchedCountBeforeRecon: '', unmatchedCountAfterRecon: '', aumBalanceDate: '', transactionDate: '', deleted: '', reordered: '', orderSuccess: '', orderFailed: '', action: '' },
]