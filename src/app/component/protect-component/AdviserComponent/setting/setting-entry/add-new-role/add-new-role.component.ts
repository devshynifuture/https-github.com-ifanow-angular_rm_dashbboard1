import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { AppConstants } from 'src/app/services/app-constants';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.scss']
})
export class AddNewRoleComponent implements OnInit {
  displayedColumns: string[] = ['position', 'weight', 'symbol', 'edit', 'del', 'adv'];
  dataSource: MatTableDataSource<any>;
  dataModels: any[] = [];
  @Input() data: any = {};
  rolesFG: FormGroup;
  editDetails: any;
  advisorId: any;
  isLoading:boolean = false;
  formPlaceHolders:any;
  
  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private eventService: EventService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.formPlaceHolders = AppConstants.formPlaceHolders;
  }

  ngOnInit() {
    this.createFormGroup();

    if (this.data.is_add_flag && !this.data.mainData.id) {
      this.getTemplate();
    } else {
      this.getRoleDetails();
    }
  }
  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  getTemplate() {
    this.isLoading = true;
    this.settingsService.getTemplateRole({ optionId: this.data.roleType }).subscribe((res) => {
      if (res) {
        console.log(res);
        this.isLoading = false;
        this.constructAdminDataSource(res.modules);
      }
    }, err => {
      this.eventService.openSnackBar("Error Occured");
      this.isLoading = false;
    })
  }

  getRoleDetails() {
    this.isLoading = true;
    this.settingsService.getDetailedRole({ id: this.data.mainData.id }).subscribe((res) => {
      if (res) {
        console.log(res);
        this.editDetails = res.roleDetail;
        this.isLoading = false;
        this.constructAdminDataSource(res.modules);
      }
    }, err => {
      this.eventService.openSnackBar("Error Occured");
      this.isLoading = false;
    })
  }

  createFormGroup() {
    this.rolesFG = this.fb.group({
      advisorId: [this.advisorId],
      roleName: [this.data.mainData.roleName || '', [Validators.required, Validators.maxLength(30)]],
      roleDescription: [this.data.mainData.roleDesc || '', [Validators.maxLength(250)]]
    });
  }

  segregateNormalAndAdvancedPermissions(data: any[], featureId) {
    let permissions_json = {
      view: data.find((permission) => permission.capabilityName == 'View'),
      add: data.find((permission) => permission.capabilityName == 'Add'),
      edit: data.find((permission) => permission.capabilityName == 'Edit'),
      delete: data.find((permission) => permission.capabilityName == 'Delete'),
    }
    for (let k in permissions_json) {
      if (permissions_json[k]) {
        permissions_json[k].featureId = featureId;
      } else {
        delete permissions_json[k];
      }
    }
    let advanced_permissions = data.filter((permission) => permission.basicOrAdvanceCapability == 2);
    advanced_permissions.forEach((permission) => {
      permission.featureId = featureId;
    })
    return { permissions: permissions_json, advanced_permissions: advanced_permissions };
  }

  constructAdminDataSource(adminDatasource) {
    for (var key in adminDatasource) {
      let subModules = adminDatasource[key];
      for (let i = 0; i < subModules.length; i++) {
        let segregated_permissions = this.segregateNormalAndAdvancedPermissions(subModules[i].capabilityList, subModules[i].childId);
        segregated_permissions = this.convertEnabledOrDisabledAsBoolean(segregated_permissions);
        delete subModules[i].capabilityList;
        subModules[i] = {
          ...subModules[i],
          ...segregated_permissions
        };
      }
      let obj = {
        modelName: subModules[0].parentName,
        subModules: subModules,
        dataSource: new MatTableDataSource(subModules)
      };
      this.dataModels.push(obj);
    }
    console.log(this.dataModels);
  }

  mergeAllCapabilitiesAndFilterEnabled() {
    let capabilityList = [];
    for (let module of this.dataModels) {
      let data = JSON.parse(JSON.stringify(module.dataSource.data));
      data.map((submodule) => {
        capabilityList.push(submodule.permissions.view);
        capabilityList.push(submodule.permissions.add);
        capabilityList.push(submodule.permissions.edit);
        capabilityList.push(submodule.permissions.delete);
        capabilityList.push(submodule.advanced_permissions);
      });
    }
    capabilityList = capabilityList.flat().filter(Boolean).filter(permission => permission.enabledOrDisabled);
    let featureList = capabilityList.map(feature => {
      return {
        enabledOrDisabled: feature.enabledOrDisabled ? 1 : 2,
        featureId: feature.featureId,
        capabilityId: feature.id,
      }
    })

    return featureList;
  }

  convertEnabledOrDisabledAsBoolean(segregatedPermissions) {
    for (let k in segregatedPermissions.permissions) {
      segregatedPermissions.permissions[k].enabledOrDisabled = segregatedPermissions.permissions[k].enabledOrDisabled == 1 ? true : false;
    }

    segregatedPermissions.advanced_permissions.forEach((permission) => {
      permission.enabledOrDisabled = permission.enabledOrDisabled == 1 ? true : false;
    })

    return segregatedPermissions;
  }

  save() {
    if (this.rolesFG.invalid) {
      this.rolesFG.markAllAsTouched();
    } else {
      if (this.data.is_add_flag) {
        let dataObj = {
          "advisorOrClientRole": this.data.roleType,
          "systemGeneratedOrCustomRole": 2,
          ...this.rolesFG.value,
          featureToCapabilitiesList: this.mergeAllCapabilitiesAndFilterEnabled(),
        };
        this.settingsService.addRole(dataObj).subscribe((res) => {
          this.eventService.openSnackBar("Role Added Successfully");
          this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
        }, err => {
          this.eventService.openSnackBar("Error Occured");
        })
      } else {
        let dataObj = {
          ...this.data.mainData,
          ...this.rolesFG.value,
          featureToCapabilitiesList: this.mergeAllCapabilitiesAndFilterEnabled(),
        };
        console.log(dataObj)
        this.settingsService.editRole(dataObj).subscribe((res) => {
          this.eventService.openSnackBar("Role Modified Successfully");
          this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
        }, err => {
          this.eventService.openSnackBar("Error Occured");
        })
      }
    }
  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: false });
  }

}