import { Router } from '@angular/router';
import { Injectable } from '@angular/core/src/metadata/*';
import { SettingsService } from '../component/protect-component/AdviserComponent/setting/settings.service';
import { UtilService } from '../services/util.service';
import { AuthService } from "./authService";


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private authService: AuthService
  ) {
    if (authService.isLoggedIn()) {
      this.getRoleDetails(AuthService.getUserInfo().roleId);
    }
  }

  subscriptionPermission = {
    enabled: true,
    subModule: {
      Subscriptions: {
        enabled: true
      },
      Quotations: {
        enabled: true
      },
      Documents: {
        enabled: true
      },
      Dashboard: {
        enabled: true
      },
      Invoices: {
        enabled: true
      },
      Clients: {
        enabled: true
      },
      Settings: {
        enabled: true
      }
    }
  };
  portfolioPermission = {
    enabled: true,
  };
  transactionPermission = {
    enabled: true,
  };
  peoplePermission = {
    enabled: true,
  };
  backofficePermission = {
    enabled: true,
  };
  dashboardPermission = {
    enabled: true,
  };
  activityPermission = {
    enabled: true,
    subModule: {
      Tasks: {
        enabled: true
      },
      Emails: {
        enabled: true
      },
      Calendar: {
        enabled: true
      },
      TaskCapabilityList: [],
      CalendarCapabilityList: [],
      EmailCapabilityList: []
    }
  };
  overviewPermission = {
    enabled: true,
  };
  planPermission = {
    enabled: true,
  };
  settingPermission = {
    enabled: true,
  };
  familyMemberId: any;
  dataModels = [];

  getRoleDetails(roleId) {
    this.settingsService.getAdvisorOrClientOrTeamMemberRoles({ id: roleId }).subscribe((res) => {
      console.log('roleService getRoleDetails response : ', res);

      if (res) {
        this.constructAdminDataSource(res);
        console.log('roleService getRoleDetails data : ', this.dataModels);
      }
    }, err => {
      console.log('roleService getRoleDetails err : ', err);
    });
  }

  constructAdminDataSource(adminDatasource) {
    for (const key in adminDatasource) {
      const subModules = adminDatasource[key];
      this.setPermissions(subModules.parentId, subModules.showModule);
      /* for (let i = 0; i < subModules.length; i++) {
         let segregated_permissions = this.utilService.segregateNormalAndAdvancedPermissions(subModules[i].capabilityList, subModules[i].childId);
         segregated_permissions = this.utilService.convertEnabledOrDisabledAsBoolean(segregated_permissions);
         delete subModules[i].capabilityList;
         subModules[i] = {
           ...subModules[i],
           ...segregated_permissions
         };
       }
       const obj = {
         modelName: subModules[0].parentName,
         subModules,
       };
       this.dataModels.push(obj);*/
    }
    this.setSubscriptionSubModulePermissions(adminDatasource.Subscriptions.subModule);
    this.setActivityPermissions(adminDatasource.Activity.subModule)
  }

  setPermissions(moduleId, enabled) {
    console.log(' moduleId : ', moduleId, ' enabled : ', enabled);
    if (moduleId == 92) {
      this.subscriptionPermission.enabled = enabled;
    } else if (moduleId == 23) {
      this.portfolioPermission.enabled = enabled;
    } else if (moduleId == 3) {
      this.peoplePermission.enabled = enabled;
    } else if (moduleId == 115) {
      this.backofficePermission.enabled = enabled;
    } else if (moduleId == 1) {
      this.dashboardPermission.enabled = enabled;
    } else if (moduleId == 66) {
      this.activityPermission.enabled = enabled;
    } else if (moduleId == 74) {
      this.transactionPermission.enabled = enabled;
    } else if (moduleId == 8) {
      this.overviewPermission.enabled = enabled;
    } else if (moduleId == 42) {
      this.planPermission.enabled = enabled;
    } else if (moduleId == 122) {
      this.settingPermission.enabled = enabled;
    }
    // if (moduleName == 'Subscriptions') {
    //   this.subscriptionPermission.enabled = enabled;
    // } else if (moduleName == 'Portfolio') {
    //   this.portfolioPermission.enabled = enabled;
    // } else if (moduleName == 'People') {
    //   this.peoplePermission.enabled = enabled;
    // } else if (moduleName == 'Back office') {
    //   this.backofficePermission.enabled = enabled;
    // }
  }

  setSubscriptionSubModulePermissions(subscriptionPermissions) {
    this.subscriptionPermission.subModule.Subscriptions.enabled = subscriptionPermissions.Subscriptions ? subscriptionPermissions.Subscriptions.showModule : false;
    this.subscriptionPermission.subModule.Quotations.enabled = subscriptionPermissions.Quotations ? subscriptionPermissions.Quotations.showModule : false;
    this.subscriptionPermission.subModule.Documents.enabled = subscriptionPermissions.Documents ? subscriptionPermissions.Documents.showModule : false;
    this.subscriptionPermission.subModule.Dashboard.enabled = subscriptionPermissions.Dashboard ? subscriptionPermissions.Dashboard.showModule : false;
    this.subscriptionPermission.subModule.Invoices.enabled = subscriptionPermissions.Invoices ? subscriptionPermissions.Invoices.showModule : false;
    this.subscriptionPermission.subModule.Clients.enabled = subscriptionPermissions.Clients ? subscriptionPermissions.Clients.showModule : false;
    this.subscriptionPermission.subModule.Settings.enabled = subscriptionPermissions.Settings ? subscriptionPermissions.Settings.showModule : false;

  }

  setActivityPermissions(activityPermissions) {
    this.activityPermission.subModule.Tasks.enabled = activityPermissions.Tasks ? activityPermissions.Tasks.showModule : false;
    this.activityPermission.subModule.Emails.enabled = activityPermissions.Emails ? activityPermissions.Emails.showModule : false;
    this.activityPermission.subModule.Calendar.enabled = activityPermissions.Calendar ? activityPermissions.Calendar.showModule : false;
    this.activityPermission.subModule.TaskCapabilityList = activityPermissions.Tasks.subModule.Tasks.capabilityList;
    this.activityPermission.subModule.CalendarCapabilityList = activityPermissions.Calendar.subModule.Calendar.capabilityList;
    this.activityPermission.subModule.EmailCapabilityList = activityPermissions.Emails.subModule.Emails.capabilityList;
  }
}
