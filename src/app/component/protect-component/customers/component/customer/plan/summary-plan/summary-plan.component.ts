import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AuthService } from './../../../../../../../auth-service/authService';
import { EventService } from './../../../../../../../Data-service/event.service';
import { PlanService } from './../plan.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ConstantsService } from 'src/app/constants/constants.service';
import { UtilService } from 'src/app/services/util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SummaryPlanServiceService } from './summary-plan-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiConfig } from 'src/app/config/main-config';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
    selector: 'app-summary-plan',
    templateUrl: './summary-plan.component.html',
    styleUrls: ['./summary-plan.component.scss']
})
export class SummaryPlanComponent implements OnInit {
    displayedColumns: string[] = ['details', 'value', 'month', 'lumpsum'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    advisorId = AuthService.getAdvisorId();
    clientId = AuthService.getClientId();
    isLoadingGoals = true;
    goalSummaryCountObj: any;
    goalList: any;
    insurancePlanList = [{}, {}, {}];
    clientDob: any;
    familyList: any[];
    startDate: any;
    endDate: any;
    cashFlowData: any;
    yearToShow: string;
    budgetData = [{}, {}, {}]
    isLoadingBudget = false;
    isLoadingCashFlow = true;
    object: { 'insuranceName': any; 'amount': any; 'img': string; };
    annualSurplus: any;
    incomePercent: number;
    expensePercent: number;
    @ViewChild('summaryPlan', { static: false }) summaryPlan: ElementRef;
    show = true;
    fragmentData = { isSpinner: false, date: null, time: '', size: '' };
    map: any;
    loopEle: number;
    isLoadingSummary = true;
    singleGoalData = {
        details: '', value: '', month: '', lumpsum: '', imageUrl: '', year: '',
        goalFV: '', achievedValue: '', equity_monthly: '', debt_monthly: '', lump_equity: '', lump_debt: '',
        goalAssetAllocation: '', retirementTableValue: '', percentCompleted: ''
    };
    userInfo = AuthService.getUserInfo();
    clientData = AuthService.getClientData();
    details = AuthService.getProfileDetails();
    getOrgData = AuthService.getOrgDetails();
    clientIdToClearStorage: any;
    finPlanId: any;
    isSpinner: boolean;
    generatePDF: number;
    finPlanList: any;
    id: any;
    @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse

    @Input() finPlanObj: any;//finacial plan pdf input
    reportDate: Date;
    totalMonth = 0;
    totalLumpsum = 0;

    constructor(
        private summaryPlanService: SummaryPlanServiceService,
        private planService: PlanService,
        private eventService: EventService,
        private peopleService: PeopleService,
        private datePipe: DatePipe,
        private constantService: ConstantsService,
        private util: UtilService,
        private sanitizer: DomSanitizer,
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        public enumDataService: EnumDataService
    ) {
        console.log('org', this.getOrgData)
        console.log('userInfo', this.userInfo)
    }

    @ViewChild(MatPaginator, { static: false }) paginator;

    ngOnInit() {
        this.reportDate = new Date()
        this.isLoadingBudget = true;
        this.summaryPlanService.getClientId().subscribe(res => {
            this.clientIdToClearStorage = res;
        });
        if (this.clientIdToClearStorage) {
            if (this.clientIdToClearStorage != this.clientId) {
                this.summaryPlanService.clearStorage();
            }
        }
        this.summaryPlanService.setClientId(this.clientId);
        this.summaryPlanService.getFinPlanId()
            .subscribe(res => {
                this.finPlanId = res;
            });
        this.getFinPlan();
        this.getStartAndEndDate();
        this.getGoalSummaryValues();
        this.getSummeryInsurance();
        this.getListFamilyMem();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    sortingDescending(data, filterId) {
        if (data) {
            data.sort((a, b) =>
                a[filterId] > b[filterId] ? -1 : (a[filterId] === b[filterId] ? 0 : 1)

            );
        }
        return data
    }
    generatePdf(data) {
        this.fragmentData.isSpinner = true;;
        let para = document.getElementById('planSummary');
        //const header = this.summaryTemplateHeader.nativeElement.innerHTML
        this.util.htmlToPdf('', para.innerHTML, 'Financial plan', 'false', this.fragmentData, '', '', false, null);

    }
    getFinPlan() {
        let obj = {
            advisorId: AuthService.getAdvisorId(),
            clientId: AuthService.getClientId()
        }
        this.planService.getPlanSection(obj).subscribe(
            data => {
                if (data) {
                    data = this.sortingDescending(data, 'createdDate');
                    this.finPlanList = data[0];
                    console.log(data);
                } else {
                    this.finPlanList = null;
                    // this.eventService.openSnackBar("Financial plan not saved", "Ok")
                }

            },
            err => {
                console.error(err);
            }
        );
        if (this.isLoadingCashFlow && this.isLoadingBudget && this.isLoadingGoals && this.isLoadingSummary) {
            this.cd.detectChanges();//to refresh the dom when response come
            setTimeout(() => {
                this.loaded.emit(document.getElementById('planSummary'));
            }, 5000);
        }
    }
    downloadPrevoius(element) {
        if (element) {
            this.fragmentData.isSpinner = true;
            let obj = {
                clientId: AuthService.getClientId(),
                s3Objects: element.modules
            }
            this.planService.mergeCall(obj).subscribe(
                data => {
                    this.mergeCallRes(data)
                }
            );
        } else {
            this.fragmentData.isSpinner = false;
        }
    }

    mergeCallRes(data) {
        this.id = data
        this.generatePDF = 0
        this.isSpinner = false
        setTimeout(() => {
            this.getPDFCall(data)
        }, 5000);
    }
    getPDFCall(data) {
        this.isSpinner = false
        let obj = {
            id: data.id
        }
        // this.summaryPlanService.setFinPlanId(data.id);
        return this.http
            .post(
                apiConfig.MAIN_URL + 'plan/financial-plan/pdf/get',
                obj,
                { responseType: 'blob' }
            )
            .subscribe((data) => {
                if (data.type == "application/pdf") {
                    this.generatePDF = 1
                    this.fragmentData.isSpinner = false
                    const file = new Blob([data], { type: 'application/pdf' });
                    var date = new Date();
                    this.fragmentData.size = this.formatFileSize(data.size, 0);
                    this.fragmentData.date = new Date(this.finPlanList.createdDate);
                    const namePdf = this.clientData.name + '\'s ' + 'Financial plan pdf' + ' as on ' + date;
                    const a = document.createElement('a');
                    a.href = window.URL.createObjectURL(file);
                    a.download = namePdf + '.pdf';
                    a.click();
                } else {
                    this.generatePDF = 0
                    setTimeout(() => {
                        this.getPDFCall(this.id)
                    }, 5000);
                }

            });
    }
    getBudgetApis() {
        this.isLoadingBudget = true;
        const obj2 = {
            advisorId: this.advisorId,
            clientId: this.clientId,
            allOrSingle: 1,
            endDate: this.endDate,
            startDate: this.startDate,
            limit: 10,
            offset: 1,
            familyMemberId: 0,
            clientDob: this.clientDob,
            fmDobList: JSON.stringify(this.familyList)
        };
        const obj3 = {
            advisorId: this.advisorId,
            clientId: this.clientId,
            startDate: this.startDate,
            endDate: this.endDate,
            clientDob: this.clientDob,
            fmDobList: JSON.stringify(this.familyList)
        };
        const BudgetRecurring = this.planService.otherCommitmentsGet(obj2);
        //     const obser1$ = this.http.get('https://jsonplaceholder.typicode.com/todos/1').pipe(
        // catchError(error => of(error))
        // );
        const recurringAssets = this.planService.getAllExpense(obj3);
        forkJoin(BudgetRecurring, recurringAssets).subscribe(result => {
            let budgetRecurring = this.filterData(result[0]);
            let BudgetCommitments = this.getAssetData(result[1]);
            let mergeArray = [...BudgetCommitments, ...budgetRecurring];
            mergeArray = this.sorting(mergeArray, 'expenseType');
            console.log(mergeArray);
            this.budgetData = mergeArray;
            this.isLoadingBudget = false;
        }, err => {
            this.isLoadingBudget = false;
            this.budgetData = [];
            // this.eventService.openSnackBar(err, 'Dismiss');

        })
        if (this.isLoadingCashFlow && this.isLoadingBudget && this.isLoadingGoals && this.isLoadingSummary) {
            this.cd.detectChanges();//to refresh the dom when response come
            setTimeout(() => {
                this.loaded.emit(document.getElementById('planSummary'));
            }, 5000);
        }
    }

    sorting(data, filterId) {
        if (data) {
            data.sort((a, b) =>
                a[filterId] > b[filterId] ? 1 : (a[filterId] === b[filterId] ? 0 : -1)
            );
        }
        return data
    }

    cinema = [
        {
            "Cinema_strName": "dfdsfsd, Ahmedabad",
            "Cinema_strID": "HIWB",
            "Cinema_strBannerImg": "F&BCombo.jpg",
            "cinema_addr": "fsdfsdfr,Drive-in Road, 380052, ",
            "cinema_loc": "<iframe src=\"fsdfsdfdsfsfdsfdsffsf4!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6a9f5938cfed5cd2!2sCarnival+Cinemas!5e0!3m2!1sen!2sin!4v1467809324170\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" allowfullscreen></iframe>",
            "cinema_mob": 0
        }
    ];

    safeCinema(cinemaLoc) {
        console.log(this.sanitizer.bypassSecurityTrustHtml(cinemaLoc))
        return this.sanitizer.bypassSecurityTrustHtml(cinemaLoc);
    }

    // generatePdf(tmp) {
    //     this.fragmentData.isSpinner = true;
    //     let pdfArray = [];
    //     this.dataSource.data.forEach(element => {
    //         this.singleGoalData = element;
    //         this.cd.markForCheck();
    //         this.cd.detectChanges();
    //         let para = document.getElementById('planSummary');
    //         pdfArray.push({ goalName: element.details, para: para.innerHTML })
    //     });
    //     console.log(pdfArray)
    //     let para = '';
    //     pdfArray.forEach(element => {
    //         para += element.para
    //     })
    //     const header = this.summaryTemplateHeader.nativeElement.innerHTML
    //     this.util.htmlToPdf('', para, 'Financial plan', 'true', this.fragmentData, '', '', false);
    // }
    generatePdfFinPlan() {
        if (this.finPlanId) {
            this.fragmentData.isSpinner = true
            let obj = {
                id: this.finPlanId
            }
            return this.http
                .post(
                    apiConfig.MAIN_URL + 'plan/financial-plan/pdf/get',
                    obj,
                    { responseType: 'blob' }
                )
                .subscribe((data) => {
                    if (data.type == "application/pdf") {
                        this.generatePDF = 1
                        this.fragmentData.isSpinner = false
                        const file = new Blob([data], { type: 'application/pdf' });
                        this.fragmentData.size = this.formatFileSize(data.size, 0);
                        // this.fragmentData.date = this.datePipe.transform(this.finPlanList.createdDate, 'dd/MM/yyyy');
                        this.fragmentData.date = new Date(this.finPlanList.createdDate);
                        var date = new Date();
                        const namePdf = this.clientData.name + '\'s ' + 'Financial plan' + ' as on ' + date;
                        const a = document.createElement('a');
                        a.href = window.URL.createObjectURL(file);
                        a.download = namePdf + '.pdf';
                        a.click();
                    }

                });
        } else {
            this.eventService.openSnackBar("Financial plan not saved", "Ok")
        }

    }
    formatFileSize(bytes, decimalPoint) {
        if (bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimalPoint || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    getAssetData(data) {
        let finalArray = [];
        if (data) {
            let committedInvestmentExpense = this.filterAssetData(data.committedInvestmentExpense);
            let committedExpenditureExpense = this.filterAssetData(data.committedExpenditureExpense);
            let pord = this.filterAssetData(data.pordAsset);
            let lifeInsuranceList = this.filterAssetData(data.lifeInsuranceList);
            let generalInsuranceExpense = this.filterAssetData(data.generalInsurancePremium);
            let ssy = this.filterAssetData(data.ssyAsset);
            let loanExpense = this.filterAssetData(data.loanEmi);
            let recurringDeposit = this.filterAssetData(data.rdAsset);
            let sipExpense = this.filterAssetData(data.mutualFundSipList);
            finalArray = [...committedInvestmentExpense, ...committedExpenditureExpense, ...pord, ...lifeInsuranceList, ...generalInsuranceExpense, ...ssy, ...loanExpense, ...recurringDeposit, ...sipExpense];

            console.log(finalArray)


        } else {
            finalArray = [];
        }
        return finalArray
    }

    filterAssetData(data) {
        let obj;
        let filterArray = []
        if (data) {
            if (data[1].name == 'Pord') {
                data[1].name = 'Post office recurring deposits'
                data[0].assetList = data[0].pordList;
            } else if (data[1].name == 'Recurring deposits') {
                data[1].name = 'Bank recurring deposits'
            } else if (data[1].name == 'Sukanya samriddhi yojna') {
                data[0].assetList = data[0].ssyList;
            }
            obj = {
                expenseType: data[1].name,
                total: data[2].total,
                amount: data[2].total,
                spent: data[2].total,
                assetList: data[0].assetList,
                progressPercent: 0,
                spentPerOther: 0,
                budgetPerOther: 0
            }
            obj.progressPercent = 0;
            obj.progressPercent += (data[2].total / data[2].total) * 100;
            obj.progressPercent = Math.round(obj.progressPercent);
            if (obj.progressPercent > 100) {
                obj.spentPerOther = 100;
                obj.budgetPerOther = obj.progressPercent - 100;
            } else {
                obj.spentPerOther = obj.progressPercent;
            }
        }
        if (obj) {
            // filterArray.push({name:data[1].name},{total:data[2].total},{});
            filterArray.push(obj);

        }
        return filterArray
    }

    filterData(array) {
        if (array) {
            array = array.filter(item => item.totalAmount > 0);
            array.forEach(singleExpense => {
                singleExpense.progressPercent = 0;
                singleExpense.progressPercent += (singleExpense.spent / singleExpense.amount) * 100;
                singleExpense.progressPercent = Math.round(singleExpense.progressPercent);
                if (singleExpense.progressPercent > 100) {
                    singleExpense.spentPer = 100;
                    singleExpense.budgetPer = singleExpense.progressPercent - 100;
                } else {
                    singleExpense.spentPer = singleExpense.progressPercent;
                }
                const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.budgetCategoryId];
                if (singleExpenseCategory) {
                    singleExpense.expenseType = singleExpenseCategory.expenseType;
                }
            });
        } else {
            array = [];
        }

        return array;
    }

    getStartAndEndDate() {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), 0, 1);
        var lastDay = new Date(date.getFullYear(), 11, 31);
        this.startDate = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
        this.endDate = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
        var startYear = firstDay.getFullYear() - 1;
        var endYear = lastDay.getFullYear().toString().substr(-2);
        this.yearToShow = startYear + '-' + endYear;
        console.log('startYearddddddddddddddddddddd', startYear);
        console.log('endYearddddddddddddddddddddd', endYear);


    }

    getGoalSummaryValues() {
        let data = {
            advisorId: this.advisorId,
            clientId: this.clientId
        }
        this.isLoadingGoals = true;
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.planService.getGoalSummaryPlanData(data)
            .subscribe(res => {
                let monthly = 0;
                let Alllumpsum = 0;
                this.totalMonth = 0;
                this.totalLumpsum = 0;
                if (res) {
                    console.log(res);
                    this.goalSummaryCountObj = res;
                    this.goalList = res.goalList;
                    let arr = [];
                    this.goalList.forEach(item => {
                        if (!!item.singleOrMulti && item.singleOrMulti === 1) {
                            let goalValueObj = item.singleGoalModel,
                                lumpsumDeptKey = Object.keys(goalValueObj.lumpSumAmountDebt)[0],
                                lumpsumEquityKey = Object.keys(goalValueObj.lumpSumAmountEquity)[0],
                                lumpsum = Math.round(goalValueObj.lumpSumAmountDebt[lumpsumDeptKey] + goalValueObj.lumpSumAmountEquity[lumpsumEquityKey]),
                                sipDebtKey = Object.keys(goalValueObj.sipAmountDebt)[0],
                                sipEquityKey = Object.keys(goalValueObj.sipAmountEquity)[0],
                                month = Math.round(goalValueObj.sipAmountDebt[sipDebtKey] + goalValueObj.sipAmountEquity[sipEquityKey]),
                                year = (new Date(goalValueObj.goalStartDate).getFullYear()).toString();
                            if (goalValueObj.goalType == 1) {
                                year = (goalValueObj.differentGoalYears) ? (new Date(goalValueObj.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalValueObj.goalEndDate).getFullYear()) : '-';
                            }
                            let goalFV = goalValueObj.goalFV
                            if (goalValueObj.retirementTableValue) {
                                goalValueObj.retirementTableValue.forEach(element => {
                                    element.goalYear = new Date(element.goalStartDate).getFullYear()
                                });
                            }

                            arr.push({
                                details: !!goalValueObj.goalName ? goalValueObj.goalName : '',
                                value: !!goalValueObj.goalFV ? Math.round(goalValueObj.goalFV) : '',
                                month,
                                lumpsum,
                                percentCompleted: Math.round(!!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage : 0),
                                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl : '',
                                year: year,
                                goalFV: UtilService.getNumberToWord(!!goalValueObj.goalFV ? goalValueObj.goalFV : 0),
                                achievedValue: UtilService.getNumberToWord(!!goalValueObj.achievedValue ? goalValueObj.achievedValue : 0),
                                equity_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountEquity) || 0,
                                debt_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountDebt) || 0,
                                lump_equity: this.getSumOfJsonMap(goalValueObj.lumpSumAmountEquity) || 0,
                                lump_debt: this.getSumOfJsonMap(goalValueObj.lumpSumAmountDebt) || 0,
                                goalAssetAllocation: item.goalAssetAllocation,
                                retirementTableValue: goalValueObj.retirementTableValue
                            });
                            monthly = month;
                            Alllumpsum = lumpsum;
                        } else if (!!item.singleOrMulti && item.singleOrMulti === 2) {
                            let goalValueObj = item.multiYearGoalPlan,
                                lumpsumDebt = 0,
                                lumpsumEquity = 0,
                                lumpsum = 0,
                                sipDebtSum = 0,
                                sipEquitySum = 0,
                                month = 0;
                            for (const key in goalValueObj.lumpSumAmountDebt) {
                                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountDebt, key)) {
                                    const element = goalValueObj.lumpSumAmountDebt[key];
                                    lumpsumDebt += element;
                                }
                            }
                            for (const key in goalValueObj.lumpSumAmountDebt) {
                                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountEquity, key)) {
                                    const element = goalValueObj.lumpSumAmountEquity[key];
                                    lumpsumEquity += element;
                                }
                            }
                            lumpsum = Math.round(lumpsumDebt + lumpsumEquity);

                            for (const key in goalValueObj.sipAmountDebt) {
                                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountDebt, key)) {
                                    const element = goalValueObj.sipAmountDebt[key];
                                    sipDebtSum += element;
                                }
                            }

