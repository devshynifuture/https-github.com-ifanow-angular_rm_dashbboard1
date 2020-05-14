import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SettingsService } from '../../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from '../../../../../../../../common/progress-button/progress-button.component';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-new-team-member',
  templateUrl: './new-team-member.component.html',
  styleUrls: ['./new-team-member.component.scss']
})
export class NewTeamMemberComponent implements OnInit {
  @Input() data: any = {};
  advisorId: any;
  roles: any;
  teamMemberFG: FormGroup;
  counter = 0;
  isLoading = true;
  validatorType = ValidatorType;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SEND INVITE',
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
  isdCodes: Array<any> = [];
  logoImg;
  /** control for the MatSelect filter keyword */
  filterCtrl: FormControl = new FormControl();
  filteredIsdCodes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  imageData: any;
  uploadedImage;
  imageLoader: boolean;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private peopleService: PeopleService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getIsdCodesData();
    this.loadRoles();
    // listen for search field value changes
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodes();
      });
    this.createForm();
  }
  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }
  getIsdCodesData() {
    this.loader(1);
    this.peopleService.getIsdCode({}).subscribe(
      data => {
        if (data) {
          this.isdCodes = data;
          this.filteredIsdCodes.next(this.isdCodes.slice());
        }
        this.loader(-1);
      },
      err => {
        this.loader(-1);
        this.eventService.openSnackBar(err, "Dismiss")
      }
    )
  }

  loadRoles() {
    this.loader(1);
    const obj = {
      advisorId: this.advisorId
    };
    this.settingsService.getAdvisorRoles(obj).subscribe((res) => {
      this.roles = res;
      this.loader(-1);
    }, err => {
      this.loader(-1);
      this.eventService.openSnackBar(err, "Dismiss")
    });
  }

  createForm() {
    const roleId = this.data.mainData.role ? this.data.mainData.role.id : '';
    this.teamMemberFG = this.fb.group({
      adminAdvisorId: [this.data.mainData.adminAdvisorId || this.advisorId],
      parentId: this.advisorId,
      fullName: [this.data.mainData.fullName || '',
      [Validators.required, Validators.maxLength(50), Validators.pattern(ValidatorType.PERSON_NAME)]],
      emailId: [this.data.mainData.email || '', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      mobileNo: [this.data.mainData.mobile || '', [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      isdCodeId: [this.data.mainData.isdCodeId || 73, [Validators.required]],
      roleId: [roleId, [Validators.required]],
      url: []
    });
  }
  onChange(event) {
    this.imageLoader = true;
    console.log('Biller profile logo Onchange event : ', event);
    if (event && event.target && event.target.files) {
      const fileList = event.target.files;
      if (fileList.length == 0) {
        console.log('Biller profile logo Onchange fileList : ', fileList);

        return;
      }
      this.imageData = fileList[0];

      console.log(this.imageData);
      this.teamMemberFG.controls.url.reset();
      this.logoImg = this.imageData;
      // this.logoImg=
      const reader = new FileReader();
      reader.onload = e => this.logoImg = reader.result;
      // reader.
      reader.readAsDataURL(this.imageData);
      if (this.imageData.type == 'image/png' || this.imageData.type == 'image/jpeg') {
        const files = [this.imageData];
        const tags = this.advisorId + ',biller_profile_logo,';
        PhotoCloudinaryUploadService.uploadFileToCloudinary(files, 'biller_profile_logo', tags,
          (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            if (status == 200) {
              this.imageLoader = false;
              const responseObject = JSON.parse(response);
              console.log('onChange file upload success response url : ', responseObject.url);
              this.logoImg = responseObject.url;
              console.log('uploadImage success this.imageData : ', this.imageData);
              // this.logUrl.controls.url.setValue(this.imageData);
              this.uploadedImage = JSON.stringify(responseObject);
              this.eventService.openSnackBar('Image uploaded sucessfully', 'Dismiss');
            }

          });

      }
    }
  }
  cancelImageUpload() {
    this.logoImg = undefined;
    this.imageLoader = false;
    this.teamMemberFG.controls.url.reset();
  }
  save() {
    if (this.teamMemberFG.invalid) {
      this.teamMemberFG.markAllAsTouched();
      return;
    }
    if (this.imageLoader) {
      this.eventService.openSnackBar("Please wait image is uplaoding", "Dismiss");
      return;
    }
    else {
      if (this.barButtonOptions.active) {
      } else {
        this.barButtonOptions.active = true;
        if (this.data.is_add_call) {
          this.addTeamMember();
        } else {
          this.editTeamMember();
        }
      }
    }
  }

  addTeamMember() {
    this.barButtonOptions.active = true;
    this.teamMemberFG.value['profilePic'] = this.logoImg;
    const dataObj = this.teamMemberFG.value;
    this.settingsService.addTeamMember(dataObj).subscribe((res) => {
      this.barButtonOptions.active = false;
      this.close(true);
      this.eventService.openSnackBar('Invitation sent successfully', "Dismiss");
    }, (err) => {
      console.error(err);
      this.barButtonOptions.active = false;
      this.eventService.openSnackBar('Error occured.', "Dismiss");
    });
  }

  editTeamMember() {
    const dataObj = {
      adminAdvisorId: this.advisorId,
      id: this.data.mainData.id,
      roleId: this.teamMemberFG.controls.roleId.value,
      profilePic: this.logoImg
    };
    this.barButtonOptions.active = true;
    this.settingsService.editTeamMember(dataObj).subscribe((res) => {
      this.close(true);
      this.barButtonOptions.active = false;
      this.eventService.openSnackBar('Member data updated', "Dismiss");
    }, (err) => {
      console.error(err);
      this.barButtonOptions.active = false;
      this.eventService.openSnackBar('Error occured.', "Dismiss");
    });
  }

  close(status = false) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }

  loader(countAdder) {
    this.counter += countAdder;
    if (this.counter == 0) {
      this.isLoading = false;
      this.imageLoader = false;
      this.createForm();
      (this.data.mainData.profilePicUrl) ? this.barButtonOptions.text = "SAVE" : this.barButtonOptions.text = "SEND INVITE";
      this.logoImg = this.data.mainData.profilePicUrl;
      this.checkIfRoleExists();
    } else {
      this.isLoading = true;
    }
  }

  checkIfRoleExists() {
    const teamMemberRoleId = this.teamMemberFG.get('roleId') as FormControl;
    const roleExist = this.roles.find((role) => {
      if (role.roleMasterId == teamMemberRoleId.value) {
        return true;
      } else {
        return false;
      }
    });

    if (!roleExist) {
      teamMemberRoleId.setValue('');
      this.teamMemberFG.updateValueAndValidity();
    }
  }
  protected filterCodes() {
    if (!this.isdCodes) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredIsdCodes.next(this.isdCodes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the codes
    this.filteredIsdCodes.next(this.isdCodes.filter(code => (code.code + code.countryCode).toLowerCase().indexOf(search) > -1))
  }
}
