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

  // dataSource = ELEMENT_DATA;
  constructor(private onlineTransact: OnlineTransactionService,
    private eventService: EventService,
    public dialog: MatDialog,
    private enumServiceService: EnumServiceService,
    private subInjectService: SubscriptionInject,
    private router: Router) {
  }

  ngOnInit() {
    const routeName = this.router.url.split('/')[1];
    if (routeName == 'customer') {
      this.isAdvisorSection = false;
      this.clientId = AuthService.getClientId();
    }
    this.advisorId = AuthService.getAdvisorId();
    this.isLoading = true;
    // this.getMappedData();
    this.getFilterOptionData();
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
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  refresh(flag) {
    this.dontHide = true;
    if (this.isPendingData) {
      this.getIINUCC();
    } else {
      this.getMappedData();
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

  handleMappedClientRes(data) {
    if (data) {
      data.forEach(singleData => {
        if (singleData.activationStatus == 'YES') {
          singleData.statusStringTemp = 'Investment ready';
        } else {
          singleData.statusStringTemp = 'Pending';
        }
      });
      this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
      this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService);
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
        data.forEach(singleData => {
          if (singleData.tpUserCredFamilyMappingId && singleData.tpUserCredFamilyMappingId > 0) {
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
    if (this.isLoading || !this.isPendingData || !this.isAdvisorSection) {
      return;
    }
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
