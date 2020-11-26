import { DynamicComponentService } from './../../../../../../../../services/dynamic-component.service';
import { SubscriptionInject } from './../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from './../../../../../../../../Data-service/event.service';
import { UtilService } from './../../../../../../../../services/util.service';
import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef, ViewChildren, QueryList, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInput, MAT_DATE_FORMATS } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CustomerService } from '../../../customer.service';
import { PlanService } from '../../../plan/plan.service';
import { ActiityService } from '../../actiity.service';

@Component({
  selector: 'app-suggest-advice',
  templateUrl: './suggest-advice.component.html',
  styleUrls: ['./suggest-advice.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class SuggestAdviceComponent implements OnInit, OnDestroy {
  adviceHeaderList: any;
  [x: string]: any;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  adviceSlider: Subscription;
  formStep: number = 1;
  componentRef;

  adviceForm: FormGroup = this.fb.group({
    "header": [, Validators.required],
    "rationale": [, Validators.required],
    "status": [, Validators.required],
    "givenOnDate": [, Validators.required],
    "implementDate": [, Validators.required],
    "withdrawalAmt": [, Validators.required],
    "consentOption": ['1', Validators.required],
  })
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @ViewChild('stepper', { static: true }) stepper;

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;
  childComponentFlag: any;
  clientId: any;
  advisorId: any;
  stringObj: any;
  objTopass: any;
  dataForEdit: any;
  flag: string;
  id: any;
  todayDate = new Date();

  constructor(
    private fb: FormBuilder,
    protected eventService: EventService,
    protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService,
    private utilService: UtilService,
    private datePipe: DatePipe,
    private custumService: CustomerService,
    private event: EventService,
    private planService: PlanService,
    private activityService: ActiityService
  ) { }

  inputData;

  ngOnInit() {
    console.log(this.inputData);
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.adviceSlider = this.subinject.newRightSliderDataObs.subscribe((data) => {
      console.log("suggest", data)
      if (data.childComponent) {
        this.componentRef = this.dynamicComponentService.addDynamicComponent(this.viewContainerRef, data.childComponent, data.childData);
        this.childComponentFlag = data.flag;
        this.adviceHeaderList = data.data.adviceHeaderList;
        this.getFormData(data);
      }
    });
  }
  dateChange(value) {
    let adviceHeaderDate = this.datePipe.transform(this.adviceForm.controls.givenOnDate.value, 'yyyy/MM/dd')
    console.log(adviceHeaderDate);
    let implementDate = this.datePipe.transform(this.adviceForm.controls.implementDate.value, 'yyyy/MM/dd')
    if (adviceHeaderDate && implementDate) {
      if (value == 'givenOnDate') {
        if (implementDate > adviceHeaderDate) {
          this.adviceForm.get('givenOnDate').setErrors(null);
        } else {
          this.adviceForm.get('givenOnDate').setErrors({ max: 'Date Issue' });
          this.adviceForm.get('givenOnDate').markAsTouched();
        }
      } else {
        if (implementDate > adviceHeaderDate) {
          this.adviceForm.get('implementDate').setErrors(null);
        } else {
          this.adviceForm.get('implementDate').setErrors({ max: 'Date of repayment' });
          this.adviceForm.get('implementDate').markAsTouched();
        }

      }
    }


  }
  ngOnDestroy() {
    this.adviceSlider.unsubscribe();
  }
  goBack() {
    this.stepper.previous();
    console.log(this.stepper.selectedIndex, "check selectedIndex");

  }
  getFormData(data) {
    if (data.data.adviceDetails == null) {
      data = {};
      this.dataForEdit = null;
      this.flag = 'Add';
    } else {
      this.dataForEdit = data.data ? data.data.adviceDetails : '';
      this.dataForEdit.adviceStatus = (this.dataForEdit ? (this.dataForEdit.adviceStatusId == 1 ? 'GIVEN' : this.dataForEdit.adviceStatusId == 2 ? 'AWAITING CONSENT' : this.dataForEdit.adviceStatusId == 3 ? 'ACCEPTED' : this.dataForEdit.adviceStatusId == 4 ? 'IN PROGRESS' : this.dataForEdit.adviceStatusId == 5 ? 'IMPLEMENTED' : this.dataForEdit.adviceStatusId == 6 ? 'DECLINED' : this.dataForEdit.adviceStatusId == 7 ? 'PENDING' : this.dataForEdit.adviceStatusId == 8 ? 'SYSTEM GENERATED' : this.dataForEdit.adviceStatusId == 9 ? 'REVISED' : '') : null)
      this.id = this.dataForEdit.id;
      this.flag = 'Edit';
    }
    this.adviceForm = this.fb.group({
      header: [this.dataForEdit ? this.dataForEdit.adviceId + '' : '', [Validators.required]],
      rationale: [(this.dataForEdit ? this.dataForEdit.adviceDescription : ''), [Validators.required]],
      status: [(this.dataForEdit ? this.dataForEdit.adviceStatus : 'GIVEN'), [Validators.required]],
      givenOnDate: [this.dataForEdit ? new Date(this.dataForEdit.adviceGivenDate) : new Date(), [Validators.required]],
      implementDate: [this.dataForEdit ? new Date(this.dataForEdit.applicableDate) : null, [Validators.required]],
      withdrawalAmt: [(this.dataForEdit ? this.dataForEdit.adviceAllotment : null)],
      consentOption: [this.dataForEdit ? (this.dataForEdit.consentOption ? this.dataForEdit.consentOption + '' : '1') : '1'],
    });
    // ==============owner-nominee Data ========================\\
    /***owner***/

  }
  addOrNextStep() {
    let componentRefFormValues;
    let componentRefComponentValues = this.componentRef._component;
    // proceed on creating new suggest
    if (this.adviceForm.invalid) {
      for (let element in this.adviceForm.controls) {
        console.log(element)
        if (this.adviceForm.get(element).invalid) {
          this.adviceForm.controls[element].markAsTouched();
        }
      }

    } else {
      this.stepper.next();
      console.log("this is what i need:::::::::::::::", componentRefComponentValues)

      switch (true) {
        case this.childComponentFlag === 'adviceGOLD' && componentRefComponentValues.gold.valid:
          componentRefFormValues = componentRefComponentValues.gold.value;
          const GoldObj = {
            approximatePurchaseValue: componentRefFormValues.appPurValue,
            gramsOrTola: componentRefFormValues.totalsGrams,
            purchasedGramsOrTola: componentRefFormValues.noTolasGramsPur,
            totalsGrams: componentRefFormValues.totalsGrams,
            purchaseYear: componentRefFormValues.tenure,
            carat: componentRefFormValues.carats,
            marketValue: (componentRefFormValues.marketValue == '') ? null : componentRefFormValues.marketValue,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, GoldObj)//for common data 
          this.custumService.getAdviceGold(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceOTHERS' && componentRefComponentValues.others.valid:
          componentRefFormValues = componentRefComponentValues.others.value;
          const OthersObj = { //for non duplicate data
            commodityTypeId: componentRefFormValues.typeOfCommodity,
            marketValue: componentRefFormValues.marketValue,
            purchaseValue: componentRefFormValues.purchaseValue,
            growthRate: componentRefFormValues.growthRate,
            dateOfPurchase: (componentRefFormValues.dateOfPurchase) ? this.datePipe.transform(componentRefFormValues.dateOfPurchase, 'yyyy-MM-dd') : null,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, OthersObj)//for common data and merge non duplicate data
          this.custumService.getAdviceOthers(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );

          break;
        case this.childComponentFlag === 'adviceCashInHand' && componentRefComponentValues.cashInHand.valid:
          componentRefFormValues = componentRefComponentValues.cashInHand.value;
          const CahsInHandObj = {
            balanceAsOn: this.datePipe.transform(componentRefFormValues.balanceAsOn, 'yyyy-MM-dd'),
            cashValue: componentRefFormValues.cashBalance,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, CahsInHandObj)//for common data and merge non duplicate data
          this.custumService.getAdviceCashInHand(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceBankAccount' && componentRefComponentValues.isFormValuesForAdviceValid():
          componentRefFormValues = componentRefComponentValues.bankAccounts.value;
          let bankAccArr = [];
          componentRefComponentValues.nomineesList.forEach(element => {
            let obj = {
              "name": element.controls.name.value,
              "sharePercentage": element.controls.sharePercentage.value,
              "id": (element.controls.id.value) ? element.controls.id.value : 0,
              "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
            }
            bankAccArr.push(obj)
          });
          componentRefFormValues.nominees = bankAccArr
          const bankAccObj = {
            accountType: componentRefFormValues.accountType,
            balanceAsOn: this.datePipe.transform(componentRefFormValues.balanceAsOn, 'yyyy-MM-dd'),
            bankName: componentRefFormValues.bankName,
            interestCompounding: componentRefFormValues.compound,
            interestRate: componentRefFormValues.interestRate,
            accountBalance: componentRefFormValues.accountBalance,
            accountNo: componentRefFormValues.bankAcNo,
            nominees: componentRefFormValues.nominees
          }
          this.stringObj = this.filterForObj(componentRefFormValues, bankAccObj)//for common data and merge non duplicate data
          this.custumService.getAdviceBankAccount(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'advicePPF' && componentRefComponentValues.isFormValuesForAdviceValid():
          componentRefFormValues = componentRefComponentValues.optionalppfSchemeForm.value;
          let ppfOptionalFormCopy = Object.assign({}, componentRefComponentValues.optionalppfSchemeForm.value);
          let nomineeListCopyPPF = componentRefComponentValues.nomineesList.slice();
          let transactionDataCopy = componentRefComponentValues.transactionData.slice();

          Object.keys(ppfOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyPPF.forEach(item => {
                arr.push(item.value);
              });
              ppfOptionalFormCopy[key] = arr;
            }
            {
              let arr = [];
              transactionDataCopy.forEach(item => {
                arr.push(item.value);
              });
              ppfOptionalFormCopy['publicprovidendfundtransactionlist'] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.ppfSchemeForm.value,
            ...ppfOptionalFormCopy
          }
          let ppfArry = [];
          componentRefComponentValues.nomineesList.forEach(element => {
            let obj = {
              "name": element.controls.name.value,
              "sharePercentage": element.controls.sharePercentage.value,
              "id": (element.controls.id.value) ? element.controls.id.value : 0,
              "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
            }
            ppfArry.push(obj)
          });
          componentRefFormValues.nominees = ppfArry
          let transactionData = [];
          componentRefComponentValues.transactionData.forEach(element => {
            let obj = {
              "date": element.controls.date.value._d,
              "amount": element.controls.amount.value,
              "type": element.controls.type.value
            }
            transactionData.push(obj)
          });
          componentRefFormValues.finalTransctList = transactionData
          const ppfObj = {
            "accountBalance": componentRefFormValues.accountBalance,
            "balanceAsOn": componentRefFormValues.balanceAsOn,
            "commencementDate": componentRefFormValues.commencementDate,
            "bankName": componentRefFormValues.bankName,
            "linkedBankAccount": componentRefFormValues.linkedBankAccount,
            "nominees": componentRefFormValues.nominees,
            "frequency": componentRefFormValues.frquency,
            "futureApproxcontribution": componentRefFormValues.futureContribution,
            "publicprovidendfundtransactionlist": componentRefFormValues.finalTransctList,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, ppfObj)//for common data and merge non duplicate data
          this.custumService.getAdvicePpf(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceNSC' && componentRefComponentValues.isFormValuesForAdviceValid():
          componentRefFormValues = componentRefComponentValues.nscFormField.value;
          let nscOptionalFormCopy = Object.assign({}, componentRefComponentValues.nscFormField.value);
          let nomineeListCopyNsc = componentRefComponentValues.nomineesList.slice();

          Object.keys(nscOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyNsc.forEach(item => {
                arr.push(item.value);
              });
              nscOptionalFormCopy[key] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.nscFormField.value,
            ...nscOptionalFormCopy
          }
          let nscArry = [];
          componentRefComponentValues.nomineesList.forEach(element => {
            let obj = {
              "name": element.controls.name.value,
              "sharePercentage": element.controls.sharePercentage.value,
              "id": (element.controls.id.value) ? element.controls.id.value : 0,
              "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
            }
            nscArry.push(obj)
          });
          componentRefFormValues.nominees = nscArry
          const nscObj = {
            "amountInvested": componentRefFormValues.amountInvested,
            "commencementDate": this.datePipe.transform(componentRefFormValues.commDate, 'yyyy-MM-dd'),
            "tenure": componentRefFormValues.Tenure,
            "certificateNumber": componentRefFormValues.cNo,
            "postOfficeBranch": componentRefFormValues.poBranch,
            "bankAccountNumber": componentRefFormValues.linkedBankAccount,
            "ownerTypeId": parseInt(componentRefFormValues.ownershipType),
            "nominees": componentRefFormValues.nominees,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, nscObj)//for common data and merge non duplicate data
          this.custumService.getAdviceNsc(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );

          break;
        case this.childComponentFlag === 'adviceSSY' && componentRefComponentValues.isFormValuesForAdviceValid():
          let ssyOptionalFormCopy = Object.assign({}, componentRefComponentValues.ssySchemeOptionalForm.value);
          let nomineeListCopySsy = componentRefComponentValues.nomineesList.slice();
          let transactionDataCopySsy = componentRefComponentValues.transactionData.slice();

          Object.keys(ssyOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopySsy.forEach(item => {
                arr.push(item.value);
              });
              ssyOptionalFormCopy[key] = arr;
            }
            {
              let arr = [];
              transactionDataCopySsy.forEach(item => {
                arr.push(item.value);
              });
              ssyOptionalFormCopy['ssyTransactionList'] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.ssySchemeForm.value,
            ...ssyOptionalFormCopy
          }
          const ssyObj = {
            "accountBalance": componentRefFormValues.accBalance,
            "balanceAsOn": componentRefFormValues.balanceAsOn,
            "commencementDate": componentRefFormValues.commDate,
            "bankName": componentRefFormValues.bankName,
            "linkedBankAccount": componentRefFormValues.linkedAcc,
            "agentName": componentRefFormValues.agentName,
            "guardianName": componentRefFormValues.guardian,
            "nominees": componentRefFormValues.nominees,
            "ssyFutureContributionList": [{
              "futureApproxContribution": componentRefFormValues.futureAppx,
              "frequency": componentRefFormValues.futureAppx,
            }],
            "ssyTransactionList": componentRefFormValues.ssyTransactionList,
            'familyMemberDob': this.datePipe.transform(componentRefComponentValues.DOB, 'dd/MM/yyyy')
          }
          this.stringObj = this.filterForObj(componentRefFormValues, ssyObj)//for common data and merge non duplicate data
          this.custumService.addSSYScheme(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceKVP' && componentRefComponentValues.isFormValuesForAdviceValid():
          componentRefFormValues = {
            ...componentRefComponentValues.KVPFormScheme.value,
            ...componentRefComponentValues.KVPOptionalFormScheme.value
          }
          const kvpObj = {
            "amountInvested": componentRefFormValues.amtInvested,
            "commencementDate": componentRefFormValues.commDate,
            "postOfficeBranch": componentRefFormValues.poBranch,
            "ownershipTypeId": componentRefFormValues.ownerType,
            "nominees": componentRefFormValues.nominees,
            "bankAccountNumber": componentRefFormValues.bankAccNum,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, kvpObj)//for common data and merge non duplicate data
          this.custumService.getAdviceKvp(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceSCSS' && componentRefComponentValues.isFormValuesForAdviceValid():
          let scssOptionalFormCopy = Object.assign({}, componentRefComponentValues.scssOptionalSchemeForm.value);
          let nomineeListCopyScss = componentRefComponentValues.nomineesList.slice();
          Object.keys(scssOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyScss.forEach(item => {
                arr.push(item.value);
              });
              scssOptionalFormCopy[key] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.scssSchemeForm.value,
            ...scssOptionalFormCopy
          }
          const scssObj = {
            id: 0,
            amountInvested: componentRefFormValues.amtInvested,
            commencementDate: componentRefFormValues.commDate,
            postOfficeBranch: componentRefFormValues.poBranch,
            bankAccountNumber: componentRefFormValues.bankAccNumber,
            ownerTypeId: componentRefFormValues.ownershipType,
            nominees: componentRefFormValues.nominees,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, scssObj)//for common data and merge non duplicate data
          this.custumService.getAdviceScss(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'advicePoSaving' && componentRefComponentValues.isFormValuesForAdviceValid():
          let posavingOptionalFormCopy = Object.assign({}, componentRefComponentValues.poSavingOptionalForm.value);
          let nomineeListCopyPosaving = componentRefComponentValues.nomineesList.slice();
          Object.keys(posavingOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyPosaving.forEach(item => {
                arr.push(item.value);
              });
              posavingOptionalFormCopy[key] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.poSavingForm.value,
            ...posavingOptionalFormCopy
          }
          const poSavingObj = {
            balanceAsOn: componentRefFormValues.balAsOn,
            accountBalance: componentRefFormValues.accBal,
            postOfficeBranch: componentRefFormValues.poBranch,
            ownerTypeId: componentRefFormValues.ownershipType,
            nominees: componentRefFormValues.nominees,
            acNumber: componentRefFormValues.bankAccNo,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, poSavingObj)//for common data and merge non duplicate data
          this.custumService.getAdvicePoSaving(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'advicePORD' && componentRefComponentValues.isFormValuesForAdviceValid():
          let pordOptionalFormCopy = Object.assign({}, componentRefComponentValues.PORDFormoptionalForm.value);
          let nomineeListCopyPord = componentRefComponentValues.nomineesList.slice();
          Object.keys(pordOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyPord.forEach(item => {
                arr.push(item.value);
              });
              pordOptionalFormCopy[key] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.PORDForm.value,
            ...pordOptionalFormCopy
          }
          const pordObj = {
            monthlyContribution: componentRefFormValues.monthlyContribution,
            commencementDate: componentRefFormValues.commDate,
            rdNumber: componentRefFormValues.rdNum,
            postOfficeBranch: componentRefFormValues.poBranch,
            nominees: componentRefFormValues.nominees,
            interestRate: componentRefFormValues.interestRate,
            ownerTypeId: componentRefFormValues.ownership,
            interestCompounding: componentRefFormValues.compound,
            linkedBankAccount: componentRefFormValues.linkedBankAcc,
            isActive: 1,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, pordObj)//for common data and merge non duplicate data
          this.custumService.getAdvicePord(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'advicePOTD' && componentRefComponentValues.isFormValuesForAdviceValid():
          let potdOptionalFormCopy = Object.assign({}, componentRefComponentValues.POTDOptionalForm.value);
          let nomineeListCopyPotd = componentRefComponentValues.nomineesList.slice();
          Object.keys(potdOptionalFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyPotd.forEach(item => {
                arr.push(item.value);
              });
              potdOptionalFormCopy[key] = arr;
            }
          });
          componentRefFormValues = {
            ...componentRefComponentValues.POTDForm.value,
            ...potdOptionalFormCopy
          }
          const potdObj = {
            "amountInvested": componentRefFormValues.amtInvested,
            "commencementDate": componentRefFormValues.commDate,
            "tenure": componentRefFormValues.tenure,
            "postOfficeBranch": componentRefFormValues.poBranch,
            "ownerTypeId": componentRefFormValues.ownershipType,
            "nominees": componentRefFormValues.nominees,
            "tdNumber": componentRefFormValues.tdNum,
            "bankAccountNumber": componentRefFormValues.bankAccNum,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, potdObj)//for common data and merge non duplicate data
          this.custumService.getAdvicePotd(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'advicePOMIS' && componentRefComponentValues.pomisForm.valid:
          let pomisFormCopy = Object.assign({}, componentRefComponentValues.pomisForm.value);
          let nomineeListCopyPomis = componentRefComponentValues.nomineesList.slice();
          Object.keys(pomisFormCopy).map(function (key) {
            if (key == 'nominees') {
              let arr = [];
              nomineeListCopyPomis.forEach(item => {
                arr.push(item.value);
              });
              pomisFormCopy[key] = arr;
            }
          });
          componentRefFormValues = pomisFormCopy;
          const pomisObj = {
            id: componentRefFormValues.id,
            amountInvested: componentRefFormValues.amtInvested,
            commencementDate: componentRefFormValues.commencementdate,
            postOfficeBranch: componentRefFormValues.poBranch,
            bankAccountNumber: componentRefFormValues.accNumber,
            ownerTypeId: componentRefFormValues.ownershipType,
            nominees: componentRefFormValues.nominees,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, pomisObj)//for common data and merge non duplicate data
          this.custumService.getAdvicePomis(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceEPF' && componentRefComponentValues.epf.valid:
          componentRefFormValues = componentRefComponentValues.epf.value
          const epfObj = {
            ownerList: componentRefFormValues.getCoOwnerName,
            employeesMonthlyContribution: componentRefFormValues.employeeContry,
            employersMonthlyContribution: componentRefFormValues.employerContry,
            annualSalaryGrowthRate: componentRefFormValues.annualSalGrowth,
            currentEpfBalance: componentRefFormValues.currentEPFBal,
            maturityYear: componentRefFormValues.maturityYear,
            balanceAsOnDate: this.datePipe.transform(componentRefFormValues.balanceAsOn, 'yyyy-MM-dd'),
            epfNo: componentRefFormValues.EPFNo,
            bankAccountNumber: componentRefFormValues.bankAcNo,
            nomineeList: componentRefFormValues.getNomineeName,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, epfObj)//for common data and merge non duplicate data
          this.custumService.getAdviceEpf(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceNPSSummary' && componentRefComponentValues.summaryNPS.valid:
          componentRefFormValues = componentRefComponentValues.summaryNPS.value;
          const npsSummaryObj = {
            ownerList: componentRefFormValues.getCoOwnerName,
            valueAsOn: this.datePipe.transform(componentRefFormValues.valueAsOn, 'yyyy-MM-dd'),
            currentValuation: componentRefFormValues.currentValue,
            contributionAmount: componentRefFormValues.totalContry,
            pran: componentRefFormValues.pran,
            schemeChoice: componentRefFormValues.schemeChoice,
            futureContributionList: componentRefFormValues.futureContributionList.value,
            nomineeList: componentRefFormValues.getNomineeName,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, npsSummaryObj)//for common data and merge non duplicate data
          this.custumService.getAdviceNps(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceNPSSchemeHolding' && componentRefComponentValues.schemeHoldingsNPS.valid:
          componentRefFormValues = componentRefComponentValues.schemeHoldingsNPS.value;
          const npsHoldingObj = {
            ownerList: componentRefFormValues.getCoOwnerName,
            pran: componentRefFormValues.pran,
            holdingList: componentRefFormValues.holdingList,
            futureContributionList: componentRefFormValues.futureContributionList,
            nomineeList: componentRefFormValues.getNomineeName,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, npsHoldingObj)//for common data and merge non duplicate data
          this.custumService.getAdviceNps(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceGratuity' && componentRefComponentValues.gratuity.valid:
          componentRefFormValues = componentRefComponentValues.gratuity.value;
          const gratuityObj = {
            yearsCompleted: componentRefFormValues.noOfcompleteYrs,
            amountReceived: componentRefFormValues.amountRecived,
            organizationName: componentRefFormValues.nameOfOrg,
            yearOfReceipt: componentRefFormValues.yearOfReceipt,
            reasonOfReceipt: componentRefFormValues.resonOfRecipt,
            bankAccountNumber: componentRefFormValues.bankAcNo,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, gratuityObj)//for common data and merge non duplicate data
          this.custumService.getAdviceGratuity(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceSuperAnnuation' && componentRefComponentValues.superannuation.valid:
          componentRefFormValues = componentRefComponentValues.superannuation.value;
          const superannuationObj = {
            annualEmployeeContribution: componentRefFormValues.employeeContry,
            annualEmployerContribution: componentRefFormValues.employerContry,
            growthRateEmployeeContribution: componentRefFormValues.growthEmployee,
            growthRateEmployerContribution: componentRefFormValues.growthEmployer,
            firstContributionDate: this.datePipe.transform(componentRefFormValues.firstDateContry, 'yyyy-MM-dd'),
            assumedRateOfReturn: componentRefFormValues.assumedRateReturn,
            bankAccountNumber: componentRefFormValues.linkBankAc,
            description: componentRefFormValues.description,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, superannuationObj)//for common data and merge non duplicate data
          this.custumService.getAdviceSuperannuation(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceEPS' && componentRefComponentValues.eps.valid:
          componentRefFormValues = componentRefComponentValues.eps.value;
          const epsObj = {
            commencementDate: componentRefFormValues.commencementDate,
            pensionAmount: componentRefFormValues.pensionAmount,
            pensionPayoutFrequencyId: componentRefFormValues.pensionPayFreq,
            linkedBankAccount: componentRefFormValues.bankAcNo,
            description: componentRefFormValues.description,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, epsObj)//for common data and merge non duplicate data
          this.custumService.getAdviceEps(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceRealEstate' && componentRefComponentValues.addrealEstateForm.valid:
          componentRefFormValues = componentRefComponentValues.addrealEstateForm.value;
          const realEstate = {
            ownerList: componentRefFormValues.getCoOwnerName,
            id: componentRefFormValues.id,
            typeId: componentRefFormValues.type,
            marketValue: componentRefFormValues.marketValue,
            purchasePeriod: (componentRefFormValues.purchasePeriod) ? componentRefFormValues.purchasePeriod.toISOString().slice(0, 10) : null,
            purchaseValue: componentRefFormValues.purchaseValue,
            unitId: 1,
            ratePerUnit: componentRefFormValues.ratePerUnit,
            stampDutyCharge: componentRefFormValues.stampDuty,
            registrationCharge: componentRefFormValues.registration,
            gstCharge: componentRefFormValues.gst,
            location: componentRefFormValues.location,
            nomineeList: componentRefFormValues.getNomineeName
          }
          this.stringObj = this.filterForObj(componentRefFormValues, realEstate)//for common data and merge non duplicate data
          this.custumService.getAdviceRealEstate(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceFixedDeposit' && componentRefComponentValues.fixedDeposit.valid:
          componentRefFormValues = componentRefComponentValues.fixedDeposit.value;
          const fixedObj = {
            ownerList: componentRefFormValues.getCoOwnerName,
            amountInvested: componentRefFormValues.amountInvest,
            interestRate: componentRefFormValues.interestRate,
            commencementDate: this.datePipe.transform(componentRefFormValues.commencementDate, 'yyyy-MM-dd'),
            institutionName: componentRefFormValues.institution,
            frequencyOfPayoutPerYear: componentRefFormValues.compound == '' ? componentRefFormValues.frequencyOfPayoutPerYear : componentRefFormValues.compound,
            // maturityDate: this.datePipe.transform(componentRefFormValues.maturityDate, 'yyyy-MM-dd'),
            interestPayoutOption: componentRefFormValues.payOpt,
            bankAcNumber: componentRefFormValues.bankACNo,
            fdNumber: componentRefFormValues.fdNo,
            fdType: componentRefFormValues.FDType,
            interestCompoundingId: componentRefFormValues.compound == "" ? 0 : componentRefFormValues.compound,
            tenureInYear: componentRefFormValues.tenureY,
            tenureInMonth: componentRefFormValues.tenureM,
            tenureInDay: componentRefFormValues.tenureD,
            fdEndDateIn: componentRefFormValues.maturity,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, fixedObj)//for common data and merge non duplicate data
          this.custumService.getAdviceFd(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceRecurringDeposit' && componentRefComponentValues.isFormValuesForAdviceValid():
          let arrRecurringDep = [];
          let recurringDepositCopy = Object.assign({}, componentRefComponentValues.recuringDeposit.value);
          componentRefComponentValues.nomineesList.forEach(element => {
            let obj = {
              "name": element.controls.name.value,
              "sharePercentage": element.controls.sharePercentage.value,
              "id": (element.controls.id.value) ? element.controls.id.value : 0,
              "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
            }
            arrRecurringDep.push(obj)
          });
          recurringDepositCopy['nominees'] = arrRecurringDep;
          componentRefFormValues = recurringDepositCopy;
          const rdObj = {
            ownerList: componentRefFormValues.getCoOwnerName,
            monthlyContribution: componentRefFormValues.monthlyContribution,
            interestRate: componentRefFormValues.interestRate,
            commencementDate: this.datePipe.transform(componentRefFormValues.commencementDate, 'yyyy-MM-dd'),
            linkedBankAccount: componentRefFormValues.linkBankAc,
            tenure: componentRefFormValues.tenure,
            maturityDate: componentRefFormValues.maturityDate,
            bankName: componentRefFormValues.bankName,
            rdNumber: componentRefFormValues.rdNo,
            interestCompounding: componentRefFormValues.compound,
            nomineeList: componentRefFormValues.getNomineeName,
            id: componentRefFormValues.id
          }
          this.stringObj = this.filterForObj(componentRefFormValues, rdObj)//for common data and merge non duplicate data
          this.custumService.getAdviceRd(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceBonds' && componentRefComponentValues.isFormValuesForAdviceValid():
          let arr = [];
          let bondsFormCopy = Object.assign({}, componentRefComponentValues.bonds.value);
          componentRefComponentValues.nomineesList.forEach(element => {
            let obj = {
              "name": element.controls.name.value,
              "sharePercentage": element.controls.sharePercentage.value,
              "id": (element.controls.id.value) ? element.controls.id.value : 0,
              "familyMemberId": (element.controls.familyMemberId.value) ? element.controls.familyMemberId.value : 0
            }
            arr.push(obj)
          });
          bondsFormCopy['nominees'] = arr;
          componentRefFormValues = bondsFormCopy;
          const bondObj = {
            ownerList: componentRefFormValues.getCoOwnerName,
            amountInvested: componentRefFormValues.amountInvest,
            bondName: componentRefFormValues.bondName,
            couponPayoutFrequencyId: componentRefFormValues.couponOption,
            couponRate: componentRefFormValues.interestRate,
            commencementDate: this.datePipe.transform(componentRefFormValues.commencementDate, 'yyyy-MM-dd'),
            rateOfReturn: componentRefFormValues.rateReturns,
            linkedBankAccount: componentRefFormValues.linkBankAc,
            tenure: componentRefFormValues.tenure,
            type: componentRefFormValues.type,
            compounding: componentRefFormValues.compound,
            id: componentRefFormValues.id,
            nomineeList: componentRefFormValues.getNomineeName,
          }
          this.stringObj = this.filterForObj(componentRefFormValues, bondObj)//for common data and merge non duplicate data
          this.custumService.getAdviceRd(this.objTopass).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
        case this.childComponentFlag === 'adviceAssetStock' && componentRefComponentValues.assetForm.valid:
          componentRefFormValues = componentRefComponentValues.assetForm.value;
          break;
        case this.childComponentFlag === 'Advice Insurance' && componentRefComponentValues.lifeInsuranceForm.valid:
          componentRefFormValues = componentRefComponentValues.lifeInsuranceForm.value;
          let keyDetail = componentRefComponentValues.keyDetailsForm;
          let cashFlowForm = componentRefComponentValues.cashFlowForm;
          let ulipFundDetails = [];
          const ulipFundVal = keyDetail.get('fundValueForm') as FormArray;
          ulipFundVal.controls.forEach(element => {
            if (element.get('fundName').value) {
              const obj = {
                id: (element.get('id').value) ? element.get('id').value : null,
                insuranceId: (this.editInsuranceData) ? this.editInsuranceData.id : null,
                equityRatio: (element.get('equityPer').value) ? element.get('equityPer').value : null,
                debtRatio: (element.get('debtPer').value) ? element.get('debtPer').value : null,
                fundValue: (element.get('fundValue').value) ? element.get('fundValue').value : null,
                nav: (element.get('nav').value) ? element.get('nav').value : null,
                units: (element.get('units').value) ? element.get('units').value : null,
                fundValueOrNav: (element.get('option').value) ? element.get('option').value : null,
                fundName: (element.get('fundName').value) ? element.get('fundName').value : null
              };
              ulipFundDetails.push(obj);
            } else {
              ulipFundDetails = [];
            }

          });
          const finalCashFlowList = [];
          const cashFlowArray = cashFlowForm.get('cashFlow') as FormArray;
          cashFlowArray.controls.forEach(element => {
            if (element.get('cashFlowType').value || element.get('year').value || element.get('approxAmt').value) {
              const obj = {
                cashFlowType: element.get('cashFlowType').value,
                cashFlowYear: this.datePipe.transform(element.get('year').value, 'yyyy-MM-dd'),
                cashFlowApproxAmount: element.get('approxAmt').value
              };
              finalCashFlowList.push(obj);
            }
          });
          const insuranceObj = {
            familyMemberIdLifeAssured: (componentRefFormValues.getCoOwnerName[0].userType == 2) ? componentRefFormValues.getCoOwnerName[0].clientId : componentRefFormValues.getCoOwnerName[0].familyMemberId,
            // "familyMemberIdLifeAssured": this.familyMemberLifeData.id,
            familyMemberIdProposer: (componentRefComponentValues.selectedProposerData) ? (componentRefComponentValues.selectedProposerData.familyMemberId == 0 ? this.clientId : componentRefComponentValues.selectedProposerData.familyMemberId) : null,
            clientId: this.clientId,
            advisorId: this.advisorId,
            ownerName: '',
            commencementDate: this.datePipe.transform(componentRefFormValues.commencementDate, 'yyyy-MM-dd'),
            policyNumber: componentRefComponentValues.lifeInsuranceForm.get('policyNum').value,
            policyName: componentRefComponentValues.lifeInsuranceForm.get('policyName').value,
            sumAssured: parseInt(componentRefComponentValues.lifeInsuranceForm.get('sumAssured').value),
            policyStatusId: componentRefComponentValues.lifeInsuranceForm.get('policyStatus').value,
            lastUnpaidPremium: this.datePipe.transform(componentRefComponentValues.lifeInsuranceForm.get('policyStatusLastUnpaid').value, 'yyyy-MM-dd'),
            premiumAmount: parseInt(componentRefComponentValues.lifeInsuranceForm.get('premiumDetailsAmount').value),
            frequency: componentRefComponentValues.lifeInsuranceForm.get('premiumDetailsFrequency').value,
            policyTenure: componentRefComponentValues.lifeInsuranceForm.get('tenureDetailsPolicy').value,
            premiumPayingTerm: componentRefComponentValues.lifeInsuranceForm.get('premiumPayingTerm').value,
            riskCover: componentRefComponentValues.keyDetailsForm.get('riskCover').value,
            surrenderValue: componentRefComponentValues.keyDetailsForm.get('surrenderName').value,
            nominee: componentRefComponentValues.keyDetailsForm.get('nomineeName').value,
            vestedBonus: componentRefComponentValues.keyDetailsForm.get('vestedBonus').value,
            assumedRate: componentRefComponentValues.keyDetailsForm.get('assumedRate').value,
            loanAvailable: componentRefComponentValues.loanDetailsForm.get('loanAvailable').value,
            loanTaken: parseInt(componentRefComponentValues.loanDetailsForm.get('loanTaken').value),
            // "loanTakenOn": (this.loanDetailsForm.get('loanTakenOn').value) ? this.datePipe.transform(this.loanDetailsForm.get('loanTakenOn').value, 'yyyy-MM-dd') : null,
            loanTakenOn: componentRefComponentValues.loanDetailsForm.get('loanTakenOn').value,
            premiumPaymentMode: componentRefComponentValues.Miscellaneous.get('permiumPaymentMode').value,
            advisorName: componentRefComponentValues.Miscellaneous.get('advisorName').value,
            serviceBranch: componentRefComponentValues.Miscellaneous.get('serviceBranch').value,
            linkedBankAccountId: componentRefComponentValues.Miscellaneous.get('bankAccount').value,
            policyId: componentRefComponentValues.policyData.id ? componentRefComponentValues.policyData.id : null,
            policyTypeId: componentRefComponentValues.policyData.policyTypeId ? componentRefComponentValues.policyData.policyTypeId : null,
            insuranceTypeId: componentRefComponentValues.insuranceTypeId,
            insuranceSubTypeId: componentRefComponentValues.insuranceSubTypeId,
            ridersAccidentalBenifits: parseInt(componentRefComponentValues.ridersForm.get('accidentalBenefit').value),
            ridersDoubleAccidentalBenefit: parseInt(componentRefComponentValues.ridersForm.get('doubleAccidental').value),
            ridersTermWaiver: componentRefComponentValues.ridersForm.get('termWaiver').value,
            ridersCriticalIllness: parseInt(componentRefComponentValues.ridersForm.get('criticalIlleness').value),
            ridersPremiumWaiver: componentRefComponentValues.ridersForm.get('premiumWaiver').value,
            ridersFemaleCriticalIllness: componentRefComponentValues.ridersForm.get('femaleCriticalIlleness').value,
            insuranceCashflowList: finalCashFlowList,
            nominees: componentRefComponentValues.keyDetailsForm.value.getNomineeName,
            ulipFundDetails: ulipFundDetails,
            realOrFictitious: 2,

          }
          insuranceObj.policyStatusId = parseInt(insuranceObj.policyStatusId);
          if (insuranceObj.nominees.length > 0) {
            insuranceObj.nominees.forEach((element, index) => {
              if (element.name == '') {
                // this.removeNewNominee(index);
                insuranceObj.nominees = [];
              }
            });
          } else {
            insuranceObj.nominees = [];
          }
          const stringObj = {
            adviceDescription: this.adviceForm.get('rationale').value,
            insuranceCategoryTypeId: 42,
            suggestedFrom: 1,
            adviceId: this.adviceForm.get('header').value,
            adviceAllotment: this.adviceForm.get('withdrawalAmt').value,
            clientId: AuthService.getClientId(),
            advisorId: AuthService.getAdvisorId(),
            adviseCategoryTypeMasterId: 2,
            adviceGivenDate: this.datePipe.transform(this.adviceForm.get('givenOnDate').value, 'yyyy-MM-dd'),
            applicableDate: this.datePipe.transform(this.adviceForm.get('implementDate').value, 'yyyy-MM-dd')
          }

          // this.stringObj = this.filterForObj(componentRefFormValues, insuranceObj)//for common data and merge non duplicate data
          // const assign = Object.assign(insuranceObj, stringObj);//merge both data
          let objToSend = Object.assign(stringObj, { stringObject: insuranceObj });
          this.activityService.suggestNewLifeInsurance(objToSend).subscribe(
            data => this.getAdviceRes(data),
            err => this.event.openSnackBar(err, "Dismiss")
          );
          break;
      }

      console.log(this.adviceForm);
      // if (componentRefFormValues) {
      //   this.stringObj = this.filterForObj(componentRefFormValues)
      //   this.removeObj(this.stringObj);

      // }

      this.objTopass = {
        adviceHeader: this.adviceForm.controls.header.value,
        clientId: this.clientId,
        adviceId: 1,
        advisorId: this.advisorId,
        assetCategoryTypeId: 14,
        applicableDate: this.datePipe.transform(this.adviceForm.controls.implementDate.value, 'yyyy-MM-dd'),
        givenDate: this.datePipe.transform(this.adviceForm.controls.givenOnDate.value, 'yyyy-MM-dd'),
        adviceDescription: this.adviceForm.controls.rationale.value,
        status: this.adviceForm.controls.status.value,
        consentOption: this.adviceForm.controls.consentOption.value,
        withdrawAmount: this.adviceForm.controls.withdrawalAmt.value,
      }
    }

    const bothFormValues = {
      ...this.adviceForm.value,
      ...componentRefFormValues
    }

    console.log("this is form value::::::::::::", bothFormValues);

  }
  filterForObj(data, mergeData) {
    const stringObject = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      familyMemberId: (data.familyMemberId) ? data.familyMemberId : null,
      ownerName: data.ownerName,
      description: data.description
    }
    const assign = Object.assign(mergeData, stringObject);//merge both data
    Object.assign(this.objTopass, { stringObject: assign });
    return assign;
  }
  getAdviceRes(data) {
    console.log(data)
    this.dialogClose();
  }
  dialogClose() {
    this.subinject.changeNewRightSliderState({ state: 'close' });
  }
}
