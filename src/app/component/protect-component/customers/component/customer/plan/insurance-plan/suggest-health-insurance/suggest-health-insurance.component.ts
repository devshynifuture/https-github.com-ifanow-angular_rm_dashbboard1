import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { MatInput, MatDialog } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth-service/authService';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { PlanService } from '../../plan.service';
import { SummaryPlanServiceService } from '../../summary-plan/summary-plan-service.service';

@Component({
    selector: 'app-suggest-health-insurance',
    templateUrl: './suggest-health-insurance.component.html',
    styleUrls: ['./suggest-health-insurance.component.scss']
})
export class SuggestHealthInsuranceComponent implements OnInit {
    barButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Save',
        buttonColor: 'accent',
        barColor: 'accent',
        raised: true,
        stroked: false,
        mode: 'determinate',
        value: 10,
        disabled: false,
        fullWidth: false,
        // buttonIcon: {
        //   fontIcon: 'favorite'
        // }
    };
    maxDate = new Date();
    minDate = new Date();
    inputData: any;
    ownerName: any;
    nomineesListFM: any = [];
    accountList: any = [];
    familyMemberId: any;
    advisorId: any;
    clientId: any;
    insuranceId: any;
    addMoreFlag = false;
    FamilyMember: any;
    ProposerData: any;
    familyMemberLifeData: any;
    nominees: any[];
    flag: string;
    ownerData: any;
    callMethod: any;
    healthInsuranceForm: any;
    displayList: any;
    nomineesList: any[] = [];
    policyList: any;
    addOns: any;
    dataForEdit: any;
    bankList: any;
    bankAccountDetails: any;
    id: any;
    validatorType = ValidatorType;
    @ViewChildren(MatInput) inputs: QueryList<MatInput>;
    showSumAssured = false;
    showinsuredMemberSum = true;
    showDeductibleSum = false;
    insuredMemberList: any;
    options: any;
    showInsurance: any;
    suggestPolicy: any;
    storeData: string;
    showRecommendation = false;
    @Output() sendOutput = new EventEmitter<any>();
    recommendOrNot;
    insuranceData = [{
        value: '1',
        header: 'Add Health Insurance',
        smallHeading: 'health insurance',
        insuranceType: 5,
        logo: '/assets/images/svg/helth-insurance.svg',
        heading: 'Health insurance',
        subHeading: 'Select how you???d like to proceed with planning for health insurance policies.'
    }, {
        value: '2',
        logo: '/assets/images/svg/Criticalillness.svg',
        header: 'Add Critical Illness',
        smallHeading: 'critical illness',
        insuranceType: 6,
        heading: 'Critical illness',
        subHeading: 'Select how you???d like to proceed with planning for critical insurance policies.'
    }, {
        value: '3',
        logo: '/assets/images/svg/Cancercare.svg',
        header: 'Add Cancer Care',
        smallHeading: 'cancer care',
        insuranceType: 11,
        heading: 'Cancer care',
        subHeading: 'Select how you???d like to proceed with planning for cancer insurance policies.'
    }, {
        value: '4',
        logo: '/assets/images/svg/Personalaccident.svg',
        header: 'Add Personal Accident',
        heading: 'Personal accident',
        smallHeading: 'personal accident',
        insuranceType: 7,
        subHeading: 'Select how you???d like to proceed with planning for personal insurance policies.'
    }, {
        value: '5',
        logo: '/assets/images/svg/Householders.svg',
        header: 'Add Householders',
        smallHeading: 'householders',
        insuranceType: 9,
        heading: 'Householders',
        subHeading: 'Select how you???d like to proceed with planning for householders insurance policies.'
    }, {
        value: '6',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Fire Insurance',
        smallHeading: 'fire insurance',
        insuranceType: 10,
        heading: 'Fire insurance',
        subHeading: 'Select how you???d like to proceed with planning for fire insurance policies.'
    }, {
        value: '7',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Travel Insurance',
        smallHeading: 'travel insurance',
        insuranceType: 8,
        heading: 'Travel insurance',
        subHeading: 'Select how you???d like to proceed with planning for travel insurance policies.'
    }, {
        value: '8',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Motor Insurance',
        smallHeading: 'motor insurance',
        insuranceType: 4,
        heading: 'Motor insurance',
        subHeading: 'Select how you???d like to proceed with planning for motor insurance policies.'
    }, {
        value: '9',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Other Insurance',
        smallHeading: 'other insurance',
        insuranceType: 11,
        heading: 'Other insurance',
        subHeading: 'Select how you???d like to proceed with planning for other insurance policies.'
    }]
    insuranceType: number;
    plannerNotes: any;
    ownerIds = [];
    insData: any;
    isRecommended: boolean;
    adviceName: any;
    obj1: any;
    adviceData: any;
    cateIdObj: any;
    adviceDetails: any;
    showHeader: any;
    fakeData: any;
    constructor(private summaryPlanService: SummaryPlanServiceService, private planService: PlanService, private enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService, private dialog: MatDialog) { }

    ngOnInit() {
        console.log('heder', this.inputData)
        this.insuranceData.forEach(element => {
            if (element.value == this.inputData.value) {
                this.showInsurance = element
                this.insuranceType = element.insuranceType
            }
        });
        this.bankList = this.enumService.getBank();
        this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    }

    saveData(data) {
        this.plannerNotes = data;
    }
    checkRecommendation(value) {
        if (value) {
            this.showRecommendation = true;
        } else {
            this.showRecommendation = false;
        }
    }
    get data() {
        return this.inputData;
    }

    @Input() set data(data) {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId();
        this.insData = data;
        this.inputData = data.inputData;
        this.policyList = data.displayList.policyTypes;
        this.addOns = data.displayList.addOns;
        this.adviceDetails = data.adviceDetails ? data.adviceDetails : null;
        this.adviceName = data.adviceNameObj ? data.adviceNameObj.adviceName : null;
        this.adviceData = data.adviceStringObj ? data.adviceStringObj : null;
        this.showHeader = data.flag
        this.getFamilyMemberList();
        this.recommendOrNot = data.recommendOrNot;
        if (this.adviceName == 'Port policy') {
            this.changeAdviceName(data)
        } else {
            this.getdataForm(data);
        }
        // this.setInsuranceDataFormField(data);
        console.log(data);
    }
    changeAdviceName(data) {
        this.adviceName = data.adviceName ? data.adviceName : this.adviceName;
        this.fakeData = this.insData.data ? this.insData.data : this.fakeData;
        if (this.adviceName == 'Port policy') {
            this.nomineesListFM = [];
            this.insData.data = null
        } else {
            this.insData.data = this.fakeData;
        }
        this.adviceName == 'Port policy' ? this.insData.data = null : '';
        this.getdataForm(this.insData);
    }
    /***owner***/
    get getCoOwner() {
        return this.healthInsuranceForm.get('getCoOwnerName') as FormArray;
    }

    get insuredMembersForm() {
        return this.healthInsuranceForm.get('InsuredMemberForm') as FormArray;
    }

    /***nominee***/

    get getNominee() {
        return this.healthInsuranceForm.get('getNomineeName') as FormArray;
    }

    // bankAccountList(value) {
    //     this.bankList = value;
    // }

    getFormDataNominee(data) {
        console.log(data);
        this.nomineesList = data.controls;
    }

    display(value) {
        console.log('value selected', value);
        this.ownerName = value.userName;
        // this.familyMemberId = value.id
        this.familyMemberId = value.familyMemberId;

    }

    lisNominee(value) {
        this.ownerData.Fmember = value;
        this.nomineesListFM = Object.assign([], value);
        this.insuredMemberList = Object.assign([], value);
        this.insuredMemberList.forEach(item => item.isDisabled = false);

    }

    // getFamilyMember(data, index) {
    //     this.familyMemberLifeData = data;
    //     console.log('family Member', this.FamilyMember);
    // }

    disabledMember(value, type) {
        this.callMethod = {
            methodName: 'disabledMember',
            ParamValue: value,
            disControl: type
        };
    }

    displayControler(con) {
        console.log('value selected', con);
        if (con.owner != null && con.owner) {
            this.healthInsuranceForm.controls.getCoOwnerName = con.owner;
        }
        if (con.nominee != null && con.nominee) {
            this.healthInsuranceForm.controls.getNomineeName = con.nominee;
        }
    }

    // get addBankAccount() {
    //   return this.healthInsuranceForm.get('addBankAccount') as FormArray;
    // }
    findCompanyName(data) {
        const inpValue = this.healthInsuranceForm.get('insurerName').value;
        this.customerService.getCompanyNames(inpValue).subscribe(
            data => {
                console.log(data);
                this.options = data;
                if (data.length > 0) {
                    this.options = data;
                } else {
                    this.healthInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
                    this.healthInsuranceForm.get('insurerName').markAsTouched();
                }
            },
            err => {
                this.healthInsuranceForm.controls.insurerName.setErrors({ erroInPolicy: true });
                this.healthInsuranceForm.get('insurerName').markAsTouched();
            }
        );
    }

    getBank() {
        if (this.enumService.getBank().length > 0) {
            this.bankList = this.enumService.getBank();
        }
        else {
            this.bankList = [];
        }
        console.log(this.bankList, "this.bankList2");
    }

    openDialog(eventData): void {
        const dialogRef = this.dialog.open(LinkBankComponent, {
            width: '50%',
            data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
        });

        dialogRef.afterClosed().subscribe(result => {
            setTimeout(() => {
                this.bankList = this.enumService.getBank();
            }, 5000);
        })

    }
    onChangeJointOwnership(data) {
        this.callMethod = {
            methodName: 'onChangeJointOwnership',
            ParamValue: data
        };
    }

    addNewCoOwner(data) {
        this.getCoOwner.push(this.fb.group({
            name: [data ? data.name : '', [Validators.required]],
            share: [data ? data.share : ''],
            familyMemberId: [data ? data.familyMemberId : 0],
            id: [data ? data.id : 0],
            isClient: [data ? data.isClient : 0],
            clientId: [data ? data.clientId : 0],
            userType: [data ? data.userType : 0]

        }));
        if (data) {
            setTimeout(() => {
                this.disabledMember(null, null);
            }, 1300);
        }

        if (this.getCoOwner.value.length > 1 && !data) {
            let share = 100 / this.getCoOwner.value.length;
            for (let e in this.getCoOwner.controls) {
                if (!Number.isInteger(share) && e == '0') {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
                } else {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
                }
            }
        }

    }

    /***owner***/

    removeCoOwner(item) {
        this.getCoOwner.removeAt(item);
        if (this.healthInsuranceForm.value.getCoOwnerName.length == 1) {
            this.getCoOwner.controls['0'].get('share').setValue('100');
        } else {
            let share = 100 / this.getCoOwner.value.length;
            for (let e in this.getCoOwner.controls) {
                if (!Number.isInteger(share) && e == '0') {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
                } else {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
                }
            }
        }
        this.disabledMember(null, null);
    }

    removeNewNominee(item) {
        this.disabledMember(null, null);
        this.getNominee.removeAt(item);
        if (this.healthInsuranceForm.value.getNomineeName.length == 1) {
            this.getNominee.controls['0'].get('sharePercentage').setValue('100');
        } else {
            let share = 100 / this.getNominee.value.length;
            for (let e in this.getNominee.controls) {
                if (!Number.isInteger(share) && e == '0') {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
                } else {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
                }
            }
        }
    }


    addNewNominee(data) {
        this.getNominee.push(this.fb.group({
            name: [data ? data.name : ''],
            sharePercentage: [data ? data.sumInsured : 0],
            familyMemberId: [data ? data.familyMemberId : 0],
            id: [data ? data.id : 0],
            isClient: [data ? data.isClient : 0],
            relationshipId: [data ? data.relationshipId : 0]
        }));
        if (!data || this.getNominee.value.length < 1) {
            for (let e in this.getNominee.controls) {
                this.getNominee.controls[e].get('sharePercentage').setValue(0);
            }
        }

        if (this.getNominee.value.length > 1 && !data) {
            let share = 100 / this.getNominee.value.length;
            for (let e in this.getNominee.controls) {
                if (!Number.isInteger(share) && e == '0') {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
                } else {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
                }
            }
        }


    }
    showDeductible() {
        if (this.healthInsuranceForm.get('planDetails').value == '1' || this.healthInsuranceForm.get('planDetails').value == '2') {
            this.showDeductibleSum = true;
        } else {
            this.showDeductibleSum = false;
        }
    }
    onChangeSetErrorsType(value, formName) {
        if (value == 8) {
            this.showSumAssured = true
            this.showinsuredMemberSum = false
            let list = this.healthInsuranceForm.get('InsuredMemberForm') as FormArray;
            list.controls.forEach(element => {
                element.get('sumAssured').setValue(null);
                if (element.get('sumAssured').value == '' || element.get('sumAssured').value == null) {
                    element.get('sumAssured').setErrors(null);
                    element.get('sumAssured').setValidators(null);
                }
            });
            if (!this.healthInsuranceForm.controls['sumAssuredIdv'].value) {
                this.healthInsuranceForm.controls['sumAssuredIdv'].setValue(null);
                this.healthInsuranceForm.get('sumAssuredIdv').setValidators([Validators.required]);
                this.healthInsuranceForm.get('sumAssuredIdv').updateValueAndValidity();
                this.healthInsuranceForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
            }
        } else {
            this.showSumAssured = false
            this.showinsuredMemberSum = true
            this.healthInsuranceForm.controls['sumAssuredIdv'].setValue(null);
            this.healthInsuranceForm.controls['sumAssuredIdv'].setErrors(null);
            this.healthInsuranceForm.controls['sumAssuredIdv'].setValidators(null);
        }
    }

    onChangeSetErrors(value, formName) {
        if (value != 0 && formName == 'planDetails') {
            if (!this.healthInsuranceForm.controls['deductibleAmt'].value) {
                this.healthInsuranceForm.controls['deductibleAmt'].setValue(null);
                this.healthInsuranceForm.get('deductibleAmt').setValidators([Validators.required]);
                this.healthInsuranceForm.get('deductibleAmt').updateValueAndValidity();
                this.healthInsuranceForm.controls['deductibleAmt'].setErrors({ 'required': true });
            }
        } else {
            this.healthInsuranceForm.controls['deductibleAmt'].setValue(null);
            this.healthInsuranceForm.controls['deductibleAmt'].setErrors(null);
            this.healthInsuranceForm.get('deductibleAmt').setValidators(null);
        }
    }
    getOwnerData(value, data) {

        data.forEach(element => {
            for (const e in this.getCoOwner.controls) {
                const name = this.getCoOwner.controls[e].get('name');
                if (element.userName == name.value) {
                    this.getCoOwner.controls[e].get('name').setValue(element.userName);
                    this.getCoOwner.controls[e].get('familyMemberId').setValue(element.id);
                    this.getCoOwner.controls[e].get('clientId').setValue(element.clientId);
                    this.getCoOwner.controls[e].get('userType').setValue(element.userType);

                }
            }

        });



    }
    getdataForm(data) {
        this.dataForEdit = data.data;
        if (data.data == null) {
            data = {};
            this.dataForEdit = data.data;
            this.flag = 'Add';
        } else {
            this.dataForEdit = data.data;
            this.id = this.dataForEdit.id;
            if (this.dataForEdit.addOns && this.dataForEdit.addOns.length > 0) {
                this.addOns.addOnId = this.dataForEdit.addOns[0].addOnId;
                this.addOns.addOnSumInsured = this.dataForEdit.addOns[0].addOnSumInsured;
            }
            this.flag = 'Edit';
            if (this.dataForEdit) {
                this.storeData = this.dataForEdit.suggestion;
                this.isRecommended = this.dataForEdit ? (this.dataForEdit.isRecommend ? true : false) : false
                this.showRecommendation = this.isRecommended;
            }
        }
        this.healthInsuranceForm = this.fb.group({
            // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
            getCoOwnerName: this.fb.array([this.fb.group({
                name: ['', [Validators.required]],
                share: [0,],
                familyMemberId: null,
                id: 0,
                isClient: 0,
                clientId: 0,
                userType: 0
            })]),
            name: [(this.dataForEdit ? this.dataForEdit.name : null)],
            PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId + '' : ''), [Validators.required]],
            planDetails: [(this.dataForEdit ? this.dataForEdit.policyFeatureId + '' : null), [Validators.required]],
            deductibleAmt: [(this.dataForEdit ? this.dataForEdit.deductibleSumInsured : null), [Validators.required]],
            // policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
            insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
            planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
            premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
            // policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
            // policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
            copay: [(this.dataForEdit ? this.dataForEdit.copay : null)],
            copayType: [this.dataForEdit ? this.dataForEdit.copayRupeesOrPercent + '' : '1'],
            cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
            bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : '1'],
            exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
            inceptionDate: [(this.dataForEdit) ? ((this.dataForEdit.policyInceptionDate) ? new Date(this.dataForEdit.policyInceptionDate) : null) : null],
            tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
            advisorName: [this.dataForEdit ? this.dataForEdit.advisorName : null],
            serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch : null],
            bankAccount: [this.dataForEdit ? parseInt(this.dataForEdit.linkedBankAccount) : null],
            additionalCovers: [(this.dataForEdit) ? this.addOns.addOnId + '' : null],
            sumAssuredIdv: [(this.dataForEdit) ? this.dataForEdit.sumInsuredIdv : null, [Validators.required]],
            coversAmount: [(this.dataForEdit) ? this.addOns.addOnSumInsured : null],
            nominees: this.nominees,
            getNomineeName: this.fb.array([this.fb.group({
                name: [''],
                sharePercentage: [0],
                familyMemberId: [0],
                id: [0],
                relationshipId: [0]
            })]),
            InsuredMemberForm: this.fb.array([this.fb.group({
                insuredMembers: ['', [Validators.required]],
                sumAssured: ['', [Validators.required]],
                id: null,
                familyMemberId: [''],
                relationshipId: [''],
                clientId: [''],
                userType: [''],
                name: ['']
            })]),
            // addBankAccount: this.fb.array([this.fb.group({
            //   newBankAccount: [''],
            // })])
        });
        // ==============owner-nominee Data ========================\\
        /***owner***/
        if (this.healthInsuranceForm.value.getCoOwnerName.length == 1) {
            this.getCoOwner.controls['0'].get('share').setValue('100');
        }
        // this.addBankAccount.removeAt(0);

        // if (this.dataForEdit && this.dataForEdit.ownerList) {
        //   this.getCoOwner.removeAt(0);
        //   this.dataForEdit.ownerList.forEach(element => {
        //     this.addNewCoOwner(element);
        //   });
        // }

        if (this.dataForEdit) {
            this.getCoOwner.removeAt(0);
            const data = {
                name: this.dataForEdit.policyHolderName,
                familyMemberId: this.dataForEdit.policyHolderId
            };
            this.addNewCoOwner(data);
        }

        /***owner***/

        /***nominee***/
        if (this.dataForEdit) {
            if (this.dataForEdit.nominees && this.dataForEdit.nominees.length > 0) {
                this.getNominee.removeAt(0);
                this.dataForEdit.nominees.forEach(element => {
                    this.addNewNominee(element);
                });
            }
        }
        /***nominee***/
        if (this.dataForEdit) {
            if (this.dataForEdit.insuredMembers && this.dataForEdit.insuredMembers.length > 0) {
                this.insuredMembersForm.removeAt(0);
                this.dataForEdit.insuredMembers.forEach(element => {
                    this.addTransaction(element);
                });
            }
        }
        if (this.dataForEdit) {
            if (this.dataForEdit.insuredMembers && this.dataForEdit.insuredMembers.length > 0) {
                this.dataForEdit.insuredMembers.forEach(element => {
                    if (element.sumInsured == 0) {
                        this.showinsuredMemberSum = false
                    }
                });
            }
        }

        if (this.healthInsuranceForm.get('PlanType').value == '8') {
            this.showSumAssured = true;
        } else {
            this.showSumAssured = false;
        }
        if (this.healthInsuranceForm.get('planDetails').value != '0') {
            this.showDeductibleSum = true;
        } else {
            this.showDeductibleSum = false;
        }

        this.ownerData = { Fmember: this.nomineesListFM, controleData: this.healthInsuranceForm };
        this.bankAccountDetails = { accountList: this.accountList, controleData: this.healthInsuranceForm };

        // this.finalCashFlowData = [];
        // ==============owner-nominee Data ========================\\
        // this.DOB = data.dateOfBirth
        // this.ownerData = this.healthInsuranceForm.controls;
        // this.familyMemberId = data.familyMemberId;
    }


    dateChange(value, form, formValue) {
        if (form == 'policyExpiryDate' && formValue) {
            let startDate = new Date(this.healthInsuranceForm.controls.policyStartDate.value);
            let policyExpiryDate = this.datePipe.transform(this.healthInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
            let comparedDate: any = startDate;
            comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
            comparedDate = new Date(comparedDate);
            comparedDate = comparedDate.setDate(comparedDate.getDate() - 1);
            comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
            if (policyExpiryDate < comparedDate) {
                this.healthInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
                this.healthInsuranceForm.get('policyExpiryDate').markAsTouched();
            } else {
                this.healthInsuranceForm.get('policyExpiryDate').setErrors();
            }
        } else {
            if (formValue) {
                let policyExpiryDate = this.datePipe.transform(this.healthInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
                let policyStartDate = this.datePipe.transform(this.healthInsuranceForm.controls.policyStartDate.value, 'yyyy/MM/dd')

                if (policyStartDate >= policyExpiryDate) {
                    this.healthInsuranceForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
                    this.healthInsuranceForm.get('policyExpiryDate').markAsTouched();
                } else {
                    this.healthInsuranceForm.get('policyExpiryDate').setErrors();

                }
            }
        }

    }
    changeSign(event, value, formValue) {
        this.healthInsuranceForm.get(value).setValue('');
        if (event == '2') {
            if (parseInt(formValue) > 100) {
                this.healthInsuranceForm.get(value).setValue('');
            }
        }
    }

    changeTheInput(form1, form2, event) {
        if (form1 == '2') {
            if (parseInt(event.target.value) > 100) {
                this.healthInsuranceForm.get(form2).setValue('100');
            }
        } else {
            this.healthInsuranceForm.get(form2).setValue(event.target.value);
        }

    }

    getFamilyData(data) {
        if (data) {
            data.forEach(element => {
                for (let e in this.insuredMembersForm.controls) {
                    let name = this.insuredMembersForm.controls[e].get('insuredMembers');
                    if (element.userName == name.value) {
                        this.insuredMembersForm.controls[e].get('insuredMembers').setValue(element.userName);
                        this.insuredMembersForm.controls[e].get('familyMemberId').setValue(element.familyMemberId);
                        this.insuredMembersForm.controls[e].get('relationshipId').setValue(element.relationshipId);
                        this.insuredMembersForm.controls[e].get('clientId').setValue(element.clientId);
                        this.insuredMembersForm.controls[e].get('userType').setValue(element.userType);
                        this.insuredMembersForm.controls[e].get('name').setValue(element.name);
                        element.isDisabled = true;

                    }
                }

            });
        }

    }

    addTransaction(data) {
        this.insuredMembersForm.push(this.fb.group({
            insuredMembers: [data ? data.name : '', [Validators.required]],
            sumAssured: [data ? data.sumInsured : '', [Validators.required]],
            id: [data ? data.id : ''],
            relationshipId: [data ? data.relationshipId : ''],
            familyMemberId: [data ? data.familyMemberId : ''],
            clientId: [data ? data.clientId : ''],
            userType: [data ? data.userType : ''],
            name: [data ? data.name : '']

        }));
        this.resetValue(this.insuredMemberList);
        this.getFamilyData(this.insuredMemberList);
        this.onChangeSetErrorsType(this.healthInsuranceForm.get('PlanType').value, 'planType')
    }

    removeTransaction(item) {
        let finalMemberList = this.healthInsuranceForm.get('InsuredMemberForm') as FormArray;
        if (finalMemberList.length > 1) {
            this.insuredMembersForm.removeAt(item);

        }
        this.resetValue(this.insuredMemberList);
        this.getFamilyData(this.insuredMemberList);

    }
    resetValue(data) {
        if (data) {
            data.forEach(item => item.isDisabled = false);
        }
    }

    // addNewAccount(data) {
    //   this.addBankAccount.push(this.fb.group({
    //     newBankAccount: [data ? data.name : ''],
    //   }));
    // }

    // RemoveNewAccount(item) {
    //     this.addBankAccount.removeAt(item);
    // }
    /***owner***/

    openOptionField() {
        (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
    }

    getFamilyMemberList() {
        const obj = {
            advisorId: this.advisorId,
            clientId: this.clientId,
        };
        this.customerService.getListOfFamilyByClient(obj).subscribe(
            data => this.getFamilyMemberListRes(data)
        );
    }

    getFamilyMemberListRes(data) {
        console.log(data);
        this.FamilyMember = data.familyMembersList;
        this.ProposerData = Object.assign([], data.familyMembersList);
        console.log('Proposer data', this.ProposerData);
    }
    getClientId() {
        this.nomineesListFM.forEach(element => {
            for (const e in this.getCoOwner.controls) {
                const id = this.getCoOwner.controls[e].get('familyMemberId');
                if (element.familyMemberId == id.value) {
                    this.getCoOwner.controls[e].get('name').setValue(element.userName);
                    this.getCoOwner.controls[e].get('familyMemberId').setValue(element.id);
                    this.getCoOwner.controls[e].get('clientId').setValue(element.clientId);
                    this.getCoOwner.controls[e].get('userType').setValue(element.userType);

                }
            }

        });
    }
    preventDefault(e) {
        e.preventDefault();
    }
    getPolicyHolderName() {
        let name;
        let id;
        id = (this.healthInsuranceForm.value.getCoOwnerName[0].userType == 2) ? this.healthInsuranceForm.value.getCoOwnerName[0].clientId : this.healthInsuranceForm.value.getCoOwnerName[0].familyMemberId
        if (this.clientId == id) {
            id = 0
        }
        this.nomineesListFM.forEach(element => {
            if (element.id == id) {
                name = element.name
            }
        });
        return name;
    }
    saveHealthInsurance() {
        this.cateIdObj = this.summaryPlanService.getCategoryId(this.insuranceType);
        this.getClientId();
        let policyHolerName = this.getPolicyHolderName();
        let memberList = [];
        let suggestNewData;
        let finalMemberList = this.healthInsuranceForm.get('InsuredMemberForm') as FormArray;
        finalMemberList.controls.forEach(element => {
            let obj =
            {
                familyMemberId: element.get('userType').value == 2 ? element.get('clientId').value : element.get('familyMemberId').value,
                sumInsured: element.get('sumAssured').value,
                relationshipId: element.get('relationshipId').value,
                insuredOrNominee: 1,
                id: (element.get('id').value) ? element.get('id').value : null,
                name: element.get('name').value
            };
            memberList.push(obj);
        });
        this.healthInsuranceForm.get('inceptionDate').setErrors(null);
        if (this.healthInsuranceForm.invalid) {
            this.healthInsuranceForm.markAllAsTouched();
        } else {
            this.barButtonOptions.active = true;
            const obj = {
                'clientId': this.clientId,
                'advisorId': this.advisorId,
                'policyHolderId': (this.healthInsuranceForm.value.getCoOwnerName[0].userType == 2) ? this.healthInsuranceForm.value.getCoOwnerName[0].clientId : this.healthInsuranceForm.value.getCoOwnerName[0].familyMemberId,
                'policyHolderName': this.dataForEdit ? this.dataForEdit.policyHolderName : policyHolerName,
                // 'policyStartDate': this.datePipe.transform(this.healthInsuranceForm.get('policyStartDate').value, 'yyyy-MM-dd'),
                // 'policyExpiryDate': this.datePipe.transform(this.healthInsuranceForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
                'cumulativeBonus': this.healthInsuranceForm.get('cumulativeBonus').value,
                'cumulativeBonusRupeesOrPercent': this.healthInsuranceForm.get('bonusType').value,
                'policyTypeId': this.healthInsuranceForm.get('PlanType').value,
                'deductibleSumInsured': this.healthInsuranceForm.get('deductibleAmt').value,
                'exclusion': this.healthInsuranceForm.get('exclusion').value,
                'copay': this.healthInsuranceForm.get('copay').value,
                'planName': this.healthInsuranceForm.get('planeName').value,
                // 'policyNumber': this.healthInsuranceForm.get('policyNum').value,
                'copayRupeesOrPercent': this.healthInsuranceForm.get('copayType').value,
                'tpaName': this.healthInsuranceForm.get('tpaName').value,
                'advisorName': this.healthInsuranceForm.get('advisorName').value,
                'serviceBranch': this.healthInsuranceForm.get('serviceBranch').value,
                'linkedBankAccount': this.healthInsuranceForm.get('bankAccount').value,
                'insurerName': this.healthInsuranceForm.get('insurerName').value,
                'policyInceptionDate': this.datePipe.transform(this.healthInsuranceForm.get('inceptionDate').value, 'yyyy-MM-dd'),
                'insuranceSubTypeId': this.insuranceType,
                'premiumAmount': this.healthInsuranceForm.get('premium').value,
                'policyFeatureId': this.healthInsuranceForm.get('planDetails').value,
                'sumInsuredIdv': this.healthInsuranceForm.get('sumAssuredIdv').value,
                'id': (this.id) ? this.id : null,
                'addOns': [],
                'realOrFictitious': 2,
                'suggestion': this.plannerNotes,
                'isRecommend': this.showRecommendation ? 1 : 0,
                insuredMembers: memberList,
                nominees: this.healthInsuranceForm.value.getNomineeName,
            };
            if (this.healthInsuranceForm.get('additionalCovers').value && this.healthInsuranceForm.get('coversAmount').value) {
                obj.addOns = [{
                    'addOnId': (this.healthInsuranceForm.get('additionalCovers').value),
                    'addOnSumInsured': this.healthInsuranceForm.get('coversAmount').value
                }];
            }
            if (obj.insuredMembers.length > 0) {
                obj.insuredMembers.forEach(element => {
                    if (element.sumInsured == '') {
                        element.sumInsured = null
                    }
                });
            }
            if (obj && obj.hasOwnProperty('insuredMembers') && obj.insuredMembers.length > 0) {
                obj.insuredMembers.forEach(ele => {
                    this.ownerIds.push({
                        'ownerId': ele.familyMemberId == this.clientId ? 0 : ele.familyMemberId
                    })
                });
            } else {
                this.ownerIds.push({
                    'ownerId': obj.policyHolderId == this.clientId ? 0 : obj.policyHolderId
                })
            }
            if (obj.nominees.length > 0) {
                obj.nominees.forEach((element, index) => {
                    if (element.name == '') {
                        this.removeNewNominee(index);
                    }
                });
                obj.nominees = this.healthInsuranceForm.value.getNomineeName;
                obj.nominees.forEach(element => {
                    if (element.sharePercentage) {
                        element.sumInsured = element.sharePercentage;
                    }
                    element.insuredOrNominee = 2;
                });
            } else {
                obj.nominees = [];
            }
            console.log(obj);


            if (this.dataForEdit && !this.adviceName) {
                this.planService.editGenralInsurancePlan(obj).subscribe(
                    data => {
                        this.barButtonOptions.active = false;
                        console.log(data);
                        this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
                        const insuranceData =
                        {
                            insuranceTypeId: this.inputData.insuranceTypeId,
                            insuranceSubTypeId: this.insuranceType,
                            id: data ? data : null
                        };
                        this.close(insuranceData, true);
                    }
                );
            }
            else if (this.adviceName) {
                let advDetails = this.dataForEdit ? this.dataForEdit.adviceDetails : this.adviceDetails
                this.obj1 = {
                    stringObject: obj,
                    adviceDescription: this.adviceData ? this.adviceData.adviceDescription : (advDetails ? advDetails.advice_description : ''),
                    insuranceCategoryTypeId: this.cateIdObj.insuranceCategoryTypeId,
                    adviseCategoryTypeMasterId: this.cateIdObj.adviseCategoryTypeMasterId,
                    suggestedFrom: 1,
                    adviceId: this.adviceData ? this.adviceData.adviceId : (advDetails ? advDetails.gen_insurance_advice_id : ''),
                    adviceAllotment: this.adviceData ? parseInt(this.adviceData.adviceAllotment) : '',
                    realOrFictitious: 1,
                    clientId: AuthService.getClientId(),
                    advisorId: AuthService.getAdvisorId(),
                    applicableDate: this.adviceData ? new Date(this.adviceData.applicableDate) : advDetails ? new Date(advDetails.applicable_date) : '',
                }
                this.close(this.obj1, true);
            }
            else {
                this.planService.addGenralInsurancePlan(obj).subscribe(
                    data => {
                        console.log(data);
                        if (this.inputData.flag == 'ExistingSuggestNew') {
                            const obj = {
                                "id": this.inputData.id,
                                "insuranceIds": JSON.stringify([data])
                            }
                            this.planService.updateCurrentPolicyGeneralInsurance(obj).subscribe(
                                data => {
                                    this.barButtonOptions.active = false;
                                    console.log(data);
                                    const insuranceData =
                                    {
                                        insuranceTypeId: suggestNewData ? suggestNewData : this.inputData.insuranceTypeId,
                                        insuranceSubTypeId: this.insuranceType,
                                        id: data ? data : null
                                    };
                                    this.eventService.openSnackBar('Added successfully!', 'Dismiss');
                                    this.close(insuranceData, true);
                                },
                                err => {
                                    this.eventService.openSnackBar(err, 'Dismiss');
                                }
                            );
                        } else {
                            let obj = {
                                "planningList":
                                    JSON.stringify({
                                        "advisorId": this.advisorId,
                                        "clientId": this.clientId,
                                        "insuranceType": this.insuranceType,
                                        "owners": this.ownerIds
                                    }),
                                "needAnalysis": JSON.stringify([data])
                            }
                            this.planService.addGeneralInsurance(obj).subscribe(
                                data => {
                                    this.barButtonOptions.active = false;
                                    suggestNewData = data;
                                    //   this.barButtonOptions.active = false;
                                    //   this.subInjectService.changeNewRightSliderState({ state: 'close' ,refreshRequired: true});
                                    console.log(data);
                                    const insuranceData =
                                    {
                                        insuranceTypeId: suggestNewData ? suggestNewData : this.inputData.insuranceTypeId,
                                        insuranceSubTypeId: this.insuranceType,
                                        id: data ? data : null
                                    };
                                    this.eventService.openSnackBar('Added successfully!', 'Dismiss');
                                    this.close(insuranceData, true);
                                },
                                err => {
                                    this.eventService.openSnackBar(err, 'Dismiss');
                                }
                            );
                        }
                    },
                    err => {
                        this.close('', true);
                    }
                );
            }
        }
    }

    close(data, flag) {
        if (data.id) {
            this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
            this.sendOutput.emit(data);
        } else {
            if (data.flag == 'SuggestNew') {
                this.sendOutput.emit(false);
            } else {
                this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
            }
        }
    }
}
