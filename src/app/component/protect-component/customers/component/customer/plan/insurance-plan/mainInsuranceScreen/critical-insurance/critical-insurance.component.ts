import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList, Input } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { ValidatorType } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { PlanService } from '../../../plan.service';

@Component({
    selector: 'app-critical-insurance',
    templateUrl: './critical-insurance.component.html',
    styleUrls: ['./critical-insurance.component.scss']
})
export class CriticalInsuranceComponent implements OnInit {
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
    recommendOrNot;
    maxDate = new Date();
    minDate = new Date();
    addMoreFlag = false;
    advisorId: any;
    clientId: any;
    inputData: any;
    addOns: any;
    policyList: any;
    nomineesList: any[] = [];
    familyMemberId: any;
    ownerName: any;
    ownerData: any;
    nomineesListFM: any = [];
    familyMemberLifeData: any;
    callMethod: any;
    critialIllnessForm: any;
    dataForEdit: any;
    nominees: any[];
    flag: string;
    FamilyMember: any;
    ProposerData: any;
    id: any;
    bankAccountDetails: { accountList: any; controleData: any; };
    accountList: any;
    bankList: any;
    showinsuredMemberSum = true;
    showSumAssured = false;
    insuredMemberList: any;
    options: any;

    storeData: string;
    showInsurance: any;
    insuranceType: any;
    showRecommendation: boolean;
    @Output() sendOutput = new EventEmitter<any>();
    insuranceData = [{
        value: '1',
        header: 'Add Health Insurance',
        smallHeading: 'health insurance',
        insuranceType: 5,
        logo: '/assets/images/svg/helth-insurance.svg',
        heading: 'Health insurance',
        subHeading: 'Select how you’d like to proceed with planning for health insurance policies.'
    }, {
        value: '2',
        logo: '/assets/images/svg/Criticalillness.svg',
        header: 'Add Critical Illness',
        smallHeading: 'critical illness',
        insuranceType: 6,
        heading: 'Critical illness',
        subHeading: 'Select how you’d like to proceed with planning for critical insurance policies.'
    }, {
        value: '3',
        logo: '/assets/images/svg/Cancercare.svg',
        header: 'Add Cancer Care',
        smallHeading: 'cancer care',
        insuranceType: 11,
        heading: 'Cancer care',
        subHeading: 'Select how you’d like to proceed with planning for cancer insurance policies.'
    }, {
        value: '4',
        logo: '/assets/images/svg/Personalaccident.svg',
        header: 'Add Personal Accident',
        heading: 'Personal accident',
        smallHeading: 'personal accident',
        insuranceType: 7,
        subHeading: 'Select how you’d like to proceed with planning for personal insurance policies.'
    }, {
        value: '5',
        logo: '/assets/images/svg/Householders.svg',
        header: 'Add Householders',
        smallHeading: 'householders',
        insuranceType: 9,
        heading: 'Householders',
        subHeading: 'Select how you’d like to proceed with planning for householders insurance policies.'
    }, {
        value: '6',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Fire Insurance',
        smallHeading: 'fire insurance',
        insuranceType: 10,
        heading: 'Fire insurance',
        subHeading: 'Select how you’d like to proceed with planning for fire insurance policies.'
    }, {
        value: '7',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Travel Insurance',
        smallHeading: 'travel insurance',
        insuranceType: 8,
        heading: 'Travel insurance',
        subHeading: 'Select how you’d like to proceed with planning for travel insurance policies.'
    }, {
        value: '8',
        logo: '/assets/images/svg/Fireinsurance.svg',
        header: 'Add Motor Insurance',
        smallHeading: 'motor insurance',
        insuranceType: 4,
        heading: 'Motor insurance',
        subHeading: 'Select how you’d like to proceed with planning for motor insurance policies.'
    }]
    plannerNotes: any;
    ownerIds = [];
    insData: any;
    isRecommended: boolean;


    constructor(private planService: PlanService, private enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService, private dialog: MatDialog) { }
    validatorType = ValidatorType
    @ViewChildren(MatInput) inputs: QueryList<MatInput>;

    @Input() set data(data) {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId();
        this.insData = data;
        this.inputData = data.inputData;
        this.policyList = data.displayList.policyTypes;
        this.addOns = data.displayList.addOns;
        this.getFamilyMemberList();
        this.getdataForm(data)
        // this.setInsuranceDataFormField(data);
        console.log(data);
    }
    get data() {
        return this.inputData;
    }