                            for (const key in goalValueObj.sipAmountEquity) {
                                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountEquity, key)) {
                                    const element = goalValueObj.sipAmountEquity[key];
                                    sipEquitySum += element;
                                }
                            }

                            month = Math.round(sipEquitySum + sipDebtSum);
                            let year;
                            year = (new Date(goalValueObj.goalStartDate).getFullYear()).toString();
                            if (goalValueObj.goalType == 1) {
                                year = (goalValueObj.differentGoalYears) ? (new Date(goalValueObj.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalValueObj.goalEndDate).getFullYear()) : '-';
                            }
                            if (goalValueObj.retirementTableValue) {
                                goalValueObj.retirementTableValue.forEach(element => {
                                    element.goalYear = new Date(element.goalStartDate).getFullYear()
                                });
                            }
                            arr.push({
                                details: goalValueObj.name,
                                month,
                                lumpsum,
                                percentCompleted: Math.round(!!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage : 0),
                                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl : '',
                                value: !!goalValueObj.futureValue ? Math.round(goalValueObj.futureValue) : '',
                                year: year,
                                goalFV: UtilService.getNumberToWord(!!goalValueObj.goalFV ? goalValueObj.goalFV : 0),
                                achievedValue: UtilService.getNumberToWord(!!goalValueObj.achievedValue ? goalValueObj.achievedValue : 0),
                                equity_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountEquity) || 0,
                                debt_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountDebt) || 0,
                                lump_equity: this.getSumOfJsonMap(goalValueObj.lumpSumAmountEquity) || 0,
                                lump_debt: this.getSumOfJsonMap(goalValueObj.lumpSumAmountDebt) || 0,
                                goalAssetAllocation: item.goalAssetAllocation,
                                retirementTableValue: goalValueObj.retirementTableValue
                            });
                            monthly = month;
                            Alllumpsum = lumpsum;
                        }
                        this.totalMonth += monthly
                        this.totalLumpsum += Alllumpsum
                    });
                    this.dataSource.data = arr;
                    this.isLoadingGoals = false;
                    this.dataSource.paginator = this.paginator;
                }
            }, err => {
                this.goalSummaryCountObj = ''
                this.isLoadingGoals = false;
                console.error(err);
                // this.eventService.openSnackBar("Something went wrong", "DISMISS")
            })
        if (this.isLoadingCashFlow && this.isLoadingBudget && this.isLoadingGoals && this.isLoadingSummary) {
            this.cd.detectChanges();//to refresh the dom when response come
            setTimeout(() => {
                this.loaded.emit(document.getElementById('planSummary'));
            }, 5000);
        }

    }

    getSumOfJsonMap(json: Object = {}) {
        let sum = 0;
        for (let k in json) {
            if (json.hasOwnProperty(k)) {
                sum += json[k];
            }
        }
        return sum;
    }

    getSummeryInsurance() {
        let data = {
            clientId: this.clientId
        }
        this.isLoadingSummary = true;
        this.planService.getInsurancePlanningPlanSummary(data)
            .subscribe(res => {
                this.isLoadingSummary = false;
                this.insurancePlanList = []
                console.log(res, "values to see");
                if (!!res && res !== null) {
                    // this.insurancePlanList = res;
                    for (const [index, key] of Object.entries(res)) {
                        const element = res;
                        switch (index) {
                            case 'criticalIllness':
                                this.object = {
                                    'insuranceName': 'Critical illness',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543997/Insurance-summary-img/CIsmall.svg'
                                }
                                break;

                            case 'fireAndSpecialPerilsInsurance':
                                this.object = {
                                    'insuranceName': 'Fire insurance',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543997/Insurance-summary-img/FIsmall.svg'
                                }
                                break;

                            case 'healthInsurance':
                                this.object = {
                                    'insuranceName': 'Health insurance',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543999/Insurance-summary-img/Hsmall.svg'
                                }
                                break;
                            case 'homeInsurance':
                                this.object = {
                                    'insuranceName': 'Home insurance',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543999/Insurance-summary-img/Hsmall.svg'
                                }
                                break;
                            case 'life_insurance':
                                this.object = {
                                    'insuranceName': 'Life insurance',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543997/Insurance-summary-img/LIsmall.svg'
                                }
                                break;
                            case 'motorInsurance':
                                this.object = {
                                    'insuranceName': 'Motor insurance',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543997/Insurance-summary-img/MotorSmall.svg'
                                }
                                break;
                            case 'personalAccident':
                                this.object = {
                                    'insuranceName': 'Personal accident',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543998/Insurance-summary-img/PAsmall.svg'
                                }
                                break;
                            case 'travelInsurance':
                                this.object = {
                                    'insuranceName': 'Travel insurance',
                                    'amount': key,
                                    'img': 'https://res.cloudinary.com/futurewise/image/upload/v1613543997/Insurance-summary-img/TravelSmall.svg'
                                }
                                break;
                            default:
                                break;
                        }

                        this.insurancePlanList.push(this.object);

                    }

                    this.insurancePlanList = [...new Map(this.insurancePlanList.map(item => [item['insuranceName'], item])).values()];

                }
            }, err => {
                this.insurancePlanList = [];
                this.isLoadingSummary = false;
                console.error(err);
            })
        if (this.isLoadingCashFlow && this.isLoadingBudget && this.isLoadingGoals && this.isLoadingSummary) {
            this.cd.detectChanges();//to refresh the dom when response come
            setTimeout(() => {
                this.loaded.emit(document.getElementById('planSummary'));
            }, 5000);
        }
    }

    getListFamilyMem() {
        const obj = {
            clientId: this.clientId
        };
        this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
            data => {
                if (data) {
                    let array = [];
                    data.forEach(element => {
                        if (element.dateOfBirth) {
                            if (element.familyMemberId == 0) {
                                this.clientDob = this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd');
                            } else {
                                const obj = {
                                    'dob': this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd'),
                                    'id': element.familyMemberId
                                }
                                array.push(obj);
                            }
                        }
                    });
                    this.familyList = array.map(function (obj, ind) {
                        let val = obj.id;
                        obj[val] = obj['dob']
                        delete obj['dob'];
                        delete obj['id'];
                        return obj;
                    });

                }
                this.getCashflowData();
                this.getBudgetApis();
            }, err => {
                this.getCashflowData();
                this.getBudgetApis();
            }
        );
        if (this.isLoadingCashFlow && this.isLoadingBudget && this.isLoadingGoals && this.isLoadingSummary) {
            this.cd.detectChanges();//to refresh the dom when response come
            setTimeout(() => {
                this.loaded.emit(document.getElementById('planSummary'));
            }, 5000);
        }
    }

    getCashflowData() {
        this.isLoadingCashFlow = true;
        const obj = {
            advisorId: this.advisorId,
            clientId: this.clientId,
            startDate: this.startDate,
            endDate: this.endDate,
            clientDob: this.clientDob,
            fmDobList: JSON.stringify(this.familyList),
            idList: 0
        };
        this.planService.getCashFlow(obj).subscribe(
            data => {
                this.isLoadingCashFlow = false;
                if (data) {
                    console.log(data);
                    this.annualSurplus = 0;
                    this.cashFlowData = data;
                    this.cashFlowData.loanEmi = this.cashFlowData.loanEmi ? (this.cashFlowData.loanEmi).toFixed(2) : 0
                    this.cashFlowData.surplus = this.cashFlowData.surplus ? (this.cashFlowData.surplus).toFixed(2) : 0
                    console.log('cashFlowData', this.cashFlowData)
                    this.annualSurplus = this.cashFlowData.income - this.cashFlowData.expense;
                    let total = this.cashFlowData.income + this.cashFlowData.expense;
                    this.incomePercent = Math.floor((this.cashFlowData.income / total) * 100);
                    this.expensePercent = Math.floor((this.cashFlowData.expense / total) * 100);
                } else {
                    this.cashFlowData = '';
                }
            }, (error) => {

                // this.eventService.showErrorMessage(error);
                this.isLoadingCashFlow = false;
            }
        );
        if (this.isLoadingCashFlow && this.isLoadingBudget && this.isLoadingGoals && this.isLoadingSummary) {
            this.cd.detectChanges();//to refresh the dom when response come
            setTimeout(() => {
                this.loaded.emit(document.getElementById('planSummary'));
            }, 5000);
        }
    }

}

export interface PeriodicElement {
    details: string;
    value: string;
    month: string;
    lumpsum: string;
    imageUrl: string,
    year: string,
    goalFV: string,
    achievedValue: string,
    equity_monthly: string,
    debt_monthly: string,
    lump_equity: string,
    lump_debt: string,
    goalAssetAllocation: string,
    retirementTableValue: string,
    percentCompleted: string
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        details: '', value: '', month: '', lumpsum: '', imageUrl: '', year: '',
        goalFV: '', achievedValue: '', equity_monthly: '', debt_monthly: '', lump_equity: '', lump_debt: '',
        goalAssetAllocation: '', retirementTableValue: '', percentCompleted: ''
    }
];
