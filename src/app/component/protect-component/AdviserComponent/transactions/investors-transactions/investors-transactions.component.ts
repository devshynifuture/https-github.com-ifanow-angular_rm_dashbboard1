import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { OnlineTransactionService } from '../online-transaction.service';
import { TransactionEnumService } from '../transaction-enum.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { EnumServiceService } from '../../../../../services/enum-service.service';
import { IinUccCreationComponent } from '../overview-transactions/IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { InvestorDetailComponent } from './investor-detail/investor-detail.component';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { apiConfig } from '../../../../../config/main-config';
import { appConfig } from '../../../../../config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { OpenPdfViewComponent } from '../open-pdf-view/open-pdf-view.component';
import { TransactionRoleService } from "../transaction-role.service";
import { MappedUserComponent } from './investor-detail/mapped-user/mapped-user.component';

@Component({
  selector: 'app-investors-transactions',
  templateUrl: './investors-transactions.component.html',
  styleUrls: ['./investors-transactions.component.scss']
})
export class InvestorsTransactionsComponent implements OnInit {
  isFileUploading = false;
  displayedColumns: string[] = ['aggregatorType', 'brokerCode', 'name', 'panNo', 'taxStatus', 'holdingType',
    'clientCode', 'status'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  clientId;
  filterData: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  noData: string;
  innUccPendindList: any;
  credentialData: any;
  dontHide: boolean;
  isPendingData = false;
  isLoading = false;
  isAdvisorSection = true;
  backupData: any[];
  backupData2: any[];
  tempFilter: any[];
  selectedString: any;
  status: any
  brokerCredentials: any;
  dataSource2: any[];
  activeOnSelect: boolean = false;
  // dataSource = ELEMENT_DATA;
  constructor(private onlineTransact: OnlineTransactionService,
    private eventService: EventService,
    public dialog: MatDialog,
    private enumServiceService: EnumServiceService,
    private subInjectService: SubscriptionInject,
    public transactionRoleService: TransactionRoleService,
    private router: Router) {
  }

  ngOnInit() {
    this.backupData = []
    this.tempFilter = []
    this.dataSource2 = [];
    const routeName = this.router.url.split('/')[1];
    if (routeName == 'customer') {
      this.isAdvisorSection = false;
      this.clientId = AuthService.getClientId();
    }
    this.advisorId = AuthService.getAdvisorId();
    this.isLoading = true;
    // this.getMappedData();
    this.getFilterOptionData();
    this.getBSECredentials()
  }
  mappedUser() {
    const fragmentData = {
      flag: 'mandate',
      data: this.dataSource2,
      id: 1,
      state: 'open',
      componentName: MappedUserComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {

        }
      }
    );
  }
  filter(flag) {
    this.selectedString = flag
    if (flag == 2) {
      var filter = this.tempFilter.filter((x) => x.statusStringTemp == 'Investment ready');
      this.dataSource.data = filter
    } else if (flag == 1) {
      var filter = this.backupData.filter((x) => x.statusStringTemp == 'Pending');
      this.dataSource.data = filter
    } else {
      this.getIINUCC()
    }
  }
  getBSECredentials() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data), error => {
        this.isLoading = false;
        this.dataSource.data = [];
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getBSECredentialsRes(data) {
    this.getBSESubBrokerCredentials();
    this.brokerCredentials = data;
  }
  getBSESubBrokerCredentials() {
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSESubBrokerCredentials(obj).subscribe(
      data => this.getBSESubBrokerCredentialsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource2 = [];
        this.isLoading = false;
      }
    );
  }

  getBSESubBrokerCredentialsRes(data) {
    this.isLoading = false;
    if (data == undefined || data.length == 0) {
      this.noData = 'No Investors found';
      this.dataSource2 = [];
    } else {
      this.brokerCredentials.forEach(function (ad) {
        const subBrokerMatch = data.find(function (tm) {
          return ad.id == tm.tpUserCredentialId;
        });
        if (subBrokerMatch && subBrokerMatch.euin) {
          ad.euin = subBrokerMatch.euin;
          ad.tp_nse_subbroker_mapping_id = subBrokerMatch.tpUserCredentialId;
          ad.subBrokerCode = subBrokerMatch.subBrokerCode;
        }
      });
      this.dataSource2 = this.brokerCredentials;
      this.dataSource2 = this.dataSource2.filter((x) => x.aggregatorType == 1);
      console.log('cred', this.dataSource2)
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    if (this.dataSource.filteredData.length == 0) {
      this.noData = 'No investors found';
    }
  }

  openPdfPopup() {
    const dialogRef = this.dialog.open(OpenPdfViewComponent, {
      width: '500px',
      height: '300px',
    });
  }

  refresh(flag) {
    this.dontHide = true;
    if (this.isPendingData) {
      this.getIINUCC();
    } else {
      this.isLoading = true;
      this.dataSource.data = [{}, {}, {}];
      this.isPendingData = false;
      this.updateAllNseClients();
    }
  }

  getFilterOptionData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data),
      err => {
        this.isLoading = false;
        this.noData = 'No credentials found';
        this.dataSource.data = [];
      }
    );
  }

  getFilterOptionDataRes(data) {
    if (data) {
      this.credentialData = data;
      this.getMappedData();
    } else {
      this.isLoading = false;
      this.dataSource.data = [];
      this.noData = 'No credentials found';
    }
    // this.filterData = TransactionEnumService.setPlatformEnum(data);
  }

  // sortDataFilterWise() {
  //   (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
  // }
  getMappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.isPendingData = false;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.isAdvisorSection ? 0 : this.clientId
      // tpUserCredentialId: this.selectedBrokerCode.id,
      // aggregatorType: this.selectedPlatform.aggregatorType
    };
    if (this.isAdvisorSection) {
      this.onlineTransact.getMapppedClients(obj).subscribe(
        data => {
          console.log('getIINUCC data :', data);
          this.handleMappedClientRes(data);
        },
        err => {
          this.isLoading = false;
          this.noData = 'No investors found';
          this.dataSource.data = [];
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    } else {
      this.onlineTransact.getMapppedClientsFilterClientWise(obj).subscribe(
        data => {
          console.log('getIINUCC data :', data);
          this.handleMappedClientRes(data);
        },
        err => {
          this.isLoading = false;
          this.noData = 'No investors found';
          this.dataSource.data = [];
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }
  }

  autoRemapClient() {
    const obj = {
      advisorId: AuthService.getAdminId(),
    };
    this.onlineTransact.autoRemapClientsToClientCode(obj).subscribe(
      data => {
        this.getMappedData();
      },
      err => {
        this.getMappedData();
      }
    );
  }

  updateAllNseClients() {
    const obj = {
      advisorId: AuthService.getAdminId(),
    };
    this.onlineTransact.updateAllNseClients(obj).subscribe(
      data => {
        this.autoRemapClient();
      },
      err => {
        this.autoRemapClient();
      }
    );
  }

  handleMappedClientRes(data) {
    if (data) {
      data.forEach(singleData => {
        if (singleData.activationStatus == 'YES' || singleData.aggregatorType == 2) {
          singleData.statusStringTemp = 'Investment ready';
        } else {
          singleData.statusStringTemp = 'Pending';
        }
      });
      this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
      this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService);
      this.tempFilter = this.dataSource.data
      this.backupData = this.dataSource.data
      this.dataSource.sort = this.sort;
    } else if (data == undefined) {
      this.noData = 'No investors found';
      this.dataSource.data = [];
    }
    this.isLoading = false;
  }

  getIINUCC() {
    this.dontHide = true;
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.isAdvisorSection ? 0 : this.clientId
    };
    this.isPendingData = true;
    this.onlineTransact.getIINUCCPending(obj).subscribe(
      data => {
        if (!data) {
          data = [];
          this.noData = 'No pending requests found';
        }
        data.forEach(singleData => {
          if (singleData.tpUserCredFamilyMappingId && singleData.tpUserCredFamilyMappingId > 0 && singleData.status > 0) {
            singleData.statusStringTemp = 'Investment ready';
          } else {
            singleData.statusStringTemp = 'Pending';
          }
        });
        console.log('getIINUCC data :', data);
        this.isLoading = false;
        this.dontHide = true;
        this.innUccPendindList = data || [];
        this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
        this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService);
        this.dataSource.sort = this.sort;
      },
      err => {
        this.noData = 'No pending requests found';
        this.isLoading = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  openNewCustomerIIN() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
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

  getFileDetails(e) {
    console.log('file', e);
    const file = e.target.files[0];
    const requestMap = {
      advisorId: this.advisorId
    };
    this.isFileUploading = true;
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.BSE_UCC_FILE_UPLOAD,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        console.log('getFileDetails uploadFileToServer callback item : ', item);
        console.log('getFileDetails uploadFileToServer callback status : ', status);
        console.log('getFileDetails uploadFileToServer callback headers : ', headers);
        console.log('getFileDetails uploadFileToServer callback response : ', response);
        this.isFileUploading = false;
        if (status == 200) {
          const responseObject = JSON.parse(response);
          console.log('onChange file upload success response url : ', responseObject.url);
          this.eventService.openSnackBar('File uploaded successfully');
        } else {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }
      });
  }

  openInvestorDetail(data) {
    if (this.isLoading || !this.isAdvisorSection) {
      return;
    }
    data['isPendingData'] = this.isPendingData;
    const fragmentData = {
      flag: 'investorDetail',
      data,
      id: 1,
      state: 'open35',
      componentName: InvestorDetailComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
