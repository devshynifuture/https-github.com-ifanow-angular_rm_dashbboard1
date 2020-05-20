import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { MatDialog, MatInput, MAT_DATE_FORMATS } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { DatePipe } from '@angular/common';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
    selector: 'app-add-health-insurance-asset',
    templateUrl: './add-health-insurance-asset.component.html',
    styleUrls: ['./add-health-insurance-asset.component.scss'],
    providers: [
        [DatePipe],
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    ],
})
export class AddHealthInsuranceAssetComponent implements OnInit {
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

    constructor(private enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService, private dialog: MatDialog) {
    }

    get data() {
        return this.inputData;
    }

    @Input() set data(data) {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId();
        this.inputData = data;
        this.policyList = data.displayList.policyTypes;
        this.addOns = data.displayList.addOns;
        this.getFamilyMemberList();
        this.getdataForm(data);
        // this.setInsuranceDataFormField(data);
        console.log(data);
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
            },
            (error) => {
                console.log(error);
            }
        );
    }

    openDialog(eventData): void {
        const dialogRef = this.dialog.open(LinkBankComponent, {
            width: '50%',
            data: this.bankList
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
            isClient: [data ? data.isClient : 0]
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
    getdataForm(data) {
        this.dataForEdit = data.data;
        if (data.data == null) {
            data = {};
            this.dataForEdit = data.data;
            this.flag = 'ADD';
        } else {
            this.dataForEdit = data.data;
            this.id = this.dataForEdit.id;
            if (this.dataForEdit.addOns.length > 0) {
                this.addOns.addOnId = this.dataForEdit.addOns[0].addOnId;
                this.addOns.addOnSumInsured = this.dataForEdit.addOns[0].addOnSumInsured;
            }
            this.flag = 'EDIT';
        }
        this.healthInsuranceForm = this.fb.group({
            // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
            getCoOwnerName: this.fb.array([this.fb.group({
                name: ['', [Validators.required]],
                share: [0,],
                familyMemberId: 0,
                id: 0,
                isClient: 0
            })]),
            name: [(this.dataForEdit ? this.dataForEdit.name : null)],
            PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId + '' : ''), [Validators.required]],
            planDetails: [(this.dataForEdit ? this.dataForEdit.policyFeatureId + '' : null), [Validators.required]],
            deductibleAmt: [(this.dataForEdit ? this.dataForEdit.deductibleSumInsured : null), [Validators.required]],
            policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : null), [Validators.required]],
            insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : null), [Validators.required]],
            planeName: [(this.dataForEdit ? this.dataForEdit.planName : null), [Validators.required]],
            premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : null), [Validators.required]],
            policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : null, [Validators.required]],
            policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : null, [Validators.required]],
            copay: [(this.dataForEdit ? this.dataForEdit.copay : null)],
            copayType: [this.dataForEdit ? this.dataForEdit.copayRupeesOrPercent + '' : '1'],
            cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : null],
            bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : '1'],
            exclusion: [this.dataForEdit ? this.dataForEdit.exclusion : null],
            inceptionDate: [(this.dataForEdit) ?((this.dataForEdit.policyInceptionDate) ? new Date(this.dataForEdit.policyInceptionDate) : null) : null],
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
                relationshipId: ['']
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
            this.getNominee.removeAt(0);
            this.dataForEdit.nominees.forEach(element => {
                this.addNewNominee(element);
            });
        }
        /***nominee***/
        if (this.dataForEdit) {
            this.insuredMembersForm.removeAt(0);
            this.dataForEdit.insuredMembers.forEach(element => {
                this.addTransaction(element);
            });
        }
        if (this.dataForEdit) {
            this.dataForEdit.insuredMembers.forEach(element => {
                if (element.sumInsured == 0) {
                    this.showinsuredMemberSum = false
                }
            });
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

    ngOnInit() {
        this.bankList = this.enumService.getBank();
        this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    }
    dateChange(value, form, formValue) {
        if (form == 'policyExpiryDate' && formValue) {
            let startDate = new Date(this.healthInsuranceForm.controls.policyStartDate.value);
            let policyExpiryDate = this.datePipe.transform(this.healthInsuranceForm.controls.policyExpiryDate.value, 'yyyy/MM/dd')
            let comparedDate: any = startDate;
            comparedDate = comparedDate.setFullYear(startDate.getFullYear() + 1);
            comparedDate = new Date(comparedDate);
            comparedDate = comparedDate.setDate(comparedDate.getDate()-1);
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
            familyMemberId: [data ? data.familyMemberId : '']
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

    preventDefault(e) {
        e.preventDefault();
    }

    saveHealthInsurance() {
        let memberList = [];
        let finalMemberList = this.healthInsuranceForm.get('InsuredMemberForm') as FormArray;
        finalMemberList.controls.forEach(element => {
            let obj =
            {
                familyMemberId: element.get('familyMemberId').value,
                sumInsured: element.get('sumAssured').value,
                relationshipId: element.get('relationshipId').value,
                insuredOrNominee: 1,
                id: (element.get('id').value) ? element.get('id').value : null
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
                'policyHolderId': this.healthInsuranceForm.value.getCoOwnerName[0].familyMemberId,
                'policyStartDate':this.datePipe.transform(this.healthInsuranceForm.get('policyStartDate').value, 'yyyy-MM-dd'),
                'policyExpiryDate':this.datePipe.transform( this.healthInsuranceForm.get('policyExpiryDate').value, 'yyyy-MM-dd'),
                'cumulativeBonus': this.healthInsuranceForm.get('cumulativeBonus').value,
                'cumulativeBonusRupeesOrPercent': this.healthInsuranceForm.get('bonusType').value,
                'policyTypeId': this.healthInsuranceForm.get('PlanType').value,
                'deductibleSumInsured': this.healthInsuranceForm.get('deductibleAmt').value,
                'exclusion': this.healthInsuranceForm.get('exclusion').value,
                'copay': this.healthInsuranceForm.get('copay').value,
                'planName': this.healthInsuranceForm.get('planeName').value,
                'policyNumber': this.healthInsuranceForm.get('policyNum').value,
                'copayRupeesOrPercent': this.healthInsuranceForm.get('copayType').value,
                'tpaName': this.healthInsuranceForm.get('tpaName').value,
                'advisorName': this.healthInsuranceForm.get('advisorName').value,
                'serviceBranch': this.healthInsuranceForm.get('serviceBranch').value,
                'linkedBankAccount': this.healthInsuranceForm.get('bankAccount').value,
                'insurerName': this.healthInsuranceForm.get('insurerName').value,
                'policyInceptionDate':this.datePipe.transform(this.healthInsuranceForm.get('inceptionDate').value, 'yyyy-MM-dd'),
                'insuranceSubTypeId': this.inputData.insuranceSubTypeId,
                'premiumAmount': this.healthInsuranceForm.get('premium').value,
                'policyFeatureId': this.healthInsuranceForm.get('planDetails').value,
                'sumInsuredIdv': this.healthInsuranceForm.get('sumAssuredIdv').value,
                'id': (this.id) ? this.id : null,
                'addOns': [],
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


            if (this.dataForEdit) {
                this.customerService.editGeneralInsuranceData(obj).subscribe(
                    data => {
                        this.barButtonOptions.active = false;
                        console.log(data);
                        this.eventService.openSnackBar('Updated successfully!', 'Dismiss');
                        const insuranceData =
                        {
                            insuranceTypeId: this.inputData.insuranceTypeId,
                            insuranceSubTypeId: this.inputData.insuranceSubTypeId
                        };
                        this.close(insuranceData);
                    }
                );
            } else {
                this.customerService.addGeneralInsurance(obj).subscribe(
                    data => {
                        this.barButtonOptions.active = false;
                        console.log(data);
                        this.eventService.openSnackBar('Added successfully!', 'Dismiss');
                        const insuranceData =
                        {
                            insuranceTypeId: this.inputData.insuranceTypeId,
                            insuranceSubTypeId: this.inputData.insuranceSubTypeId
                        };
                        this.close(insuranceData);
                    }
                );
            }
        }
    }

    close(data) {
        this.addMoreFlag = false;
        this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    }

}
