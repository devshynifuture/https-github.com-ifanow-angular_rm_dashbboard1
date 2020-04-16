import { AuthService } from './../../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UpperSliderBackofficeComponent } from './../../../../../SupportComponent/common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { MatTableDataSource } from '@angular/material';
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
  advisorId = AuthService.getAdvisorId();
  isLoading: boolean = false;
  selectBrokerForm = this.fb.group({
    selectBrokerId: [, Validators.required]
  });

  isBrokerSelected: boolean = false;
  parentId = AuthService.getParentId();
  adminId = AuthService.getAdminId();
  adminAdvisorIds: any[] = [];

  @Input() rtId;
  displayedColumns: string[] = ['doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'deleted', 'reordered', 'orderSuccess', 'orderFailed', 'action']

  ngOnInit() {
    console.log("this is parent and adminId ", this.parentId, this.adminId);
    this.dataSource = new MatTableDataSource<ElementI>(ELEMENT_DATA);
    this.getBrokerList();
    this.teamMemberListGet()
    console.log('my id is ::', this.rtId);
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
          this.eventService.openSnackBar('No Team Member Found', 'DISMISS');
        }
      });
  }

  getBrokerList() {
    this.reconService.getBrokerListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          this.brokerList = res;
        }
      });
  }

  getAumReconHistoryData() {
    // check whether selectedBrokerid is selected 

    // make separate function for toggling the same
    if (this.selectBrokerForm.get('selectBrokerId').value) {
      this.isLoading = true;
      this.isBrokerSelected = true;
      const data = {
        advisorIds: [...this.adminAdvisorIds],
        brokerId: this.selectBrokerForm.get('selectBrokerId').value,
        rmId: 0,
        rtId: this.rtId,
        parentId: this.adminId == 0 ? this.advisorId : this.parentId
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
      flag,
      id: 1,
      data: {
        ...data,
        startRecon: flag === 'startReconciliation' ? true : (flag === 'report' ? false : null),
        brokerId: this.selectBrokerForm.get('selectBrokerId').value,
        rtId: this.rtId,
        flag,
      },
      direction: 'top',
      componentName: UpperSliderBackofficeComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper']);
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
            // call history get
            this.getAumReconHistoryData()
          }
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
}

interface ElementI {
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