    getFormDataNominee(data) {
        console.log(data)
        this.nomineesList = data.controls
    }

    ngOnInit() {
        this.storeData = '';
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
    display(value) {
        console.log('value selected', value)
        this.ownerName = value.userName;
        this.familyMemberId = value.familyMemberId
    }

    lisNominee(value) {
        this.ownerData.Fmember = value;
        this.nomineesListFM = Object.assign([], value);
        this.insuredMemberList = Object.assign([], value);
        this.insuredMemberList.forEach(item => item.isDisabled = false);
    }
    // getFamilyMember(data, index) {
    //   this.familyMemberLifeData = data;
    // }


    disabledMember(value, type) {
        this.callMethod = {
            methodName: "disabledMember",
            ParamValue: value,
            disControl: type
        }
    }

    displayControler(con) {
        console.log('value selected', con);
        if (con.owner != null && con.owner) {
            this.critialIllnessForm.controls.getCoOwnerName = con.owner;
        }
        if (con.nominee != null && con.nominee) {
            this.critialIllnessForm.controls.getNomineeName = con.nominee;
        }
    }

    onChangeJointOwnership(data) {
        this.callMethod = {
            methodName: "onChangeJointOwnership",
            ParamValue: data
        }
    }

    /***owner***/
    get insuredMembersForm() {
        return this.critialIllnessForm.get('InsuredMemberForm') as FormArray;
    }
    get getCoOwner() {
        return this.critialIllnessForm.get('getCoOwnerName') as FormArray;
    }

    addNewCoOwner(data) {
        this.getCoOwner.push(this.fb.group({
            name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0], clientId: [data ? data.clientId : 0], userType: [data ? data.userType : 0]
        }));
        if (data) {
            setTimeout(() => {
                this.disabledMember(null, null);
            }, 1300);
        }

        if (this.getCoOwner.value.length > 1 && !data) {
            let share = 100 / this.getCoOwner.value.length;
            for (let e in this.getCoOwner.controls) {
                if (!Number.isInteger(share) && e == "0") {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
                }
                else {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
                }
            }
        }

    }

    removeCoOwner(item) {
        this.getCoOwner.removeAt(item);
        if (this.critialIllnessForm.value.getCoOwnerName.length == 1) {
            this.getCoOwner.controls['0'].get('share').setValue('100');
        } else {
            let share = 100 / this.getCoOwner.value.length;
            for (let e in this.getCoOwner.controls) {
                if (!Number.isInteger(share) && e == "0") {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
                }
                else {
                    this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
                }
            }
        }
        this.disabledMember(null, null);
    }
    /***owner***/

    /***nominee***/

    get getNominee() {
        return this.critialIllnessForm.get('getNomineeName') as FormArray;
    }

    removeNewNominee(item) {
        this.disabledMember(null, null);
        this.getNominee.removeAt(item);
        if (this.critialIllnessForm.value.getNomineeName.length == 1) {
            this.getNominee.controls['0'].get('sharePercentage').setValue('100');
        } else {
            let share = 100 / this.getNominee.value.length;
            for (let e in this.getNominee.controls) {
                if (!Number.isInteger(share) && e == "0") {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
                }
                else {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
                }
            }
        }
    }



    addNewNominee(data) {
        this.getNominee.push(this.fb.group({
            name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0], relationshipId: [data ? data.relationshipId : 0]
        }));
        if (!data || this.getNominee.value.length < 1) {
            for (let e in this.getNominee.controls) {
                this.getNominee.controls[e].get('sharePercentage').setValue(0);
            }
        }

