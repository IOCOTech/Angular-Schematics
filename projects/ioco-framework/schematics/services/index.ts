import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const serviceAuthPath = 'services/authentication';
const modelAuthPath = 'models/authorization';

const serviceConfigPath = 'services/config';
const modelConfigInterfacePath = 'src/environments/config';

const serviceErrorHandlerPath = 'services/error-handler';

const serviceLoadingScreenPath = 'services/loading-screen';

const serviceMonitorPath = 'services/monitor';

const serviceSnackBarPath = 'services/snack-bar';

const serviceUserPath = 'services/user';
const modelUserPath = 'models/user';

export function addServices(): Rule {
    return () => {

        console.log("Adding services")
        const authenticationServiceRule = generateAuthenticationServiceRule();
        const authenticationServiceModelsRule = generateAuthenticationServiceModelsRule();

        const configServiceRule = generateConfigServiceRule();
        const configServiceModelsRule = generateConfigModelsRule();
        
        const errorHandlerServiceRule = generateErrorHandlerServiceRule();
        
        const loadingScreenServiceRule = generateLoadingScreenServiceRule();
        
        const monitorServiceRule = generateMonitorServiceRule();
        
        const snackBarServiceRule = generateSnackBarServiceRule();

        const userServiceRule = generateUserServiceRule();
        const userServiceModelsRule = generateUserServiceModelsRule();
        
        return chain([
            mergeWith(authenticationServiceRule, MergeStrategy.Overwrite),
            mergeWith(authenticationServiceModelsRule, MergeStrategy.Overwrite),
            mergeWith(configServiceRule, MergeStrategy.Overwrite),
            mergeWith(configServiceModelsRule, MergeStrategy.Overwrite),
            mergeWith(errorHandlerServiceRule, MergeStrategy.Overwrite),
            mergeWith(loadingScreenServiceRule, MergeStrategy.Overwrite),
            mergeWith(monitorServiceRule, MergeStrategy.Overwrite),
            mergeWith(snackBarServiceRule, MergeStrategy.Overwrite),
            mergeWith(userServiceRule, MergeStrategy.Overwrite),
            mergeWith(userServiceModelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAuthenticationServiceRule(): Source {
    return apply(
        url('./authentication.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceAuthPath}`)),
        ]
    )
}
function generateAuthenticationServiceModelsRule(): Source {
    return apply(
        url('./authentication.service.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelAuthPath}`)),
        ]
    )
}

function generateConfigServiceRule(): Source {
    return apply(
        url('./config.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceConfigPath}`)),
        ]
    )
}
function generateConfigModelsRule(): Source {
    return apply(
        url('./config.service.models/interface'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${modelConfigInterfacePath}`)),
        ]
    )
}

function generateErrorHandlerServiceRule(): Source {
    return apply(
        url('./error-handler.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceErrorHandlerPath}`)),
        ]
    )
}

function generateLoadingScreenServiceRule(): Source {
    return apply(
        url('./loading-screen.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceLoadingScreenPath}`)),
        ]
    )
}

function generateMonitorServiceRule(): Source {
    return apply(
        url('./monitor.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceMonitorPath}`)),
        ]
    )
}

function generateSnackBarServiceRule(): Source {
    return apply(
        url('./snack-bar.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceSnackBarPath}`)),
        ]
    )
}

function generateUserServiceRule(): Source {
    return apply(
        url('./user.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceUserPath}`)),
        ]
    )
}
function generateUserServiceModelsRule(): Source {
    return apply(
        url('./user.service.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelUserPath}`)),
        ]
    )
}
