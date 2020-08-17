import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../../../customers/component/common-component/document-new-folder/document-new-folder.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from '../../setting/settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { element } from 'protractor';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { AppConstants } from 'src/app/services/app-constants';
import { OrgSettingServiceService } from '../../setting/org-setting-service.service';
import { ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'archit.gupta@gmail.com', name: 'ARN-83865', weight: 'Verification successful' },

];
@Component({
  selector: 'app-dashboard-guide-dialog',
  templateUrl: './dashboard-guide-dialog.component.html',
  styleUrls: ['./dashboard-guide-dialog.component.scss']
})
export class DashboardGuideDialogComponent implements OnInit {

  page = 1;
  step: number;

  serviceList = [
    { name: 'Portfolio review', selected: false },
    { name: 'Financial planning', selected: false },
    { name: 'Emergency planning', selected: false },
    { name: 'Insurance planning', selected: false },
    { name: 'Investment management', selected: false },
    { name: 'Investment consulting', selected: false },
    { name: 'Reitrement planning', selected: false },
    { name: 'Asset allocation', selected: false },
    { name: 'Tax planning', selected: false },
    { name: 'Cash flow planning', selected: false },
    { name: 'Real estate advisory', selected: false },
    { name: 'Will writing', selected: false },
    { name: 'Estate planning', selected: false },
    { name: 'Raising capital or Dept', selected: false },
    { name: 'Personal leading', selected: false },

  ]

  descriptionArray = [
    { name: 'I’ve been running a financial advisory practice for few years now.', selected: false, id: 1 },
    { name: 'I am new to this industry and just getting started.', selected: false, id: 2 }
  ]

  clientsWorkWithList = [
    { name: 'Salaried workoffice', selected: false },
    { name: 'Small buisness owners', selected: false },
    { name: 'Medical professionals', selected: false },
    { name: 'Finance professionals', selected: false },
    { name: 'Legal professionals', selected: false },
    { name: 'Buisness executives', selected: false },
    { name: 'Entreprenures', selected: false },
    { name: 'Retirees', selected: false },
    { name: 'Public sector workforce', selected: false },
    { name: 'HNI investors', selected: false },
    { name: 'UHNI investors', selected: false },
    { name: 'Institutional investors', selected: false },
  ]

  productList = [
    { name: 'Mutual funds', selected: false },
    { name: 'Stocks', selected: false },
    { name: 'Fixed income & Bonds', selected: false },
    { name: 'Life & General insurance', selected: false },
    { name: 'Post office schemes', selected: false },
    { name: 'PF & Pension schemes', selected: false },
    { name: 'Alternative investments', selected: false },
    { name: 'Commodities', selected: false },
    { name: 'Real estate', selected: false },
  ]

  mutualFundPractices = [
    { name: 'I offer mutual funds under my ARN/RIA code', selected: false, option: 'A' },
    { name: 'I work with a national distributor as a sub-broker', selected: false, option: 'B' },
    { name: 'I only give advice. I do not distribute or offer implementation services.', selected: false, option: 'C' },
    { name: 'Option a and b both applies to me', selected: false, option: 'D' },
  ]

  teamAloneList = [
    { name: 'I’m alone', selected: false, option: 'A', id: 1 },
    { name: 'I have a team', selected: false, option: 'B', id: 2 },
  ]

