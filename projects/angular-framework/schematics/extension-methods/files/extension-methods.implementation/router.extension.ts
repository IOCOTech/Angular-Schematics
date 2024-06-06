import { ComponentType } from '@angular/cdk/portal';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../app.routes';

//#region EXTENSION METHODS FOR ANGULAR ROUTER

declare module '@angular/router' {
    export interface Router {
        Routes: NavigationRoutes;
        NavigateTo: NavigationHelper;
        GetNavigationParameter<T>(component: ComponentType<T>): T;
        InitializeExtensionMethods(): void;
    }
}

Router.prototype.InitializeExtensionMethods = function () {
    const router = (this as unknown as Router);
    if (!router.NavigateTo) {
        router.NavigateTo = new NavigationHelper(router);
    }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parameters: { [key: string]: any } = {};

Router.prototype.GetNavigationParameter = function <T>(component: ComponentType<T>) {
    return parameters[nameOf(component)] as T;
};

//#endregion

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nameOf<T extends new (...args: any[]) => any>(classType: T): string {
    return classType.name;
}

class NavigationHelper {

    constructor(private router: Router) { }
    
    // AdvertisementAnalytics(advertisementIds: string[], fromDate: Date, toDate: Date): void {
    //     // parameters[nameOf(AdvertisementAnalysisComponent)] = { fromDate: fromDate, toDate: toDate };
    //     // this.router.navigate([`${NavigationRoutes.AdvertisementAnalysis.fullPath}/${advertisementIds.join("&")}`]);
    //     throw new Error("Not Implemented");
    // }

    UserList(): void {
        this.router.navigate([`${NavigationRoutes.UserList.path}`]);
    }

    NotFound(): void {
        this.router.navigate([`${NavigationRoutes.NotFound.fullPath}`]);
    }
}
