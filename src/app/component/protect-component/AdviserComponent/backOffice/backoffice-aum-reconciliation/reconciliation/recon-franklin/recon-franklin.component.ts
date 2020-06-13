import { Component, OnInit, Input } from '@angular/core';
import { ReconciliationService } from '../reconciliation.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { UpperSliderBackofficeComponent } from 'src/app/component/protect-component/SupportComponent/common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-recon-franklin',
  templateUrl: './recon-franklin.component.html',
  styleUrls: ['./recon-franklin.component.scss']
})
export class ReconFranklinComponent implements OnInit {
  adminAdvisorIds: any[] = [];
  adminId: number = AuthService.getAdminId();

  constructor(
    private reconService: ReconciliationService,
    private eventService: EventService,
    private fb: FormBuilder
  ) { }

  brokerList: any[] = [];
  dataSource;
  advisorId = AuthService.getAdvisorId();
  parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
  isBrokerSelected: boolean = false;
  isLoading: boolean = false;
  selectBrokerForm = this.fb.group({
    selectBrokerId: [, Validators.required]
  });
  clientName = AuthService.getUserInfo().name;

  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;

  @Input() rtId;
  displayedColumns: string[] = ['doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'deleted', 'reordered', 'orderSuccess', 'orderFailed', 'action']

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ElementI>(ELEMENT_DATA);
    this.getBrokerList();
    this.teamMemberListGet();
  }

  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });
        } else {
          this.adminAdvisorIds = [...this.advisorId];
          this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
      });
  }

  getBrokerList() {
    this.reconService.getBrokerListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        this.brokerList = res;
      });
  }

  getAumReconHistoryData() {
    if (this.selectBrokerForm.get('selectBrokerId').value) {
      this.isLoading = true;
      this.dataSource.data = ELEMENT_DATA;
      this.isBrokerSelected = true;
      const data = {
        advisorIds: [...this.adminAdvisorIds],
        brokerId: this.selectBrokerForm.get('selectBrokerId').value,
        rmId: this.rmId,
        rtId: this.rtId,
        parentId: this.adminId == 0 ? this.advisorId : this.parentId,
        isParent: (this.parentId === this.advisorId) ? true : false
      }
      this.reconService.getAumReconHistoryDataValues(data)
        .subscribe(res => {
          this.isLoading = false;
          this.dataSource.data = res;
        })
    }
  }

  openAumReconciliation(flag, data) {
    let brokerId = this.selectBrokerForm.get('selectBrokerId').value;
    let brokerCode = this.brokerList.find(c => c.id === brokerId).brokerCode;
    const fragmentData = {
      flag,
      id: 1,
      data: {
        ...data,
        startRecon: flag === 'startReconciliation' ? true : (flag === 'report' ? false : null),
        brokerId: this.selectBrokerForm.get('selectBrokerId').value,
        rtId: this.rtId,
        flag,
        arnRiaCode: brokerCode,
        clientName: this.clientName
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
          if (UtilService.isRefreshRequired(upperSliderData)) {
            // call history get
            this.getAumReconHistoryData();
          }
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