  addTeamMemberChoiceList = [
    { name: 'Sure, let’s add them', selected: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', selected: false, option: 'B', id: 2 },
  ]

  arnRiaCodeChoiceList = [
    { name: 'Yes', selected: false, option: 'A', id: 1 },
    { name: 'No', selected: false, option: 'B', id: 2 },
    { name: 'I have just started the process of registering', selected: false, option: 'C', id: 3 },
  ]

  basicDetailsChoiceList = [
    { name: 'Sure, let`s add', selected: false, option: 'A', id: 1 },
    { name: 'I`ll do this later', selected: false, option: 'B', id: 2 },
  ]

  rtaCredentialsChoiceList = [
    { name: 'Sure, let’s set-up auto forward', selected: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', selected: false, option: 'B', id: 2 },
  ]

  rtaCredentialsChoiceList1 = [
    { name: 'Sure, let’s set-up auto forward', selected: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', selected: false, option: 'B', id: 2 },
  ]

  rolesList = [
    { name: 'Admin', selected: false, option: 'A', id: 1 },
    { name: 'Back office', selected: false, option: 'B', id: 2 },
    { name: 'Financial planner', selected: false, option: 'C', id: 3 },
  ]

  uploadMfFIleOption = [
    { name: 'Order & Upload files for me please', selected: false, option: 'A', id: 1 },
    { name: 'Do not order. I will manually do it.', selected: false, option: 'B', id: 2 },
  ]

  ArnRiaForm: FormGroup;
  credentialsForm: FormGroup;
  advisorId: any;
  step2Flag: boolean;
  step3Flag = 0;
  step4Flag = 0;
  step5Flag = 0
  step6Flag
  step7Flag;
  editPictureFlag;
  step8Flag: boolean;
  doItLater
  step9Flag: boolean;
  step10Flag: boolean;
  globalData: any;
  validatorType;
  arnRiaMaxlength: any;
  arnRtaData: any;
  selectedArnRIaChoice: any;
  basicDetailsChoice: any;
  selctedRtaDataChoice: any = {};
  selectedTeamMemberChoice: any;
  step11Flag: boolean;
  teamOrAloneSelectedData: any = {};
  selctedArmOrRia: any;
  selectedArmOrRiaIndex: any;
  arnRiaList = [];
  ArnRiaIndex: any;
  selectedArnRIa: any;
  formPlaceHolders
  stepRoleChoice: boolean;
  rolesFlag: boolean = true;
  addTeamMember;
  teamMemberForm: FormGroup;
  adminAdvisorId: any;
  selctedRoleChoice: any;
  step15Flag;
  selctedRtaDataChoice1: any;
  camsFlag: boolean = false;
  karvyFlag: boolean = false;
  franklinFlag: boolean = false;
  emailDetails: any;
  emailList: any;
  isLoading: boolean;
  step17Flag: boolean;
  selectedMfOption: any;
  finalImage: any;
  imageUploadEvent: any;
  showCropper: boolean = false;
  imgURL = '';
  cropImage: boolean;
  showEditOption: boolean = false;


  constructor(private fb: FormBuilder,
    private settingService: SettingsService,
    private eventService: EventService,
    public dialogRef: MatDialogRef<DashboardGuideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private orgSetting: OrgSettingServiceService,
    private utilService: UtilService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.formPlaceHolders = AppConstants.formPlaceHolders;
    this.validatorType = ValidatorType
    this.advisorId = AuthService.getAdvisorId();
    this.step = 1;
    this.selectedArmOrRiaIndex = 0
    this.ArnRiaForm = this.fb.group({
      ArnRiaFormList: new FormArray([])
    })

    this.credentialsForm = this.fb.group({
      credentialsFormList: new FormArray([])
    })
    this.adminAdvisorId = AuthService.getAdminAdvisorId();
    this.teamMemberForm = this.fb.group({
      adminAdvisorId: [this.adminAdvisorId],
      parentId: this.advisorId,
      fullName: ['', [Validators.required]],
      emailId: [, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      mobileNo: [, [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      // isdCodeId: ['',[Validators.required]],
      roleId: [],
      url: []
    })
    this.settingService.getArnGlobalData().subscribe((res) => {
      console.log(res)
      if (res) {
        this.globalData = res;
        this.addArnRiaForm();
      }
    });
    this.getPersonalInfo()
    // this.getRtaDetails();
    this.getEmailVerification();
  }

  get getArnRiaForm() { return this.ArnRiaForm.controls; }
  get getArnRiaFormList() { return this.getArnRiaForm.ArnRiaFormList as FormArray; }

  get getCredentialsForm() { return this.credentialsForm.controls; }
  get getCredentialsFormList() { return this.getCredentialsForm.credentialsFormList as FormArray; }

  addArnRiaForm() {
    this.getArnRiaFormList.push(this.fb.group({
      advisorId: [this.advisorId, []],
      arnOrRia: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      number: [, [Validators.required]],
      nameOfTheHolder: [, [Validators.required]]
    }))
  }

  addCredentialsForm() {
    this.getCredentialsFormList.push(this.fb.group({
      advisorId: [this.advisorId],
      camsEmail: ['', [Validators.pattern(ValidatorType.EMAIL)]],
      camsPassword: [''],
      karvyID: [''],
      karvyPassword: [''],
      karvyEMail: ['', [Validators.pattern(ValidatorType.EMAIL)]],
      franklinID: [''],
      franklinPassword: [''],
      franklinEmail: ['', [Validators.pattern(ValidatorType.EMAIL)]],
    }))
  }


  displayedColumns: string[] = ['position', 'weight'];
  dataSource = ELEMENT_DATA;

  showPageByIndex(index) {
    this.page = index;
  }

  chooseArnRiaForm(index) {
    this.ArnRiaIndex = index;
  }

  changeNumberValidation(value) {
    if (value == 1) {
      this.arnRiaMaxlength = 6;
    } else {
      this.arnRiaMaxlength = 9
    }
    this.getArnRiaFormList.controls[this.getArnRiaFormList.length - 1].get('number').setValidators([Validators.maxLength(this.arnRiaMaxlength), Validators.minLength(this.arnRiaMaxlength)])
  }


  backStep() {
    this.step--;
  }

  selectPractice(selectedPractise) {
    this.step6Flag = true;
    this.mutualFundPractices.map(element => {
      (selectedPractise.name == element.name) ? element.selected = true : element.selected = false
    })
  }

  selectDes(selectDescription) {
    this.step2Flag = true
    this.descriptionArray.map(element => {
      (selectDescription.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectSingleOrTeam(singOrTeam) {
    this.step7Flag = true;
    this.teamOrAloneSelectedData = singOrTeam;
    this.teamAloneList.map(element => {
      (singOrTeam.id == element.id) ? element.selected = true : element.selected = false
    });
    (singOrTeam.id == 1) ? this.editPictureFlag = true : this.editPictureFlag = false;
  }

  selectAddTeamMemberChoice(selectChoice) {
    this.step8Flag = true
    this.selectedTeamMemberChoice = selectChoice
    this.addTeamMemberChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectarnRiaChoice(selectChoice) {
    this.step9Flag = true
    this.selectedArnRIaChoice = selectChoice;
    this.arnRiaCodeChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectbasicDetailsChoice(selectChoice) {
    this.step10Flag = true
    this.basicDetailsChoice = selectChoice;
    this.basicDetailsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectrtaCredentialsChoice(selectChoice) {
    this.step11Flag = true
    this.selctedRtaDataChoice = selectChoice;
    this.rtaCredentialsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectrtaCredentialsChoice1(selectChoice) {
    this.step15Flag = true
    this.selctedRtaDataChoice1 = selectChoice;
    this.rtaCredentialsChoiceList1.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectRoles(selectedRole) {
    this.stepRoleChoice = true;
    this.editPictureFlag = true
    this.selctedRoleChoice = selectedRole;
    this.rolesList.map(element => {
      (selectedRole.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectUploadMfOption(selectChoice) {
    this.step17Flag = true
    this.selectedMfOption = selectChoice;
    this.uploadMfFIleOption.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectService(service) {
    if (service.selected) {
      service.selected = false;
      this.step3Flag--;
    }
    else {
      service.selected = true;
      this.step3Flag++;
    }
  }

  selectClientWork(clientWork) {
    if (clientWork.selected) {
      clientWork.selected = false;
      this.step4Flag--;
    }
    else {
      clientWork.selected = true;
      this.step4Flag++;
    }
  }

  selectProduct(product) {
    if (product.selected) {
      product.selected = false;
      this.step5Flag--;
    }
    else {
      product.selected = true;
      this.step5Flag++;
    }
  }

  saveArnRiaForm(flag, index) {
    if (this.getArnRiaFormList.controls[index].invalid) {
      this.getArnRiaFormList.controls[index].markAllAsTouched();
      return;
    }
    // this.barButtonOptions.active = true;
    const jsonObj = {
      ...this.getArnRiaFormList.controls[index].value
    };

    if (this.getArnRiaFormList.controls[index].value.arnOrRia == 1) {
      jsonObj.number = 'ARN-' + jsonObj.number;
    } else {
      jsonObj.number = 'INA' + jsonObj.number;
    }
    this.settingService.addArn(jsonObj).subscribe((res) => {
      this.eventService.openSnackBar("ARN-RIA Added successfully");
      if (flag == 'addMore') {
        this.arnRiaList.push(jsonObj)
        this.addArnRiaForm();
        this.getArnRiaFormList.controls[index + 1].get('arnOrRia').setValue('')
        this.getArnRiaFormList.controls[index + 1].get('typeId').setValue('')
        this.getArnRiaFormList.controls[index + 1].get('number').setValue('')
        this.getArnRiaFormList.controls[index + 1].get('nameOfTheHolder').setValue('');
        this.selectedArnRIa = jsonObj;
      }
      else {
        this.getRtaDetails();
        this.step++;
      }
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      // this.barButtonOptions.active = false;
    })
  }

  getRtaDetails() {
    this.settingService.getArnlist({ advisorId: this.advisorId }).subscribe((data) => {
      if (data) {
        this.selctedArmOrRia = data[0]
        data.forEach((element, index) => {
          this.addCredentialsForm();
          (index == 0) ? element['colorFlag'] = true : element['colorFlag'] = false;
        });
        this.arnRtaData = data;
      }
    });
  }

  selectArnRia(data, selectedIndex) {
    this.selectedArmOrRiaIndex = selectedIndex;
    this.selctedArmOrRia = data;
    this.arnRtaData.forEach((element, index) => {
      (selectedIndex == index) ? element['colorFlag'] = true : element['colorFlag'] = false;
    });
  }



  addCredentialsJson(index) {

    if (this.getCredentialsFormList.controls[index].invalid) {
      this.getCredentialsFormList.controls[index].markAllAsTouched();
      return
    }

    if (this.getCredentialsFormList.controls[index].value.camsEmail != '') {
      this.camsFlag = true;
      let obj =
      {
        advisorId: this.advisorId,
        rtTypeMasterid: 2,
        arnOrRia: this.selctedArmOrRia.arnOrRia,
        rtExtTypeId: 2, // dbf file extension
        arnRiaDetailsId: this.selctedArmOrRia.id,
        registeredEmail: this.getCredentialsFormList.controls[index].value.camsEmail,
        mailbackPassword: this.getCredentialsFormList.controls[index].value.camsPassword,
        fileOrderingUseabilityStatusId: 1
      }
      this.saveCredentials(obj, index, 'cams')
    }

    if (this.getCredentialsFormList.controls[index].value.karvyID != '') {
      this.karvyFlag = true;
      let obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: this.selctedArmOrRia.id,
        arnOrRia: this.selctedArmOrRia.arnOrRia,
        rtTypeMasterid: 1,
        loginId: this.getCredentialsFormList.controls[index].value.karvyID,
        loginPassword: this.getCredentialsFormList.controls[index].value.karvyPassword,
        rtExtTypeId: 2, // dbf file extension
        mailbackPassword: '',
        registeredEmail: this.getCredentialsFormList.controls[index].value.karvyEMail,
        fileOrderingUseabilityStatusId: 1,
      }
      this.saveCredentials(obj, index, 'karvy')
    }

    if (this.getCredentialsFormList.controls[index].value.franklinEmail != '') {
      this.franklinFlag = true;
      let obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: this.selctedArmOrRia.id,
        arnOrRia: this.selctedArmOrRia.arnOrRia,
        rtTypeMasterid: 3,
        rtExtTypeId: 2, // dbf file extension
        loginId: this.getCredentialsFormList.controls[index].value.franklinID,
        loginPassword: this.getCredentialsFormList.controls[index].value.franklinPassword,
        mailbackPassword: '',
        registeredEmail: this.getCredentialsFormList.controls[index].value.franklinEmail,
        fileOrderingUseabilityStatusId: 1
      }
      this.saveCredentials(obj, index, 'franklin')
    }

  }

  saveCredentials(obj, index, flag) {
    this.settingService.addMFRTA(obj).subscribe((res) => {
      if (flag == 'cams') {
        this.camsFlag = false
      } else if (flag == 'karvy') {
        this.karvyFlag = false
      }
      else {
        this.franklinFlag = false
      }
      this.loaderFun(index);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  loaderFun(index) {
    if (!this.camsFlag && !this.karvyFlag && !this.franklinFlag) {
      if (index == this.arnRtaData.length - 1) {
        this.step = 15;
      }
      else {
        this.selectedArmOrRiaIndex = index + 1
        this.selctedArmOrRia = this.arnRtaData[index + 1]
      }
      this.eventService.openSnackBar("Credentials added successfully");
    } else {
    }
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  getEmailVerification() {
    this.isLoading = true;
    this.emailList = [{}, {}]
    let obj = {
      userId: this.advisorId,
      // advisorId: this.advisorId
    }
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => {
        this.getEmailVerificationRes(data);
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
      }
    );
  }

  getEmailVerificationRes(data) {
    if (data) {
      this.emailDetails = data
      this.emailList = data.listItems;
      this.isLoading = false;
    } else {
      this.emailList = []
    }
  }

  saveTeamMember(flag) {
    if (this.teamMemberForm.invalid) {
      this.teamMemberForm.markAllAsTouched();
      return
    }
    this.teamMemberForm.value.roleId = this.selctedRoleChoice.id
    const dataObj = this.teamMemberForm.value;
    this.settingService.addTeamMember(dataObj).subscribe((res) => {
      if (flag == 'addMore') {
        this.eventService.openSnackBar('Team member added successfully', "Dismiss");
        this.rolesList.map(element => element.selected = false);
        this.rolesFlag = true
        this.step = 8.5;
        this.addTeamMember = false;
        this.selctedRoleChoice = undefined;
        this.stepRoleChoice = undefined;
        this.teamMemberForm.controls.fullName.setValue('')
        this.teamMemberForm.controls.emailId.setValue('');
        this.teamMemberForm.controls.mobileNo.setValue('')
        this.teamMemberForm.controls.roleId.setValue('')
      }
      else {
        this.eventService.openSnackBar('Invitation sent successfully', "Dismiss");
        this.step = 9
        this.editPictureFlag = true
      }
    }, (err) => {
      console.error(err);
      // this.barButtonOptions.active = false;
      this.eventService.openSnackBar(err, "Dismiss");
    });
  }

  showCroppedImage(imageAsBase64) {
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
  }

  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }


  saveImage() {
    if (this.showCropper) {
      const tags = this.advisorId + ',advisor_profile_logo,';
      const file = this.utilService.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'advisor_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const jsonDataObj = {
              id: this.advisorId,
              profilePic: responseObject.url
            };
            this.settingService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
              this.imgURL = jsonDataObj.profilePic;
              AuthService.setProfilePic(jsonDataObj.profilePic);
              this.eventService.openSnackBar('Image uploaded sucessfully', 'Dismiss');
            });
          }
        });
    }
  }

  cropImg(data) {
    this.cropImage = true;
    this.showCropper = true;
  }

  editImage() {
    (this.showEditOption) ? this.showEditOption = false : this.showEditOption = true;
  }
  getPersonalInfo() {
    this.settingService.getProfileDetails({ id: this.advisorId }).subscribe((res) => {
      this.imgURL = res.profilePic;
    });
  }

  resetPageVariables() {
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
  }


}

