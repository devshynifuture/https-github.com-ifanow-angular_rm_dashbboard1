import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MfServiceService } from '../../mf-service.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { RightFilterDuplicateComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter-duplicate/right-filter-duplicate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { DatePipe } from '@angular/common';

// import { MutualFundAllTransactionComponent } from '../mutual-fund-all-transaction/mutual-fund-all-transaction.component';

@Component({
    selector: 'app-mf-capital-detailed',
    templateUrl: './mf-capital-detailed.component.html',
    styleUrls: ['./mf-capital-detailed.component.scss']
})
export class MfCapitalDetailedComponent implements OnInit {
    details;
    reportDate;
    displayedColumns: string[] = ['dateRedeem', 'trnRedeem', 'amtRedeem', 'sttRedeem', 'unitsRedeem', 'rateRedeem', 'datePurchase', 'amtPurchase', 'unitsPurchase', 'ratePurchase', 'stGainPurchase', 'stLossPurchase', 'ltGainPurchase', 'ltLossPurchase', 'indGainPurchase', 'indLossPurchase', 'daysPurchase'];
    displayedColumnsTotal: string[] = ['dateRedeemTotal', 'trnRedeemTotal', 'amtRedeemTotal', 'sttRedeemTotal', 'unitsRedeemTotal', 'rateRedeemTotal', 'datePurchaseTotal', 'amtPurchaseTotal', 'unitsPurchaseTotal', 'ratePurchaseTotal', 'stGainPurchaseTotal', 'stLossPurchaseTotal', 'ltGainPurchaseTotal', 'ltLossPurchaseTotal', 'indGainPurchaseTotal', 'indLossPurchaseTotal', 'daysPurchaseTotal'];
    displayedColumns1: string[] = ['schemeName1', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
    displayedColumns2: string[] = ['schemeName2', 'folioNumber', 'dividendPayoutAmount', 'dividendReInvestmentAmount', 'totalReinvestmentAmount'];
    displayedColumns4: string[] = ['dateRedeem', 'trnRedeem', 'amtRedeem', 'sttRedeem', 'unitsRedeem', 'rateRedeem', 'datePurchase', 'amtPurchase', 'unitsPurchase', 'ratePurchase', 'stGainPurchase', 'stLossPurchase', 'ltGainPurchase', 'ltLossPurchase', 'indGainPurchase', 'indLossPurchase', 'daysPurchase'];
    dataSource = new MatTableDataSource([{}, {}, {}]);
    dataSource1 = new MatTableDataSource([{}, {}, {}]);
    dataSource2 = new MatTableDataSource([{}, {}, {}]);
    dataSource4;
    isLoading = true;
    total_stGain = 0;
    total_ltGain = 0;
    total_stLoss = 0;
    total_indexGain = 0;
    total_ltLoss = 0;
    total_indexLoss = 0;
    purchaseAmount = 0;
    redeemAmount = 0;
    total_stt = 0;
    totalReinvesment = 0;
    totaldividendPayout = 0;
    totaldividendReinvestment = 0;
    mfList: any;
    equityObj: any;
    debtObj: any;
    rightFilterData: any;
    fromDateYear: number = 0;
    toDateYear: number;
    grandFatheringEffect = false;
    redemption: any[];
    objSendToDetailedCapital: any;
    mutualFundList: any[];
    fromDate: Date;
    toDate: Date;
    categoryWiseTotal = {};
    GTdividendPayout = 0;
    GTReinvesment = 0;
    GTdividendReinvestment = 0;
    fragmentData = { isSpinner: false };
    showDownload: boolean;
    setCapitaDetails: any;
    clientId: any;
    advisorId: any;
    clientDetails: any;
    clientData: any;
    userInfo: any;
    getOrgData: any;
    familyMemberId: number;
    familyList = [];
    mfBulkEmailRequestId: number;
    criteriaDate: Date;
    adminAdvisorIds: any;
    parentId: any;
    loadingDone: boolean = false;
    isShow = true;
    constructor(private MfServiceService: MfServiceService,
        public routerActive: ActivatedRoute,
        private backOfficeService: BackOfficeService,
        private datePipe: DatePipe,
        private route: Router,
        private subInjectService: SubscriptionInject, private UtilService: UtilService, private custumService: CustomerService, private cd: ChangeDetectorRef) {

        this.routerActive.queryParamMap.subscribe((queryParamMap) => {
            if (queryParamMap.has('clientId')) {
                let param1 = queryParamMap['params'];
                this.clientId = parseInt(param1.clientId)
                this.advisorId = parseInt(param1.advisorId)
                this.parentId = parseInt(param1.parentId);
                this.familyMemberId = parseInt(param1.familyMemberId)

                this.fromDateYear = param1.from,
                    this.toDateYear = param1.to,
                    console.log('2423425', param1)
                this.familyList = []
                const obj = {
                    id: this.familyMemberId
                }
                this.familyList.push(obj)
            }
            else {
                this.advisorId = AuthService.getAdvisorId();
                this.parentId = AuthService.getParentId();
                this.userInfo = AuthService.getUserInfo();
                this.clientData = AuthService.getClientData();
                this.getOrgData = AuthService.getOrgDetails();
                this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
            }
        });
    }
    @Output() reponseToInput = new EventEmitter();
    @Output() changeInput = new EventEmitter();
    @Input() responseData;
    @Input() changedData;
    @Input() mutualFund;
    @ViewChild('mfCapitalTemplateDetailed', { static: false }) mfCapitalTemplateDetailed: ElementRef;
    @ViewChild('mfCapitalTemplateHeader', { static: false }) mfCapitalTemplateHeader;
    @Output() loaded = new EventEmitter();
    @Input() finPlanObj: any;//finacial plan pdf input
    uploadData(data) {
        if (data.clientId) {
            this.clientId = data.clientId
            // this.ngOnInit()
            this.fromDateYear = data.from;
            this.fromDate = new Date(this.fromDateYear, 3, 1);
            this.toDateYear = data.to;
            this.toDate = new Date(this.toDateYear, 2, 31);
            this.grandFatheringEffect = true;
            // this.getAdvisorData();
            if (this.adminAdvisorIds.length > 0) {
                this.getCapitalgain();
            } else {
                this.teamMemberListGet();
            }
        }
        return this.setCapitaDetails

    }
    ngOnInit() {
        this.isShow = true;
        this.MfServiceService.getadvisorList()
            .subscribe(res => {
                this.adminAdvisorIds = res;
            });
        if (localStorage.getItem('token') != 'authTokenInLoginComponnennt') {
            localStorage.setItem('token', 'authTokenInLoginComponnennt')
        }

        this.routerActive.queryParamMap.subscribe((queryParamMap) => {
            if (queryParamMap.has('clientId')) {
                let param1 = queryParamMap['params'];
                this.clientId = parseInt(param1.clientId)
                this.advisorId = parseInt(param1.advisorId)
                this.mfBulkEmailRequestId = parseInt(param1.mfBulkEmailRequestId);
                this.fromDateYear = param1.from,
                    this.toDateYear = param1.to,
                    this.fromDate = new Date(this.fromDateYear, 3, 1);
                this.toDate = new Date(this.toDateYear, 2, 31);
                this.grandFatheringEffect = true;
                if (this.adminAdvisorIds.length > 0) {
                    this.getCapitalgain();
                } else {
                    this.teamMemberListGet();
                }
                console.log('2423425', param1)
                this.getDetails()
            }
        });
        this.setCapitaDetails = {}
        this.setCapitaDetails.dataSource = []
        this.setCapitaDetails.dataSource1 = []
        this.setCapitaDetails.dataSource2 = []
        this.setCapitaDetails.equityObj = {}
        this.setCapitaDetails.debtObj = {}
        this.setCapitaDetails.GTdividendReinvestment = {}
        this.setCapitaDetails.GTdividendPayout = {}
        this.setCapitaDetails.GTReinvesment = {}
        this.isLoading = true;
        if (this.finPlanObj) {
            this.fromDateYear = 2019;
            this.fromDate = new Date(this.fromDateYear, 3, 1);
            this.toDateYear = 2020;
            this.toDate = new Date(this.toDateYear, 2, 31);
            this.grandFatheringEffect = true;
            this.teamMemberListGet();

        }
        console.log('response data:', this.responseData); // You will get the @Input value
        if (this.responseData || this.mutualFundList) {
            this.mutualFundList = this.MfServiceService.filter(this.responseData, 'mutualFund');
            this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
        }

        if (this.changedData) {
            this.fromDateYear = this.changedData.fromDateYear;
            this.fromDate = new Date(this.fromDateYear, 3, 1);
            this.toDateYear = this.changedData.toDateYear;
            this.toDate = new Date(this.toDateYear, 2, 31);
            this.grandFatheringEffect = (this.changedData.grandfatheringEffect == 1) ? this.grandFatheringEffect = true : this.grandFatheringEffect = false;;
            this.rightFilterData = this.changedData.filterDataForCapital
            this.getDetailedData(this.changedData.mfListData);

        }
        // this.mfList = this.responseData.mfData;


    }
    teamMemberListGet() {
        this.adminAdvisorIds = [];
        this.custumService.getSubAdvisorListValues({ advisorId: this.advisorId })
            .subscribe(data => {
                if (data && data.length !== 0) {
                    console.log('team members: ', data);
                    data.forEach(element => {
                        this.adminAdvisorIds.push(element);
                    });
                    const isIncludeID = this.adminAdvisorIds.includes(this.advisorId);
                    if (!isIncludeID) {
                        this.adminAdvisorIds.unshift(this.advisorId);
                    }
                    console.log(this.adminAdvisorIds);
                } else {
                    this.adminAdvisorIds = [this.advisorId];
                }
                this.getCapitalgain();
                this.MfServiceService.setadvisorList(this.adminAdvisorIds);
            }, err => {
                this.adminAdvisorIds = [this.advisorId];
                this.MfServiceService.setadvisorList(this.adminAdvisorIds);
                this.getCapitalgain();
            });
    }
    getCapitalgain() {
        this.isLoading = true;
        this.changeInput.emit(true);
        const obj = {
            parentId: this.parentId ? this.parentId : this.advisorId,
            advisorIds: this.advisorId,
            clientId: this.clientId,

        };
        this.custumService.capitalGainGet(obj).subscribe(
            data => {
                if (data) {
                    this.getDetailedData(data);

                } else {
                    this.dataSource.data = [];
                    this.dataSource1.data = [];
                    this.dataSource2.data = [];
                }

            }, (error) => {
                this.dataSource.data = [];
                this.dataSource1.data = [];
                this.dataSource2.data = [];
                this.changeInput.emit(false);
            }
        );
    }
    getDetailedData(data) {
        let equityData = [];
        this.total_stGain = 0;
        this.total_ltGain = 0;
        this.total_stLoss = 0;
        this.total_ltLoss = 0;
        this.total_indexGain = 0;
        this.total_indexLoss = 0;
        this.purchaseAmount = 0;
        this.redeemAmount = 0;
        this.total_stt = 0;
        this.changeInput.emit(false);
        if (data) {
            const myArray = data
            const list = [];
            myArray.forEach(val => list.push(Object.assign({}, val)));
            let catObj = this.MfServiceService.categoryFilter(list, 'category');
            this.categorisedHybridFund(catObj);//move hybird to debt and equty based on category
            this.categoriesLiquidFund(catObj);//move the liquid schemes to debt catgory
            this.categoriesCommodityFund(catObj);//move the commodity schemes to debt catgory
            this.categoriesOtherFund(catObj);//move the other schemes to debt catgory
            Object.keys(catObj).map(key => {
                if (catObj[key][0].category != 'DEBT') {
                    // this.dataSource = new MatTableDataSource(this.getFilterData(catObj[key], 'EQUITY'));
                    let tempData = this.getFilterData(catObj[key], 'EQUITY');
                    equityData.push(...tempData)
                    // equityData = this.getFilterData(catObj[key], key);
                }
            });
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(equityData);
            this.dataSource1 = new MatTableDataSource(this.getFilterData(catObj['DEBT'], 'DEBT'))
            this.dataSource2 = new MatTableDataSource(this.getDividendSummaryData(data));
            console.log('dataSource', this.dataSource);
            console.log('dataSource1', this.dataSource1);
            console.log('dataSource2', this.dataSource2);
            this.cd.markForCheck();
            this.cd.detectChanges();
            this.loaded.emit(this.mfCapitalTemplateDetailed.nativeElement);
            this.setCapitaDetails = {}
            this.setCapitaDetails.dataSource = this.dataSource
            this.setCapitaDetails.dataSource1 = this.dataSource1
            this.setCapitaDetails.dataSource2 = this.dataSource2
            this.setCapitaDetails.equityObj = this.equityObj
            this.setCapitaDetails.debtObj = this.debtObj
            this.setCapitaDetails.GTdividendReinvestment = this.GTdividendReinvestment
            this.setCapitaDetails.GTdividendPayout = this.GTdividendPayout
            this.setCapitaDetails.GTReinvesment = this.GTReinvesment
            this.setCapitaDetails.total_stGain = this.total_stGain;
            this.setCapitaDetails.total_ltGain = this.total_ltGain;
            this.setCapitaDetails.total_stLoss = this.total_stLoss;
            this.setCapitaDetails.total_ltLoss = this.total_ltLoss;
            this.setCapitaDetails.total_indexGain = this.total_indexGain;
            this.setCapitaDetails.total_indexLoss = this.total_indexLoss;
            this.setCapitaDetails.purchaseAmount = this.purchaseAmount;
            this.setCapitaDetails.redeemAmount = this.redeemAmount;
            this.setCapitaDetails.total_stt = this.total_stt;
            this.MfServiceService.setCapitalDetailed(this.setCapitaDetails)
            if (this.route.url.split('?')[0] == '/pdf/capitalGainDetailed') {
                this.generatePdfBulk()
            }

            this.objSendToDetailedCapital = {
                // mfData:this.mutualFund,
                responseData: this.responseData,
                grandFatheringEffect: this.grandFatheringEffect,
                redemptionList: this.redemption,
                mutualFundList: this.mutualFundList,
                fromDateYear: this.fromDateYear,
                toDateYear: this.toDateYear,
            }
        }
    }
    categoriesCommodityFund(data) {
        let debtFund = [];
        Object.keys(data).map(key => {
            if (data[key][0].category == 'COMMODITY') {
                data[key][0].mutualFund.forEach(element => {
                    if (element.subCategoryName == 'FoFs (Domestic / Overseas ) - Gold') {
                        debtFund.push(element);
                    }
                });
            }
        });
        if (debtFund.length > 0) {
            if (data['DEBT']) {
                data['DEBT'][0].mutualFund = [...data['DEBT'][0].mutualFund, ...debtFund];
            } else {
                if (!data['DEBT']) {
                    data.DEBT = [];
                    data.DEBT = data['COMMODITY'];
                    // data.DEBT[0].mutualFund = debtFund
                }
            }
        }
        if (debtFund.length > 0) {
            delete data['COMMODITY'];
        }
        return data;
    }
    categoriesOtherFund(data) {
        let debtFund = [];
        Object.keys(data).map(key => {
            if (data[key][0].category == 'OTHER') {
                data[key][0].mutualFund.forEach(element => {
                    if (element.subCategoryName == 'FoFs (Overseas)' || element.subCategoryName == 'FoFs (Overseas)') {
                        debtFund.push(element);
                    }
                });
            }
        });
        if (debtFund.length > 0) {
            if (data['DEBT']) {
                data['DEBT'][0].mutualFund = [...data['DEBT'][0].mutualFund, ...debtFund];
            } else {
                if (!data['DEBT']) {
                    data.DEBT = [];
                    data.DEBT = data['OTHER'];
                    // data.DEBT[0].mutualFund = debtFund
                }
            }
        }
        if (debtFund.length > 0) {
            delete data['OTHER'];
        }
        return data;
    }
    categoriesLiquidFund(data) {
        let debtFund = [];
        Object.keys(data).map(key => {
            if (data[key][0].category == 'LIQUID') {
                data[key][0].mutualFund.forEach(element => {
                    debtFund.push(element);
                });
            }
        });
        if (debtFund.length > 0) {
            if (data['DEBT']) {
                data['DEBT'][0].mutualFund = [...data['DEBT'][0].mutualFund, ...debtFund];
            } else {
                if (!data['DEBT']) {
                    data.DEBT = [];
                    data.DEBT = data['LIQUID'];
                    // data.DEBT[0].mutualFund = debtFund
                }
            }
        }
        delete data['LIQUID'];
        return data;
    }
    categorisedHybridFund(data) {
        let equityFund = [];
        let debtFund = [];
        Object.keys(data).map(key => {
            if (data[key][0].category == 'HYBRID') {
                data[key][0].mutualFund.forEach(element => {
                    if (element.subCategoryName == 'Hybrid - Balanced Advantage' || element.subCategoryName == 'Hybrid - Aggressive' || element.subCategoryName == 'Hybrid - Aggressive (CE)' || element.subCategoryName == 'Hybrid - Equity Savings'
                        || element.subCategoryName == 'Hybrid - Dyn Asset Allo or Bal Adv' || element.subCategoryName == 'Hybrid - Arbitrage' || element.subCategoryName == 'Hybrid - Balanced') {
                        equityFund.push(element);
                    } else if (element.subCategoryName == 'Hybrid - Conservative Hybrid Fund' || element.subCategoryName == 'Hybrid - Conservative' || element.subCategoryName == 'Hybrid - Conservative (CE)' || element.subCategoryName == 'Hybrid - Multi Asset Allocation') {
                        debtFund.push(element);
                    } else {
                        equityFund.push(element);
                    }
                });
            }
        });
        if (debtFund.length > 0) {
            if (data['DEBT']) {
                data['DEBT'][0].mutualFund = [...data['DEBT'][0].mutualFund, ...debtFund];
            } else {
                if (!data['DEBT']) {
                    data.DEBT = [];
                    data.DEBT = data['HYBRID'];
                    // data.DEBT[0].mutualFund = debtFund
                }
            }
        }
        if (equityFund.length > 0) {
            if (data['EQUITY']) {
                data['EQUITY'][0].mutualFund = [...data['EQUITY'][0].mutualFund, ...equityFund]
            } else {
                // data.EQUITY[0].mutualFund = equityFund
                if (!data.EQUITY) {
                    data.EQUITY = [];
                    data.EQUITY = data['HYBRID'];
                }

            }
        }
        delete data['HYBRID'];
        return data;
    }
    openFilter() {
        const fragmentData = {
            flag: 'openFilter',
            data: {},
            id: 1,
            state: 'open35',
            componentName: RightFilterDuplicateComponent
        };
        fragmentData.data = {
            name: 'CAPITAL GAIN REPORT',
            mfData: this.mutualFund,
            folioWise: this.mutualFund.mutualFundList,
            schemeWise: this.mutualFund.schemeWise,
            familyMember: this.mutualFund.family_member_list,
            category: this.mutualFund.mutualFundCategoryMastersList,
            transactionView: this.displayedColumns,
            capitalGainData: this.objSendToDetailedCapital,
            filterDataForCapital: (this.rightFilterData) ? this.rightFilterData : (this.changedData) ? this.changedData.filterDataForCapital : null
        };
        const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
            sideBarData => {
                console.log('this is sidebardata in subs subs : ', sideBarData);
                if (UtilService.isDialogClose(sideBarData)) {
                    console.log('this is sidebardata in subs subs 2: ', sideBarData);
                    if (sideBarData.data && sideBarData.data != 'Close') {
                        this.rightFilterData = sideBarData.data;
                        this.dataSource = new MatTableDataSource([{}, {}, {}]);
                        this.dataSource1 = new MatTableDataSource([{}, {}, {}]);
                        this.dataSource2 = new MatTableDataSource([{}, {}, {}]);
                        this.isLoading = true;
                        const obj = {
                            data: this.rightFilterData.capitalGainData.responseData,
                            summaryView: (this.rightFilterData.reportFormat[0].name == 'Detailed') ? false : true,
                            grandfatheringEffect: (this.rightFilterData.grandfathering == 1) ? true : false,
                            fromDateYear: (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].from : 2019,
                            toDateYear: (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020,
                            filterDataForCapital: this.rightFilterData
                        }

                        this.reponseToInput.emit(obj);
                        // (this.rightFilterData.reportFormat[0].name == 'Detailed') ? this.reponseToInput.emit(false): this.reponseToInput.emit(true);;
                        (this.rightFilterData.grandfathering == 1) ? this.grandFatheringEffect = true : this.grandFatheringEffect = false;
                        this.fromDateYear = (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].from : 2019;
                        this.fromDate = new Date(this.fromDateYear, 3, 1);
                        this.toDateYear = (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020;
                        this.toDate = new Date(this.toDateYear, 2, 31);
                        if (this.rightFilterData.reportFormat[0].name == 'Detailed') {
                            this.getDetailedData(this.rightFilterData.capitalGainData.responseData);
                        }
                    }
                    rightSideDataSub.unsubscribe();
                }
            }
        );
    }
    getFilterData(data, category) {
        if (data) {

            let filteredArray = [];
            let totalValue: any = {};
            this.categoryWiseTotal;
            let mfList = this.MfServiceService.filter(data, 'mutualFund');
            if (this.rightFilterData) {
                mfList = this.MfServiceService.filterArray(mfList, 'familyMemberId', this.rightFilterData.family_member_list, 'id');
            }
            if (this.familyList.length > 0) {
                mfList = this.MfServiceService.filterArray(this.mfList, 'familyMemberId', this.familyList, 'id');
            }
            mfList = this.MfServiceService.sorting(mfList, 'schemeName');
            mfList = [...new Map(mfList.map(item => [item.id, item])).values()];
            mfList = this.MfServiceService.casFolioNumber(mfList);
            mfList.forEach(element => {
                const startObj = {
                    schemeName: element.schemeName,
                    folioNumber: element.folioNumber,
                    ownerName: element.ownerName,
                    isin: element.isin,
                }
                let totalObj: any = {};
                if ((element.redemptionTransactions) ? (element.redemptionTransactions.length > 0) : element.redemptionTransactions) {
                    filteredArray.push(startObj);
                    element.redemptionTransactions.forEach(obj => {


                        // let financialyear = this.MfServiceService.getYearFromDate(obj.transactionDate)
                        let trnDate = new Date(obj.transactionDate)
                        trnDate.setHours(0, 0, 0, 0)
                        if (trnDate >= this.fromDate && trnDate <= this.toDate) {

                            if (obj.purchaceAgainstRedemptionTransactions || (obj.purchaceAgainstRedemptionTransactions) ? obj.purchaceAgainstRedemptionTransactions.length > 0 : obj.purchaceAgainstRedemptionTransactions) {
                                obj.purchaceAgainstRedemptionTransactions.forEach((ele, ind) => {
                                    this.criteriaDate = new Date(2018, 0, 31); // this date is used for criteria if the transactions happens before this date then only grandfathering effect is applied otherwise data remain as it is
                                    totalObj = this.getFilteredValues(ele, category);
                                    ele.stGain = totalObj.stGain;
                                    ele.ltGain = totalObj.ltGain;
                                    ele.stLoss = totalObj.stLoss;
                                    ele.ltLoss = totalObj.ltLoss;
                                    ele.indexGain = totalObj.indexGain;
                                    ele.indexLoss = totalObj.indexLoss;
                                    let purchaseTrnDate = new Date(ele.transactionDate)
                                    purchaseTrnDate.setHours(0, 0, 0, 0)
                                    if (this.grandFatheringEffect && category == 'EQUITY' && this.criteriaDate >= purchaseTrnDate) {
                                        ele.purchasePriceRate = (this.grandFatheringEffect) ? ele.grandFatheringPurchasePrice : ele.purchasePrice;
                                        // ele.purchasePrice = (this.grandFatheringEffect) ? ele.grandFatheringPurchasePrice : ele.purchasePrice;
                                        ele.purchaseAmt = (this.grandFatheringEffect) ? (ele.unit * ele.grandFatheringPurchasePrice) : ele.amount;
                                        // ele.amount = (this.grandFatheringEffect) ? (ele.unit * ele.grandFatheringPurchasePrice) : ele.amount;
                                    } else {
                                        ele.purchasePriceRate = ele.purchasePrice;
                                        ele.purchaseAmt = ele.amount
                                    }
                                    if (category == 'EQUITY' && ele.days <= 365) {
                                        ele.purchasePriceRate = ele.purchasePrice;
                                        ele.purchaseAmt = ele.amount
                                    }

                                    if (ind == 0) {
                                        ele.redeemTransactionDate = (obj.transactionDate) ? obj.transactionDate : 0;
                                        ele.transactionType = (obj.fwTransactionType) ? obj.fwTransactionType : 0;
                                        ele.redeemAmount = (obj.amount) ? obj.amount : 0;
                                        ele.redeemStt = (obj.stt) ? obj.stt : 0;
                                        ele.redeemUnit = (obj.unit) ? obj.unit : 0;
                                        ele.redeemRate = (obj.purchasePrice) ? obj.purchasePrice : 0;
                                    }
                                    filteredArray.push(ele)
                                    totalValue = this.MfServiceService.addTwoObjectValues(this.calculateTotalValue(ele), totalValue, { totalAmt: true });

                                });
                            }
                        }

                    });
                    if (Object.keys(totalValue).length != 0) {
                        this.getFinalTotalValue(totalValue);
                        filteredArray.push(totalValue)
                        let filterr = {
                            totalAmt: 'Total',
                            totalAmount: totalValue.totalAmount,
                            totalStt: totalValue.totalStt,
                            purchaseAmount: totalValue.purchaseAmount,
                            totalStGain: totalValue.totalStGain,
                            totalLtGain: totalValue.totalLtGain,
                            totalStLoss: totalValue.totalStLoss,
                            totalLtLoss: totalValue.totalLtLoss,
                            totalIndexGain: totalValue.totalIndexGain,
                            totalIndexLoss: totalValue.totalIndexLoss
                        }
                        this.categoryWiseTotal = this.MfServiceService.addTwoObjectValues(filterr, this.categoryWiseTotal, { totalAmt: true });
                        totalValue = {};
                    }

                } else {
                    if (filteredArray.length > 0) {
                        if (filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].schemeName || filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].ownerName) {
                            filteredArray.pop();
                        }
                    }
                }
                if (filteredArray.length > 0) {
                    if (filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].schemeName || filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].ownerName) {
                        filteredArray.pop();
                    }
                }
            });
            if (filteredArray.length > 0) {
                if (filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].schemeName || filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].ownerName) {
                    filteredArray.pop();
                }
            }
            if (Object.keys(this.categoryWiseTotal).length != 0) {
                (category == 'DEBT') ? this.debtObj = this.categoryWiseTotal : this.equityObj = this.categoryWiseTotal;
                this.categoryWiseTotal = {};
            }
            console.log('DEBT', this.debtObj);
            console.log('EQUITY', this.equityObj);
            if (category != 'EQUITY') {
                this.categoryWiseTotal = {};
            }
            // this.dataSource4=['Grand total','tranType', this.redeemAmount,this.total_stt,'-','-','-',this.purchaseAmount,'-','-',this.total_stGain,this.total_stLoss,this.total_ltGain,this.total_ltLoss,this.total_indexGain,this.total_indexLoss,'-' ];

            return filteredArray;

            // this.getArrayForFinalValue()
        }
    }
    // getArrayForFinalValue(){
    // this.dataSource4=['Grand total', '-', this.redeemAmount, this.total_stt, '-', '-', '-', 'amtPurchase', this.purchaseAmount, '-', '-', this.total_stGain, this.total_stLoss, this.total_ltGain, this.total_ltLoss, this.total_indexGain, this.total_indexLoss];
    // }
    getFilteredValues(data, category) {
        let days;
        let gainLossBasedOnGrandfathering;
        (category == 'DEBT') ? days = 1095 : days = 365;
        (this.grandFatheringEffect) ? gainLossBasedOnGrandfathering = 'grandFatheringGainOrLossAmount' : gainLossBasedOnGrandfathering = 'gainOrLossAmount';
        let stGain;
        let ltGain;
        let stLoss;
        let ltLoss;
        let indexGain;
        let indexLoss;
        let purchaseTrnDate = new Date(data.transactionDate)
        if (category == 'EQUITY' && this.criteriaDate >= purchaseTrnDate && this.grandFatheringEffect) {
            gainLossBasedOnGrandfathering = 'grandFatheringGainOrLossAmount'
        } else {
            gainLossBasedOnGrandfathering = 'gainOrLossAmount'
        }
        if (category == 'EQUITY' && data.days <= 365) {
            gainLossBasedOnGrandfathering = 'gainOrLossAmount'
        }
        if (data.days <= days) {
            stGain = ((data[gainLossBasedOnGrandfathering] >= 0) ? (data[gainLossBasedOnGrandfathering]) : 0)
            stLoss = ((data[gainLossBasedOnGrandfathering] < 0) ? (data[gainLossBasedOnGrandfathering]) : 0)
        } else {
            ltGain = ((data[gainLossBasedOnGrandfathering] >= 0) ? data[gainLossBasedOnGrandfathering] : 0);
            ltLoss = ((data[gainLossBasedOnGrandfathering] < 0) ? data[gainLossBasedOnGrandfathering] : 0);
        }
        if (ltGain || ltLoss) {
            indexGain = ((data.indexGainOrLoss >= 0) ? (data.indexGainOrLoss) : 0)
            indexLoss = ((data.indexGainOrLoss < 0) ? (data.indexGainOrLoss) : 0)
        }

        let obj = {
            stGain: (stGain) ? stGain : 0,
            ltGain: (ltGain) ? ltGain : 0,
            stLoss: (stLoss) ? stLoss : 0,
            ltLoss: (ltLoss) ? ltLoss : 0,
            indexGain: (indexGain) ? indexGain : 0,
            indexLoss: (indexLoss) ? indexLoss : 0
        };
        return obj;
    }
    calculateTotalValue(data) {
        let totalAmount = 0;
        let totalStt = 0
        let purchaseAmount = 0;
        let totalStGain = 0;
        let totalLtGain = 0;
        let totalStLoss = 0;
        let totalLtLoss = 0;
        let totalIndexGain = 0;
        let totalIndexLoss = 0;
        totalAmount += (data.redeemAmount) ? data.redeemAmount : 0;
        totalStt += (data.redeemStt) ? data.redeemStt : 0;
        purchaseAmount += (data.purchaseAmt) ? data.purchaseAmt : 0;
        // purchaseAmount += (data.amount) ? data.amount : 0;
        totalStGain += (data.stGain) ? data.stGain : 0;
        totalLtGain += (data.ltGain) ? data.ltGain : 0;
        totalStLoss += (data.stLoss) ? data.stLoss : 0;
        totalLtLoss += (data.ltLoss) ? data.ltLoss : 0;
        totalIndexGain += (data.indexGain) ? data.indexGain : 0;
        totalIndexLoss += (data.indexLoss) ? data.indexLoss : 0;

        let obj = {
            totalAmt: 'Total',
            totalAmount: totalAmount,
            totalStt: totalStt,
            purchaseAmount: purchaseAmount,
            totalStGain: totalStGain,
            totalLtGain: totalLtGain,
            totalStLoss: totalStLoss,
            totalLtLoss: totalLtLoss,
            totalIndexGain: totalIndexGain,
            totalIndexLoss: totalIndexLoss
        };
        return obj;
    }
    getFinalTotalValue(data) {

        this.total_stGain += (data) ? data.totalStGain : 0;
        this.total_ltGain += (data) ? data.totalLtGain : 0;
        this.total_stLoss += (data) ? data.totalStLoss : 0;
        this.total_ltLoss += (data) ? data.totalLtLoss : 0;
        this.total_indexGain += (data) ? data.totalIndexGain : 0;
        this.total_indexLoss += (data) ? data.totalIndexLoss : 0;
        this.purchaseAmount += (data) ? data.purchaseAmount : 0;
        this.redeemAmount += (data) ? data.totalAmount : 0;
        this.total_stt += (data) ? data.totalStt : 0;

        this.dataSource4 = [{ 'name': 'Grand total' }, { 'tranType': '-' }, { 'redeemAmount': this.redeemAmount }, { 'total_stt': this.total_stt }, { 'unit': '-' }, { 'saleRate': '-' }, { 'date': '-' }, { 'amtPurchase': this.purchaseAmount }, { 'purUnit': '-' }, { 'purRate': '-' }, { 'total_stGain': this.total_stGain }, { 'total_stLoss': this.total_stLoss }, { 'total_ltGain': this.total_ltGain }, { 'total_ltLoss': this.total_ltLoss }, { 'total_indexGain': this.total_indexGain }, { 'total_indexLosst': this.total_indexLoss }, { 'days': '-' }];

    }
    // getDividendSummaryData(data) {
    // if(data){
    // let filterObj = []
    // this.totalReinvesment = 0;
    // let mutualFund = this.MfServiceService.filter(data, 'mutualFund');
    // mutualFund.forEach(element => {
    // if(element.redemptionTransactions){
    // element.redemptionTransactions.forEach(ele => {
    // // let financialyear = this.MfServiceService.getYearFromDate(ele.transactionDate)
    // let trnDate = new Date(ele.transactionDate)
    // if(trnDate >= this.fromDate && trnDate <= this.toDate){
    // if (element.dividendPayout != 0 && element.dividendReinvestment != 0) {
    // element.totalReinvesment = element.dividendPayout + element.dividendReinvestment
    // this.totalReinvesment += ((element.totalReinvesment) ? element.totalReinvesment : 0);
    // this.totaldividendPayout += ((element.dividendPayout) ? element.dividendPayout : 0);
    // this.totaldividendReinvestment += ((element.dividendReinvestment) ? element.dividendReinvestment : 0);
    // filterObj.push(element);
    // }
    // }
    // });
    // } else{
    // filterObj = [];
    // }
    // });
    // return filterObj;
    // }

    // }
    getDividendSummaryData(data) {
        if (data) {
            this.GTReinvesment = 0;
            this.GTdividendPayout = 0;
            this.GTdividendReinvestment = 0;
            let filterObj = []
            this.totalReinvesment = 0;
            let flag = false;
            let mutualFund = this.MfServiceService.filter(data, 'mutualFund');
            if (this.rightFilterData) {
                mutualFund = this.MfServiceService.filterArray(mutualFund, 'familyMemberId', this.rightFilterData.family_member_list, 'id');
            }
            if (this.familyList.length > 0) {
                mutualFund = this.MfServiceService.filterArray(this.mutualFund, 'familyMemberId', this.familyList, 'id');
            }
            mutualFund = this.MfServiceService.sorting(mutualFund, 'schemeName');
            mutualFund.forEach(element => {
                if (element.dividendTransactions) {
                    element.dividendTransactions.forEach(ele => {
                        let trnDate = new Date(ele.transactionDate)
                        trnDate.setHours(0, 0, 0, 0)
                        if (trnDate >= this.fromDate && trnDate <= this.toDate) {
                            if (ele.fwTransactionType == 'Dividend Payout') {
                                ele.dividendPayout = ele.amount
                            } else {
                                ele.dividendReinvestment = ele.amount
                            }
                            if (ele.dividendPayout != 0 || ele.dividendReinvestment != 0) {
                                ele.totalReinvesment = ((ele.dividendPayout ? ele.dividendPayout : 0) + (ele.dividendReinvestment ? ele.dividendReinvestment : 0))
                                this.totalReinvesment += ((ele.totalReinvesment) ? ele.totalReinvesment : 0);
                                this.totaldividendPayout += ((ele.dividendPayout) ? ele.dividendPayout : 0);
                                this.totaldividendReinvestment += ((ele.dividendReinvestment) ? ele.dividendReinvestment : 0);

                            }
                            flag = true;

                        }

                    });
                    if (flag) {
                        const obj = {
                            schemeName: element.schemeName,
                            isin: element.isin,
                            folioNumber: element.folioNumber,
                            dividendPayout: this.totaldividendPayout,
                            dividendReinvestment: this.totaldividendReinvestment,
                            totalReinvesment: this.totalReinvesment
                        }
                        filterObj.push(obj);
                        this.GTReinvesment += (this.totalReinvesment) ? this.totalReinvesment : 0;
                        this.GTdividendPayout += (this.totaldividendPayout) ? this.totaldividendPayout : 0;
                        this.GTdividendReinvestment += (this.totaldividendReinvestment) ? this.totaldividendReinvestment : 0;
                        this.totalReinvesment = 0;
                        this.totaldividendPayout = 0;
                        this.totaldividendReinvestment = 0;
                    }

                }
            });
            return filterObj;
        }
    }
    isGroup = (index, item) => item.schemeName;// for grouping schme name
    isSimpleRow = (index, item) => item.totalAmt;

    generatePdf() {
        this.fragmentData.isSpinner = true
        const para = document.getElementById('template');
        // const header = document.getElementById('templateHeader');
        const header = document.getElementById('templateHeader');

        // let header = null
        this.UtilService.htmlToPdf(header.innerHTML, para.innerHTML, 'MF capital gain detailed', 'true', this.fragmentData, '', '', true);

    }
    Excel(tableTitle) {
        this.showDownload = true
        setTimeout(() => {
            var blob = new Blob([document.getElementById('template').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, tableTitle + ".xls");
        }, 200);
        // if (data) {
        // this.fragmentData.isSpinner = false;
        // }
    }
    generatePdfBulk() {
        this.loadingDone = true
        const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
        setTimeout(() => {
            let para = this.mfCapitalTemplateDetailed.nativeElement.innerHTML
            // let header = this.mfCapitalTemplateHeader.nativeElement.innerHTML
            let obj = {
                htmlInput: para,
                name: (this.clientData.name) ? this.clientData.name : '' + 's' + 'MF capital gain detailed' + date,
                landscape: true,
                header: null,
                key: 'showPieChart',
                clientId: this.clientId,
                advisorId: this.advisorId,
                fromEmail: this.clientDetails.advisorData.email,
                toEmail: this.clientData.email
            }
            this.UtilService.bulkHtmlToPdf(obj)
            //this.UtilService.htmlToPdf(para, 'MF_Capital_Gain_Detailed', true, this.fragmentData, '', '')
        }, 300);


    }
    getDetails() {
        const obj = {
            clientId: this.clientId,
            advisorId: this.advisorId,
        };
        this.backOfficeService.getDetailsClientAdvisor(obj).subscribe(
            data => this.getDetailsClientAdvisorRes(data)
        );
    }
    getDetailsClientAdvisorRes(data) {
        console.log('data', data)
        this.clientDetails = data
        this.clientData = data.clientData
        this.getOrgData = data.advisorData
        this.userInfo = data.advisorData
    }
}