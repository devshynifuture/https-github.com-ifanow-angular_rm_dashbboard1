import { AuthService } from './../../../../../auth-service/authService';
import { SupportService } from './../../support.service';
import { ExcelService } from './../../../customers/component/customer/excel.service';
import { ConfirmDialogComponent } from './../../../common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from './../../../../../Data-service/event.service';
import { UtilService } from './../../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { ReconciliationDetailsViewComponent } from '../reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';


@Component({
  selector: 'app-upper-slider-backoffice',
  templateUrl: './upper-slider-backoffice.component.html',
  styleUrls: ['./upper-slider-backoffice.component.scss'],
})
export class UpperSliderBackofficeComponent implements OnInit {
  arrWithTransCheckTrueAndisMappedMinusOne: any = [];
  markFolioIndex: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private dialog: MatDialog,
    private supportService: SupportService,
    private datePipe: DatePipe,
    private reconService: ReconciliationService,
    private util: UtilService
  ) { }

  displayedColumns: string[] = ['doneOne', 'totalfolios', 'before_recon', 'after_recon', 'aum_balance', 'transaction', 'export_folios'];
  displayedColumns1: string[] = ['name', 'folioNumber', 'unitsIfanow', 'unitsRta', 'difference', 'transactions'];
  displayedColumns3: string[] = ['folios', 'fileOrderDateTime', 'status', 'referenceId', 'transactionAddedInFiles', 'transactionAdded', 'fileName', 'fileUrl'];

  dataSource = new MatTableDataSource(ELEMENT_DATA); // summary table
  dataSource1 = new MatTableDataSource(ELEMENT_DATA1); // manual recon all folio table
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2); // manual recon duplicate folio table
  dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3); // delete and reorder table
  isFranklinTab = false;
  isTabDisabled = true;

  data;
  brokerId;
  subTabState = 1;
  aumReconId: any = null;
  isLoading = false;
  aumList: any;
  mutualFundIds: any[] = [];
  advisorId = AuthService.getAdvisorId();

  rtId: any;
  didAumReportListGot = false;
  aumListReportValue: any[] = [];
  adminAdvisorIds: any[] = [];
  adminId = AuthService.getAdminId();
  parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
  isLoadingForDuplicate = false;
  canExportExcelSheet = 'false';
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  upperHeaderName;
  isRmLogin = AuthService.getUserInfo().isRmLogin;
  deleteReorderOrDeleteDisabled = 'none';
  filteredAumListWithIsMappedToMinusOne: any = [];
  reportDuplicateFoliosIsMappedToMinusOne: any[];
  arnRiaCode;

  rtaList = [];

  ngOnInit() {
    if (this.data.hasOwnProperty('arnRiaCode')) {
      this.arnRiaCode = this.data.arnRiaCode;
    }
    this.advisorId = AuthService.getAdvisorId() ? AuthService.getAdvisorId() : this.data.advisorId;
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    this.getRtaList();
  }

  getRtaList() {
    this.isLoading = true;
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          res.forEach(element => {
            if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
              this.rtaList.push({
                name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
                value: element.id,
                type: 'rta'
              });
            }
          });

          this.upperHeaderName = this.getRtName(this.data.rtId);
          this.teamMemberListGet();
        } else {
          this.eventService.openSnackBar('Error In Fetching RTA List', 'Dismiss');
        }
      });
  }

  getRtName(id) {
    const obj = this.rtaList.find(c => c.value == id);
    return obj.name;
  }

  handlingDataVariable(doStartRecon?) {
    if (this.data) {
      this.aumReconId = this.data.id;
      this.brokerId = this.data.brokerId;
    }

    if (this.data.startRecon) {
      this.rtId = this.data.rtId;
      this.isFranklinTab = (this.getRtName(this.rtId) === 'FRANKLIN_TEMPLETON') ? true : false;

      console.log('start recon is true::::');
      this.isLoading = true;

      if (doStartRecon) {
        this.getBackofficeAumReconListSummary(true);
      } else {
        this.getBackofficeAumReconListSummary(false);
      }
      this.dataSource3.data = null;

    } else if (this.data.startRecon === false) {
      this.arnRiaCode = this.data.arnRiaNumber;
      this.rtId = this.data.rtId;
      console.log('start recon is false::::');
      this.bindDataWithSummaryTable();
      this.getAumReportList();
      this.getBackofficeAumFileOrderListDeleteReorder();

    }
    console.log('this is data that we got from franklin:::::::', this.data);
  }

  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          console.log('team members: ', data);
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });
        } else {
          this.adminAdvisorIds = [this.advisorId];
          this.eventService.openSnackBar('No Team Member Found', 'Dismiss');
        }
        this.handlingDataVariable(true);
      }, err => {
        console.log(err);
      });
  }

  bindDataWithSummaryTable() {
    let objArr = [];
    objArr = [{
      doneOne: this.data.doneOn,
      aum_balance: this.data.aumBalanceDate,
      transaction: this.data.transactionDate,
      export_folios: '',
      totalfolios: this.data.totalFolioCount,
      before_recon: this.data.unmatchedCountBeforeRecon,
      after_recon: this.data.unmatchedCountAfterRecon
    }];

    console.log(objArr);
    this.dataSource.data = objArr;
  }

  // getDataFromObsAfterDeletingTransacn() {
  //   console.log('updoate ifanow units function called');
  //   this.isLoading = true;
  //   this.supportService.getDataThroughObs().subscribe(res => {
  //     console.log('this is something coming from obs:::::::::::', res);
  //     this.isLoading = false;
  //     if (res !== '') {
  //       // update units ifanow
  //       console.log('this is response that im getting::::', res);

  //       this.dataSource1.data.map(item => {
  //         item.unitsIfanow = String((res.units).toFixed(3));
  //         item.difference = String((parseInt(item.unitsIfanow) - parseInt(item.unitsRta)).toFixed(3));
  //       });
  //       this.getBackofficeAumReconListSummary(false);
  //       this.getDuplicateFolioList();
  //     }
  //   });
  // }

  getBackofficeAumReconListSummary(doStartRecon) {
    this.isLoading = true;
    this.dataSource.data = ELEMENT_DATA;
    this.dataSource1.data = ELEMENT_DATA1;
    const isParent = (this.isRmLogin) ? true : (this.parentId === this.advisorId) ? true : false;
    const data = {
      advisorIds: [...this.adminAdvisorIds],
      brokerId: this.brokerId,
      rt: this.data.rtId,
      parentId: (this.adminId && this.adminId == 0) ? this.advisorId : (this.parentId ? this.parentId : this.advisorId),
      isParent,
    };

    this.supportService.getAumReconListGetValues(data)
      .subscribe(res => {
        let objArr = [];
        console.log('this is summary values::::', res);
        if (res && res.aumList) {
          this.canExportExcelSheet = 'true';
          this.aumList = res.aumList;
          const arrayValue = [];

          this.filteredAumListWithIsMappedToMinusOne = this.aumList.filter(element => {
            return element.isMapped === -1;
          });

          const arrWithTransactionCheckedTrue = this.filteredAumListWithIsMappedToMinusOne.filter(item => {
            return item.transactionCheck === true;
          });

          console.log('see the difference::::::::', this.filteredAumListWithIsMappedToMinusOne, res.aumList, arrWithTransactionCheckedTrue);
          this.arrWithTransCheckTrueAndisMappedMinusOne = arrWithTransactionCheckedTrue;

          arrWithTransactionCheckedTrue.forEach(element => {
            // check  and compare date object and can delete value
            arrayValue.push({
              name: element.shemeName,
              folioNumber: element.folioNumber,
              unitsIfanow: element.calculatedUnits.toFixed(3),
              unitsRta: (element.aumUnits).toFixed(3),
              difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
              transaction: '',
              mutualFundId: element.mutualFundId,
              freezeDate: (element.hasOwnProperty('freezeDate') && element.freezeDate) ? element.freezeDate : null,
              investorName: element.investorName,
              isUnfreezeClicked: false,
              isFreezeClicked: false
            });
          });
          if (arrayValue.length !== 0) {
            this.dataSource1.data = arrayValue;

          } else {
            this.dataSource1.data = null;
          }
          const doneOnDate = new Date(res.doneOn);
          const doneOnFormatted = doneOnDate.getFullYear() + '-' +
            this.util.addZeroBeforeNumber((doneOnDate.getMonth() + 1), 2) + '-' +
            this.util.addZeroBeforeNumber(doneOnDate.getDate(), 2);
          // console.log("datas available till now:::::", this.data, res);
          const data = {
            advisorId: this.advisorId,
            brokerId: this.brokerId,
            totalFolioCount: res.totalFolioCount,
            matchedCount: res.mappedCount,
            aumBalanceDate: res.aumList[0].aumDate,
            unmatchedCountBeforeRecon: res.unmappedCount,
            transactionDate: res.transactionDate,
            rtId: this.data.rtId,
            doneOn: doneOnFormatted,
            // when rm login is creted this will get value from localStorage
            rmId: this.rmId
          };
          if (doStartRecon) {
            this.reconService.putBackofficeReconAdd(data)
              .subscribe(res => {
                console.log('started reconciliation::::::::::::', res);
                if (this.data.startRecon) {
                  this.aumReconId = res;
                }
              }, err => {
                console.error(err);
              });
          }

          // aum date for all object is the same
          objArr = [{
            doneOne: res.doneOn,
            aum_balance: res.aumList[0].aumDate,
            transaction: res.transactionDate,
            export_folios: '',
            totalfolios: res.totalFolioCount,
            before_recon: res.unmappedCount,
            after_recon: res.unmappedCount
          }];

          this.filteredAumListWithIsMappedToMinusOne.forEach(element => {
            this.mutualFundIds.push(element.mutualFundId);
          });
        } else {
          this.canExportExcelSheet = 'false';
          this.dataSource1.data = null;
          objArr = null;
        }
        this.dataSource.data = objArr;
        this.isLoading = false;
      });
  }

  getDuplicateFolioList() {
    let data;
    if (this.data.flag == 'report') {
      let mutualFundIds = [];
      this.reportDuplicateFoliosIsMappedToMinusOne = this.aumListReportValue.filter(item => {
        return item.isMapped === -1;
      });
      this.reportDuplicateFoliosIsMappedToMinusOne.forEach(element => {
        mutualFundIds.push(element.mutualFundId);
      });
      data = {
        advisorIds: [this.advisorId],
        folio: mutualFundIds
      };
    } else {
      let mutualFundIds = [];
      const isParent = this.isRmLogin ? true : ((this.parentId === this.advisorId) ? true : false);
      this.filteredAumListWithIsMappedToMinusOne = this.aumList.filter(item => {
        return item.isMapped === -1;
      });
      this.filteredAumListWithIsMappedToMinusOne.forEach(element => {
        mutualFundIds.push(element.mutualFundId);
      });
      data = {
        advisorIds: [...this.adminAdvisorIds],
        aum: {
          folio: mutualFundIds
        },
        parentId: this.parentId,
        isParent
      };
    }
    // if (this.didAumReportListGot) {
    this.isLoadingForDuplicate = true;
    this.dataSource2.data = ELEMENT_DATA2;
    console.log("this is what im sending for duplicate folio data", data);
    this.reconService.getDuplicateFolioDataValues(data)
      // this.reconService.getDuplicateDataValues(data)
      .subscribe(res => {
        this.isLoadingForDuplicate = false;
        if (res) {
          console.log('this is some duplicate values:::::::::', res, this.aumList);
          let filteredArrValue = [];
          const arrValue = [];
          if (this.data.flag === 'report') {
            res.forEach(element => {
              filteredArrValue = this.aumListReportValue.filter(item => {
                return item.mutualFundId === element.id ? item : null;
              });
            });
          } else {
            res.forEach(element => {
              filteredArrValue = this.aumList.filter(item => {
                return item.mutualFundId === element.id ? item : null;
              });
            });
          }


          console.log('htis is filered value::::', filteredArrValue);
          filteredArrValue.forEach(item => {
            arrValue.push({
              id: item.id,
              name: item.shemeName,
              folioNumber: item.folioNumber,
              mutualFundId: item.mutualFundId,
              advisorId: item.advisorId,
              brokerId: item.broker_id,
              unitsRta: (item.aumUnits).toFixed(3),
              unitsIfanow: (item.calculatedUnits).toFixed(3),
              difference: (item.calculatedUnits - item.aumUnits).toFixed(3),
              freezeDate: item.freezeDate ? item.freezeDate : null,
              isMapped: item.isMapped,
              aumDate: item.aumDate,
              brokerCode: item.brokerCode,
              schemeCode: item.schemeCode,
              mutualFundTransaction: item.mutualFundTransaction,
              transactions: '',
              isUnfreezeClicked: false,
              isFreezeClicked: false
            });
          });
          this.dataSource2.data = arrValue;
        } else {
          this.dataSource2.data = null;
        }

      }, err => {
        console.error(err);
        this.eventService.openSnackBar(err, "DISMISS");
        this.isLoadingForDuplicate = false;
      });
    // } else {
    //   this.eventService.openSnackBar('No Aum Report List Found', 'Dismiss');
    //   this.dataSource2.data = null;
    // }
  }

  retryFileOrder() {
    const data = {
      id: this.aumReconId,
      rtId: this.data.rtId
    };
    this.reconService.putFileOrderRetry(data)
      .subscribe(res => {
        console.log('retried values:::::::', res);

        if (res === 1) {
          this.getBackofficeAumFileOrderListDeleteReorder();
        }
      }, err => {
        console.error(err);
      });
  }

  deleteAndReorder() {
    const isParent = this.isRmLogin ? true : ((this.parentId === this.advisorId) ? true : false);
    let mutualFundIds = [];
    this.filteredAumListWithIsMappedToMinusOne.forEach(element => {
      if (Math.abs(element.calculatedUnits - element.aumUnits) !== 0) {
        mutualFundIds.push(element.mutualFundId);
      }
    });

    if (mutualFundIds && mutualFundIds.length !== 0) {
      const data = {
        id: this.aumReconId,
        brokerId: this.brokerId,
        advisorIds: [this.advisorId],
        rtId: this.data.rtId,
        mutualFundIds,
        parentId: this.parentId,
        isParent
      };
      console.log('this is requestjson for delete and reorder:::: ', data);
      this.reconService.deleteAndReorder(data)
        .subscribe(res => {
          console.log(res);
          this.getBackofficeAumFileOrderListDeleteReorder();
        }, err => {
          console.error(err);
        });

    } else {
      this.eventService.openSnackBar("No Mutual Fund ids found to delete", "DISMISS");
    }
  }

  getBackofficeAumFileOrderListDeleteReorder() {
    this.isLoading = true;
    this.dataSource3.data = ELEMENT_DATA3;
    this.supportService.getBackofficeAumOrderListValues({ aumReconId: this.aumReconId })
      .subscribe(res => {
        this.isLoading = false;
        console.log(res);
        if (res) {
          res.map(element => {
            if (element && element.folios !== '') {
              const obj = {
                count: element.folios.split(',').length,
                file: new Blob([element.folios.split(',').join('\n')], { type: 'text/plain' })
              };
              element.folios = obj;
            }
            return element;
          });

          res.map(item => {
            if (!item.hasOwnProperty('fileOrderDateTime')) {
              item.fileOrderDateTime = '-';
            }
            if (!item.hasOwnProperty('referenceId')) {
              item.referenceId = '-';
            }
            if (!item.hasOwnProperty('transactionAddedInFiles')) {
              item.transactionAddedInFiles = '-';
            }
            if (!item.hasOwnProperty('transactionAdded')) {
              item.transactionAdded = '-';
            }
            if (!item.hasOwnProperty('fileName')) {
              item.fileName = '-';
            }
            item.fileUrl && item.fileUrl !== '' ? item.fileUrl : null;
          });

          console.log('deleted reorder values::::', res);
          this.dataSource3.data = res;
        } else {
          this.dataSource3.data = null;
          this.eventService.openSnackBar('No Data Found!', 'DISMISS');
        }
      });
  }

  saveFile(blob) {
    const userData = AuthService.getUserInfo();
    let username;
    if (this.data.hasOwnProperty('clientName')) {
      username = this.data.clientName;
    } else {
      username = userData.name ? userData.name : userData.fullName;
    }
    saveAs(blob, username + '-' + 'ordered-folios' + '.txt');
  }

  exportToExcelSheet(value, element) {
    this.isTabDisabled = false;
    this.isFranklinTab = this.getRtName(this.data.rtId) === 'FRANKLIN_TEMPLETON' ? true : false;


    // creation of excel sheet
    const headerData = [
      { width: 40, key: 'Investor Name' },
      { width: 15, key: 'Asset Id' },
      { width: 50, key: 'Scheme Name' },
      { width: 15, key: 'Scheme Code' },
      { width: 20, key: 'Folio Number' },
      { width: 15, key: 'RTA Type' },
      { width: 15, key: 'IFANOW Units' },
      { width: 15, key: 'RTA Units' },
      { width: 15, key: 'RTA Bal as on' },
      { width: 15, key: 'Unit Difference' },
      { width: 20, key: 'Amount Difference' }
    ];
    const excelData = [];
    const footer = [];
    const header = [
      'Investor Name',
      'Asset Id',
      'Scheme Name',
      'Scheme Code',
      'Folio Number',
      'RTA Type',
      'IFANOW Units',
      'RTA Units',
      'RTA Bal as on',
      'Unit Difference',
      'Amount Difference'
    ];
    if (this.filteredAumListWithIsMappedToMinusOne.length !== 0) {
      const rtName = this.getRtName(this.data.rtId);
      this.filteredAumListWithIsMappedToMinusOne.forEach(element => {
        const data = [
          element.investorName ? element.investorName : '-',
          element.mutualFundId ? element.mutualFundId : '-',
          element.shemeName ? element.shemeName : '-',
          element.schemeCode ? element.schemeCode : '-',
          element.folioNumber ? element.folioNumber : '-',
          rtName,
          element.calculatedUnits ? element.calculatedUnits : '0',
          element.aumUnits ? element.aumUnits : '0',
          element.aumDate ? this.datePipe.transform(element.aumDate) : '-',
          element.calculatedUnits && element.aumUnits ? element.calculatedUnits - element.aumUnits : '0',
          ((element.calculatedUnits * element.nav) - (element.aumUnits * element.nav)).toFixed(3)
        ];

        excelData.push(Object.assign(data));
      });
      ExcelService.exportExcel(headerData, header, excelData, footer, value, this.data.clientName);
    } else {
      if (this.didAumReportListGot && this.aumListReportValue.length !== 0) {
        const rtName = this.getRtName(this.data.rtId);
        this.aumListReportValue.forEach(element => {
          const data = [
            element.investorName ? element.investorName : '-',
            element.mutualFundId ? element.mutualFundId : '-',
            element.shemeName ? element.shemeName : '-',
            element.schemeCode ? element.schemeCode : '-',
            element.folioNumber ? element.folioNumber : '-',
            rtName,
            element.calculatedUnits ? element.calculatedUnits : '0',
            element.aumUnits ? element.aumUnits : '0',
            element.aumDate ? this.datePipe.transform(element.aumDate) : '-',
            element.calculatedUnits && element.aumUnits ? element.calculatedUnits - element.aumUnits : '0',
            ((element.calculatedUnits * element.nav) - (element.aumUnits * element.nav)).toFixed(3)
          ];
          excelData.push(Object.assign(data));
        });
        ExcelService.exportExcel(headerData, header, excelData, footer, value, this.data.clientName);
      } else {
        this.eventService.openSnackBar('No Aum Report List Found', 'Dismiss');
      }
    }

  }

  openReconciliationDetails(flag, data, tableType, index, freezeDate) {
    this.markFolioIndex = index;
    let tableData = [];
    if (tableType === 'all-folios') {
      if (this.data.flag === 'report') {
        if (this.aumListReportValue[index].mutualFundTransaction) {
          tableData = this.aumListReportValue[index].mutualFundTransaction;
        }
      } else {
        tableData = this.arrWithTransCheckTrueAndisMappedMinusOne[index].mutualFundTransaction;
      }
    }
    if (tableType === 'duplicate-folios') {
      if (this.data.flag === 'report') {
        tableData = this.aumListReportValue;
      } else {
        tableData = data.mutualFundTransaction;
      }
    }
    const fragmentData = {
      flag,
      data: {
        ...data,
        tableType,
        tableData,
        brokerId: this.brokerId,
        rtId: this.rtId,
        freezeDate,
        arnRiaCode: this.arnRiaCode + " " + this.upperHeaderName,
        fromAllFolioOrDuplicateTab: this.subTabState
      },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };

    if (tableData && tableData.length !== 0) {
      const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          console.log('this is sidebardata in subs subs : ', sideBarData);
          if (UtilService.isDialogClose(sideBarData)) {
            if (UtilService.isRefreshRequired(sideBarData)) {
              console.log('this is sidebardata in subs subs 3 ani: is refresh Required??? ', sideBarData);

              if (sideBarData.refreshRequired) {
                if (sideBarData.fromAllFolioOrDuplicateTab === 1) {
                  this.handlingDataVariable(false);
                } else if (sideBarData.fromAllFolioOrDuplicateTab === 2) {
                  this.getDuplicateFolioList();
                }
              } else {
                if (sideBarData.deletedTransactionsIndexes.length !== 0) {
                  if (sideBarData.fromAllFolioOrDuplicateTab === 1) {
                    let mfTransArr = this.dataSource1.data[this.markFolioIndex]['mutualFundTransaction'];
                    sideBarData.deletedTransactionsIndexes.forEach(element => {
                      mfTransArr.splice(element, 1);
                    });

                  } else if (sideBarData.fromAllFolioOrDuplicateTab === 2) {
                    let mfTransArr = this.dataSource2.data[this.markFolioIndex]['mutualFundTransaction'];
                    sideBarData.deletedTransactionsIndexes.forEach(element => {
                      mfTransArr.splice(element, 1);
                    });
                  }
                }
              }
            }
            if (sideBarData.fromAllFolioOrDuplicateTab === 1) {
              this.dataSource1.data[this.markFolioIndex]['isUnfreezeClicked'] = sideBarData.isUnfreezeClicked;
              this.dataSource1.data[this.markFolioIndex]['isFreezeClicked'] = sideBarData.isFreezeClicked;

              if (sideBarData.isUnfreezeClicked) {
                this.dataSource1.data[this.markFolioIndex]['mutualFundTransaction'].forEach(element => {
                  element.canDeleteTransaction = true;
                });
              }
              if (sideBarData.isFreezeClicked) {
                this.dataSource1.data[this.markFolioIndex]['mutualFundTransaction'].forEach(element => {
                  element.canDeleteTransaction = false;
                });
              }
            }
            if (sideBarData.fromAllFolioOrDuplicateTab === 2) {
              this.dataSource2.data[this.markFolioIndex]['isUnfreezeClicked'] = sideBarData.isUnfreezeClicked;
              this.dataSource2.data[this.markFolioIndex]['isFreezeClicked'] = sideBarData.isFreezeClicked;

              if (sideBarData.isUnfreezeClicked) {
                this.dataSource2.data[this.markFolioIndex]['mutualFundTransaction'].forEach(element => {
                  element.canDeleteTransaction = true;
                });
              }
              if (sideBarData.isFreezeClicked) {
                this.dataSource2.data[this.markFolioIndex]['mutualFundTransaction'].forEach(element => {
                  element.canDeleteTransaction = false;
                });
              }
            }
            rightSideDataSub.unsubscribe();
          }
        }
      );

    } else {
      this.eventService.openSnackBar("This Folio doesn't have Mutual fund Transaction!", "DISMISS");
    }
  }

  openDeleteDialog() {
    if (this.deleteReorderOrDeleteDisabled !== 'delete') {

      const dialogData = {
        header: 'DELETE UNMATCHED FOLIOS?',
        body: 'Are you sure you want to delete the unmatched folios?',
        body2: '',
        btnYes: 'CANCEL',
        btnNo: 'YES',
        positiveMethod: () => {
          console.log('successfully deleted');
          // this.deleteAndReorder();
          this.deleteUnfreezeTransaction();
          dialogRef.close();
        },
        negativeMethod: () => {
          console.log('aborted');
        }

      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {

      });

    } else {
      this.eventService.openSnackBar('You can only delete Unmatched folios or Delete and reorder folios', 'DISMISS');
    }
    this.deleteReorderOrDeleteDisabled = 'deleteReorder';
  }

  deleteUnfreezeTransaction() {
    const isParent = this.isRmLogin ? true : ((this.parentId === this.advisorId) ? true : false);
    const data = {
      id: this.data.id,
      advisorIds: [this.advisorId],
      parentId: this.parentId,
      isParent,
      brokerId: this.brokerId,
      rtId: this.rtId,
      mutualFundIds: this.mutualFundIds
    };

    this.reconService.deleteUnfreezeTransaction(data)
      .subscribe(res => {
        console.log('this is delete unfreeze transaction:::', res);
      }, err => {
        console.error(err);
      });

  }

  getAumReportList() {
    const data = {
      aumReconId: this.data.id
    };
    this.isLoading = true;
    this.canExportExcelSheet = 'intermediate';
    this.reconService.getAumReportListValues(data)
      .subscribe(res => {
        this.isLoading = false;
        console.log('this is aum report list get:::', res);
        if (res) {
          this.didAumReportListGot = true;
          this.canExportExcelSheet = 'true';
          const arrayValue = [];
          this.aumListReportValue = res;
          const reportListWithIsMapMinusOneAndTransacCheckTrue = this.aumListReportValue.filter(item => {
            return item.isMapped === -1 && item.transactionCheck === true;
          });
          console.log('this is aum report ismap -1 and transac check true::', reportListWithIsMapMinusOneAndTransacCheckTrue);
          reportListWithIsMapMinusOneAndTransacCheckTrue.forEach(element => {
            arrayValue.push({
              name: element.shemeName,
              folioNumber: element.folioNumber,
              unitsIfanow: element.calculatedUnits.toFixed(3),
              unitsRta: (element.aumUnits).toFixed(3),
              difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
              transaction: '',
              mutualFundId: element.mutualFundId,
              freezeDate: (element.hasOwnProperty('freezeDate') && element.freezeDate) ? element.freeeDate : null,
              investorName: element.investorName,
              isUnfreezeClicked: false,
              isFreezeClicked: false
            });
          });
          this.dataSource1.data = arrayValue;
        } else {
          this.canExportExcelSheet = 'false';
          this.didAumReportListGot = false;
          this.dataSource1.data = null;
        }
      }, err => {
        console.error(err);
      });
  }

  postReqForBackOfficeUnmatchedFolios() {
    const data = [];
    if (this.aumList) {
      this.aumList.forEach(element => {
        data.push({
          advisorId: this.advisorId,
          aumReconId: this.aumReconId,
          mutualFundId: element.mutualFundId,
          aumUnits: element.aumUnits,
          mutualFundUnits: element.calculatedUnits,
          aumDate: this.datePipe.transform(element.aumDate, 'yyyy-MM-dd'),
        });
      });

      console.log('this is what we are sending to post req::', data);

      // need to discuss with ajay
      this.reconService.postBackOfficeUnmatchedFoliosData(data)
        .subscribe(res => {
          console.log(' backoffice unmateched Folio, post ', res);
        }, err => {
          console.error(err);
        });
    }

  }

  dialogClose() {
    console.log('this is clicked');
    // post call
    this.postReqForBackOfficeUnmatchedFolios();

    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

  setSubTabState(state) {
    this.subTabState = state;
    if (this.subTabState === 2) {
      this.getDuplicateFolioList();
    }
  }

  openDeleteAndReorderDialog() {
    if (this.deleteReorderOrDeleteDisabled !== 'deleteReorder') {

      if (!this.isFranklinTab) {
        const dialogData = {
          header: 'DELETE & REORDER?',
          body: 'Are you sure you want to delete and reorder the unmatched folios?',
          body2: '',
          btnYes: 'CANCEL',
          btnNo: 'YES',
          positiveMethod: () => {
            console.log('successfully deleted');
            this.deleteAndReorder();
            dialogRef.close();
          },
          negativeMethod: () => {
            console.log('aborted');
          }

        };
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          data: dialogData,
          autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
    } else {
      this.eventService.openSnackBar('You can only Delete unmatched Folios Or Delete and reorder folios', 'DISMISS');
    }
    this.deleteReorderOrDeleteDisabled = 'delete';
  }

}

interface PeriodicElement {
  doneOne: string;
  totalfolios: string;
  before_recon: string;
  after_recon: string;
  aum_balance: string;
  transaction: string;
  export_folios: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { doneOne: '', totalfolios: '', before_recon: '', after_recon: '', aum_balance: '', transaction: '', export_folios: '' },
  { doneOne: '', totalfolios: '', before_recon: '', after_recon: '', aum_balance: '', transaction: '', export_folios: '' },
  { doneOne: '', totalfolios: '', before_recon: '', after_recon: '', aum_balance: '', transaction: '', export_folios: '' },
];


interface PeriodicElement1 {
  name: string;
  folioNumber: string;
  unitsIfanow: string;
  unitsRta: string;
  difference: string;
  transactions: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
];

const ELEMENT_DATA2: PeriodicElement1[] = [
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
];

interface PeriodicElement3 {
  folios: string;
  fileOrderDateTime: string;
  status: string;
  referenceId: string;
  transactionAddedInFiles: string;
  transactionAdded: string;
  fileName: string;
  fileUrl: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {
    folios: '',
    fileOrderDateTime: '',
    status: '',
    referenceId: '',
    transactionAddedInFiles: '',
    transactionAdded: '',
    fileName: '',
    fileUrl: ''
  },
  {
    folios: '',
    fileOrderDateTime: '',
    status: '',
    referenceId: '',
    transactionAddedInFiles: '',
    transactionAdded: '',
    fileName: '',
    fileUrl: ''
  },
  {
    folios: '',
    fileOrderDateTime: '',
    status: '',
    referenceId: '',
    transactionAddedInFiles: '',
    transactionAdded: '',
    fileName: '',
    fileUrl: ''
  },
];