        if (this.getNominee.value.length > 1 && !data) {
            let share = 100 / this.getNominee.value.length;
            for (let e in this.getNominee.controls) {
                if (!Number.isInteger(share) && e == "0") {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
                }
                else {
                    this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
                }
            }
        }


    }

    getdataForm(data) {
        this.dataForEdit = data.data;
        if (data.data == null) {
            data = {};
            this.dataForEdit = data.data;
            this.flag = "Add";
        }
        else {
            this.dataForEdit = data.data;
            this.id = this.dataForEdit.id;
            if (this.dataForEdit.addOns.length > 0) {
                this.addOns.addOnId = this.dataForEdit.addOns[0].addOnId;
                this.addOns.addOnSumInsured = this.dataForEdit.addOns[0].addOnSumInsured;
            }
            this.flag = "Edit";
            if (this.dataForEdit) {
                this.storeData = this.dataForEdit.suggestion;
                this.isRecommended = this.dataForEdit ? (this.dataForEdit.isRecommend ? true : false) : false
                this.showRecommendation = this.isRecommended;
            }
        }
        this.critialIllnessForm = this.fb.group({
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
            // policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
            insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
            planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
            premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
            // policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
            // policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
            cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
            bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : '1'],
            // additionalCovers: [this.dataForEdit ? this.addOns.addOnId + '' : null],
            coversAmount: [this.dataForEdit ? this.addOns.addOnSumInsured + '' : null],
            exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
            // inceptionDate: [this.dataForEdit ? new Date(this.dataForEdit.policyInceptionDate) : null],
            inceptionDate: [(this.dataForEdit) ? ((this.dataForEdit.policyInceptionDate) ? new Date(this.dataForEdit.policyInceptionDate) : null) : null],
            tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : null],
            advisorName: [this.dataForEdit ? this.dataForEdit.advisorName : null],
            serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch : null],
            bankAccount: [this.dataForEdit ? parseInt(this.dataForEdit.linkedBankAccount) : null],
            sumAssuredIdv: [(this.dataForEdit) ? this.dataForEdit.sumInsuredIdv : null, [Validators.required]],
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
                sumAssured: [null, [Validators.required]],
                id: null,
                familyMemberId: [''],
                relationshipId: [''],
                clientId: [''],
                userType: ['']

            })])
        })
        // ==============owner-nominee Data ========================\\
        /***owner***/
        if (this.critialIllnessForm.value.getCoOwnerName.length == 1) {
            this.getCoOwner.controls['0'].get('share').setValue('100');
        }

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
            }
            this.addNewCoOwner(data);
        }

        /***owner***/

        /***nominee***/
        if (this.dataForEdit) {
            if (this.dataForEdit.nominees.length > 0) {
                this.getNominee.removeAt(0);
                this.dataForEdit.nominees.forEach(element => {
                    this.addNewNominee(element);
                });
            }
        }
        /***nominee***/
        if (this.dataForEdit) {
            if (this.dataForEdit.insuredMembers.length > 0) {
                this.insuredMembersForm.removeAt(0);
                this.dataForEdit.insuredMembers.forEach(element => {
                    this.addTransaction(element);
                });
            }
        }

        if (this.dataForEdit) {
            this.dataForEdit.insuredMembers.forEach(element => {
                if (element.sumInsured == 0) {
                    this.showinsuredMemberSum = false
                }
            });
        }
        if (this.critialIllnessForm.get('PlanType').value == '8') {
            this.showSumAssured = true;
        } else {
            this.showSumAssured = false;
        }
        this.ownerData = { Fmember: this.nomineesListFM, controleData: this.critialIllnessForm }
        this.bankAccountDetails = { accountList: this.accountList, controleData: this.critialIllnessForm }

        // this.finalCashFlowData = [];
        // ==============owner-nominee Data ========================\\ 
        // this.DOB = data.dateOfBirth
        // this.ownerData = this.critialIllnessForm.controls;
        // this.familyMemberId = data.familyMemberId;
    }
    onChangeSetErrorsType(value, formName) {
        if (value == 8) {
            this.showSumAssured = true
            this.showinsuredMemberSum = false
            let list = this.critialIllnessForm.get('InsuredMemberForm') as FormArray;
            list.controls.forEach(element => {
                element.get('sumAssured').setValue(null);
                if (element.get('sumAssured').value == '' || element.get('sumAssured').value == null) {
                    element.get('sumAssured').setErrors(null);
                    element.get('sumAssured').setValidators(null);
                }
            });
            if (!this.critialIllnessForm.controls['sumAssuredIdv'].value) {
                this.critialIllnessForm.controls['sumAssuredIdv'].setValue(null);
                this.critialIllnessForm.get('sumAssuredIdv').setValidators([Validators.required]);
                this.critialIllnessForm.get('sumAssuredIdv').updateValueAndValidity();
                this.critialIllnessForm.controls['sumAssuredIdv'].setErrors({ 'required': true });
            }
        } else {
            this.showSumAssured = false
            this.showinsuredMemberSum = true
            this.critialIllnessForm.controls['sumAssuredIdv'].setValue(null);
            this.critialIllnessForm.controls['sumAssuredIdv'].setErrors(null);
            this.critialIllnessForm.controls['sumAssuredIdv'].setValidators(null);
        }
    }
    bankAccountList(value) {
        this.bankList = value;
    }
    getFamilyData(data) {
        if (data) {
            data.forEach(element => {
                for (let e in this.insuredMembersForm.controls) {
                    let name = this.insuredMembersForm.controls[e].get('insuredMembers')
                    if (element.userName == name.value) {
                        this.insuredMembersForm.controls[e].get('insuredMembers').setValue(element.userName);
                        this.insuredMembersForm.controls[e].get('familyMemberId').setValue(element.familyMemberId);
                        this.insuredMembersForm.controls[e].get('relationshipId').setValue(element.relationshipId);
                        this.insuredMembersForm.controls[e].get('clientId').setValue(element.clientId);
                        this.insuredMembersForm.controls[e].get('userType').setValue(element.userType);
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
            userType: [data ? data.userType : '']

        }));
        this.resetValue(this.insuredMemberList);
        this.getFamilyData(this.insuredMemberList);
        this.onChangeSetErrorsType(this.critialIllnessForm.get('PlanType').value, 'planType')
    }

    removeTransaction(item) {
        let finalMemberList = this.critialIllnessForm.get('InsuredMemberForm') as FormArray
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
    /***owner***/

    openOptionField() {
        (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
    }
    changeSign(event, value, formValue) {
        this.critialIllnessForm.get(value).setValue('');
        if (event == '2') {
            if (parseInt(formValue) > 100) {
                this.critialIllnessForm.get(value).setValue('');
            }
        }
    }
    changeTheInput(form1, form2, event) {
        if (form1 == '2') {
            if (parseInt(event.target.value) > 100) {
                this.critialIllnessForm.get(form2).setValue('100');
            }
        } else {
            this.critialIllnessForm.get(form2).setValue(event.target.value);
        }

    }
    findCompanyName(data) {
        const inpValue = this.critialIllnessForm.get('insurerName').value;
        this.customerService.getCompanyNames(inpValue).subscribe(
            data => {
                console.log(data);
                this.options = data;
                if (data.length > 0) {
                    this.options = data;
                } else {
                    this.critialIllnessForm.controls.insurerName.setErrors({ erroInPolicy: true });
                    this.critialIllnessForm.get('insurerName').markAsTouched();
                }
            },
            err => {
                this.critialIllnessForm.controls.insurerName.setErrors({ erroInPolicy: true });
                this.critialIllnessForm.get('insurerName').markAsTouched();
            }
        );
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
    }
    preventDefault(e) {
        e.preventDefault();
    }
    dateChange(value, form, formValue) {
        if (form == 'policyExpiryDate' && formValue) {
            let startDate = new Date(this.critialIllnessForm.controls.policyStartDate.value);
            let policyExpiryDate = this.datePipe.transform(this.critialIllnessForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
            let comparedDate: any = startDate;
            comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
            comparedDate = new Date(comparedDate);
            comparedDate = comparedDate.setDate(comparedDate.getDate() - 1);
            comparedDate = this.datePipe.transform(comparedDate, 'yyyy/MM/dd')
            if (policyExpiryDate < comparedDate) {
                this.critialIllnessForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
                this.critialIllnessForm.get('policyExpiryDate').markAsTouched();
            } else {
                this.critialIllnessForm.get('policyExpiryDate').setErrors();
            }
        } else {
            if (formValue) {
                let policyExpiryDate = this.datePipe.transform(this.critialIllnessForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
                let policyStartDate = this.datePipe.transform(this.critialIllnessForm.controls.policyStartDate.value, 'yyyy/MM/dd')

                if (policyStartDate >= policyExpiryDate) {
                    this.critialIllnessForm.get('policyExpiryDate').setErrors({ max: 'Date of repayment' });
                    this.critialIllnessForm.get('policyExpiryDate').markAsTouched();
                } else {
                    this.critialIllnessForm.get('policyExpiryDate').setErrors();

                }
            }
        }

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
    saveCriticalIllness() {
        this.getClientId();
        let memberList = [];
        let suggestNewData;
        let finalMemberList = this.critialIllnessForm.get('InsuredMemberForm') as FormArray
        finalMemberList.controls.forEach(element => {
            let obj =
            {
                familyMemberId: element.get('userType').value == 2 ? element.get('clientId').value : element.get('familyMemberId').value,
                sumInsured: element.get('sumAssured').value,
                relationshipId: element.get('relationshipId').value,
                insuredOrNominee: 1,
                id: (element.get('id').value) ? element.get('id').value : null
            }
            memberList.push(obj)
        })
        this.critialIllnessForm.get('inceptionDate').setErrors(null);
        if (this.critialIllnessForm.invalid) {
            this.critialIllnessForm.markAllAsTouched();
        } else {
            this.barButtonOptions.active = true;
            const obj = {
                "clientId": this.clientId,
                "advisorId": this.advisorId,
                'policyHolderId': (this.critialIllnessForm.value.getCoOwnerName[0].userType == 2) ? this.critialIllnessForm.value.getCoOwnerName[0].clientId : this.critialIllnessForm.value.getCoOwnerName[0].familyMemberId,
                "policyTypeId": this.critialIllnessForm.get('PlanType').value,
                // "policyNumber": this.critialIllnessForm.get('policyNum').value,
                "insurerName": this.critialIllnessForm.get('insurerName').value,
                "planName": this.critialIllnessForm.get('planeName').value,
                "premiumAmount": this.critialIllnessForm.get('premium').value,
                // "policyStartDate": this.datePipe.transform(this.critialIllnessForm.get('policyStartDate').value, 'yyyy-MM-dd'),
                // "policyExpiryDate": this.datePipe.transform(this.critialIllnessForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
                "cumulativeBonus": this.critialIllnessForm.get('cumulativeBonus').value,
                "cumulativeBonusRupeesOrPercent": this.critialIllnessForm.get('bonusType').value,
                // "addOns": [{
                //   "addOnId": this.critialIllnessForm.get('additionalCovers').value,
                //   "addOnSumInsured": this.critialIllnessForm.get('coversAmount').value
                // }],
                "exclusion": this.critialIllnessForm.get('exclusion').value,
                "policyInceptionDate": this.datePipe.transform(this.critialIllnessForm.get('inceptionDate').value, 'yyyy-MM-dd'),
                "tpaName": this.critialIllnessForm.get('tpaName').value,
                "advisorName": this.critialIllnessForm.get('advisorName').value,
                "serviceBranch": this.critialIllnessForm.get('serviceBranch').value,
                "linkedBankAccount": this.critialIllnessForm.get('bankAccount').value,
                "insuranceSubTypeId": this.insuranceType,
                'sumInsuredIdv': this.critialIllnessForm.get('sumAssuredIdv').value,
                "id": (this.id) ? this.id : null,
                'realOrFictitious': 2,
                'suggestion': this.plannerNotes,
                'isRecommend': this.showRecommendation,
                insuredMembers: memberList,
                nominees: this.critialIllnessForm.value.getNomineeName,
            }

            if (obj.nominees.length > 0) {
                obj.nominees.forEach((element, index) => {
                    if (element.name == '') {
                        this.removeNewNominee(index);
                    }
                });
                obj.nominees = this.critialIllnessForm.value.getNomineeName;
                obj.nominees.forEach(element => {
                    if (element.sharePercentage) {
                        element.sumInsured = element.sharePercentage;
                    }
                    element.insuredOrNominee = 2
                });
            } else {
                obj.nominees = [];
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
            console.log(obj);



            if (this.dataForEdit) {
                this.planService.editGenralInsurancePlan(obj).subscribe(
                    data => {
                        this.barButtonOptions.active = false;
                        console.log(data);
                        this.eventService.openSnackBar("Updated successfully!", 'Dismiss');
                        const insuranceData =
                        {
                            insuranceTypeId: this.inputData.insuranceTypeId,
                            insuranceSubTypeId: this.insuranceType,
                            id: data ? data : null
                        }
                        this.close(insuranceData, true)
                    }, err => {
                        this.close('', true);
                    }
                );
            } else {
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
