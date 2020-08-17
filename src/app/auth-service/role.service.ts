import {Router} from '@angular/router';
import {Injectable} from '@angular/core/src/metadata/*';
import {SettingsService} from '../component/protect-component/AdviserComponent/setting/settings.service';
import {UtilService} from '../services/util.service';
import {AuthService} from "./authService";


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
    this.settingsService.getAdvisorOrClientOrTeamMemberRoles({id: roleId}).subscribe((res) => {
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
}
