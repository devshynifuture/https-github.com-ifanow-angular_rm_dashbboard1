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
  adminAdvisorIds = [];
  dataSource;
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  advisorId = AuthService.getAdvisorId();
  isLoading: boolean = false;
  selectBrokerForm = this.fb.group({
    selectBrokerId: [, Validators.required]
  });
  clientName = AuthService.getUserInfo().name;
  isBrokerSelected: boolean = false;
  parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
  adminId = AuthService.getAdminId();
  subAdvisorList = [];

  rtId;
  displayedColumns: string[] = ['doneOn', 'doneBy', 'totalFolioCount', 'unmatchedCountBeforeRecon', 'unmatchedCountAfterRecon', 'aumBalanceDate', 'transactionDate', 'deleted', 'reordered', 'orderSuccess', 'orderFailed', 'action']

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ElementI>(ELEMENT_DATA);
    this.isLoading = true;
    this.getRTList();
  }

  getRTList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        res.forEach(element => {
          if (element.name === "CAMS") {
            this.rtId = element.id;
          }
        });
        this.teamMemberListGet();
      });
  }

  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });
          this.getBrokerList();
        } else {
          this.adminAdvisorIds = [...this.advisorId];
          this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
      });
  }

  getBrokerList() {
    this.reconService.getBrokerListValues({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res) {
          this.brokerList = res;
          this.selectBrokerForm.get('selectBrokerId').patchValue(this.brokerList[0].id, { emitEvent: false });
          this.getAumReconHistoryData();
        }
      });
  }

  getAumReconHistoryData() {
    // check whether selectedBrokerid is selected 

    // make separate function for toggling the same
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
          if(res){
            this.dataSource.data = res;
          } else {
            this.dataSource.data = null;
            this.eventService.openSnackBar("No Data Found", "DISMISS");
          }
        }, err => {
          this.isLoading = false;
          this.dataSource.data = null;
          this.eventService.openSnackBar("No Data Found", "DISMISS");
          console.error(err);
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
        clientName: this.clientName,
        arnRiaCode: brokerCode,
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
            this.getAumReconHistoryData();
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