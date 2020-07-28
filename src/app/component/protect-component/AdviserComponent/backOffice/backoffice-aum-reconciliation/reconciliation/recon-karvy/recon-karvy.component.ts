import { AuthService } from './../../../../../../../auth-service/authService';
import { Component, OnInit, Input } from '@angular/core';
import { ReconciliationService } from '../reconciliation.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { UpperSliderBackofficeComponent } from 'src/app/component/protect-component/SupportComponent/common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-recon-karvy',
  templateUrl: './recon-karvy.component.html',
  styleUrls: ['./recon-karvy.component.scss']
})
export class ReconKarvyComponent implements OnInit {
  adminAdvisorIds: any[] = [];
  subAdvisorList = [];
  adminId = AuthService.getAdminId();

  clientName = AuthService.getUserInfo().name;
  constructor(
    private reconService: ReconciliationService,
    private eventService: EventService,
    private fb: FormBuilder
  ) { }

  brokerList: any[] = [];
  dataSource;
  advisorId = AuthService.getAdvisorId();
  parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
  isLoading: boolean = false;
  isBrokerSelected: boolean = false;
  selectBrokerForm = this.fb.group({
    selectBrokerId: [, Validators.required]
  })

  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;

  @Input() rtId;
  displayedColumns: string[] = ['doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'deleted', 'reordered', 'orderSuccess', 'orderFailed', 'action']

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ElementI>(ELEMENT_DATA);
    this.getBrokerList();
    // this.teamMemberListGet();
    this.getSubAdvisorList();
  }

  // teamMemberListGet() {
  //   this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
  //     .subscribe(data => {
  //       if (data && data.length !== 0) {
  //         data.forEach(element => {
  //           this.adminAdvisorIds.push(element.adminAdvisorId);
  //         });
  //       } else {
  //         this.adminAdvisorIds = [...this.advisorId];
  //         this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
  //       }
  //     });
  // }


  getBrokerList() {
    this.reconService.getBrokerListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        this.brokerList = res;
      });
  }

  getSubAdvisorList() {
    this.reconService.getSubAdvisorListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          console.log("this is subAdvisor list::::", res);
          this.subAdvisorList = res;
        }
      })
  }


  getAumReconHistoryData() {
    if (this.selectBrokerForm.get('selectBrokerId').value) {
      this.isLoading = true;
      this.dataSource.data = ELEMENT_DATA;
      this.isBrokerSelected = true;

      const data = {
        advisorIds: [this.advisorId, ...this.subAdvisorList],
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
          // this.getClientSubscriptionList();
          if (UtilService.isRefreshRequired(upperSliderData)) {
            this.getAumReconHistoryData()
          }
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