import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const serviceAuthPath = 'services/authentication';
const modelAuthPath = 'models/authorization';

const serviceConfigPath = 'services/config';
const configurationConfigPath = 'src/environments/config';
const configurationConfigRootPath = 'src';

const serviceErrorHandlerPath = 'services/error-handler';

const serviceLoadingScreenPath = 'services/loading-screen';

const serviceMonitorPath = 'services/monitor';

const serviceSnackBarPath = 'services/snack-bar';
const modelSnackBarPath = 'models/snack-bar';

const serviceUserPath = 'services/user';
const modelUserPath = 'models/user';

export function addServices(): Rule {
    return () => {

        console.log("Adding services")
        const authenticationServiceRule = generateAuthenticationServiceRule();
        const authenticationServiceModelsRule = generateAuthenticationServiceModelsRule();

        const configServiceRule = generateConfigServiceRule();
        const configServiceConfigurationRule = generateConfigConfigurationRule();
        const configServiceConfigurationRootModelsRule = generateConfigRootRule();
        
        const errorHandlerServiceRule = generateErrorHandlerServiceRule();
        
        const loadingScreenServiceRule = generateLoadingScreenServiceRule();
        
        const monitorServiceRule = generateMonitorServiceRule();
        
        const snackBarServiceRule = generateSnackBarServiceRule();
        const snackBarModelRule = generateSnackBarModelRule();

        const userServiceRule = generateUserServiceRule();
        const userServiceModelsRule = generateUserServiceModelsRule();
        
        return chain([
            mergeWith(authenticationServiceRule, MergeStrategy.Overwrite),
            mergeWith(authenticationServiceModelsRule, MergeStrategy.Overwrite),
            mergeWith(configServiceRule, MergeStrategy.Overwrite),
            mergeWith(configServiceConfigurationRule, MergeStrategy.Overwrite),
            mergeWith(configServiceConfigurationRootModelsRule, MergeStrategy.Overwrite),
            mergeWith(errorHandlerServiceRule, MergeStrategy.Overwrite),
            mergeWith(loadingScreenServiceRule, MergeStrategy.Overwrite),
            mergeWith(monitorServiceRule, MergeStrategy.Overwrite),
            mergeWith(snackBarServiceRule, MergeStrategy.Overwrite),
            mergeWith(snackBarModelRule, MergeStrategy.Overwrite),
            mergeWith(userServiceRule, MergeStrategy.Overwrite),
            mergeWith(userServiceModelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAuthenticationServiceRule(): Source {
    return apply(
        url('./services-root/authentication.service'),
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
        url('./services-root/authentication.service.models'),
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
        url('./services-root/config.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceConfigPath}`)),
        ]
    )
}
function generateConfigConfigurationRule(): Source {
    return apply(
        url('./services-root/config.service.configuration/environment'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${configurationConfigPath}`)),
        ]
    )
}
function generateConfigRootRule(): Source {
    return apply(
        url('./services-root/config.service.configuration/config-file-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${configurationConfigRootPath}`)),
        ]
    )
}

function generateErrorHandlerServiceRule(): Source {
    return apply(
        url('./services-root/error-handler.service'),
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
        url('./services-root/loading-screen.service'),
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
        url('./services-root/monitor.service'),
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
        url('./services-root/snack-bar.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceSnackBarPath}`)),
        ]
    )
}

function generateSnackBarModelRule(): Source {
    return apply(
        url('./services-root/snack-bar.service.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelSnackBarPath}`)),
        ]
    )
}

function generateUserServiceRule(): Source {
    return apply(
        url('./services-root/user.service'),
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
        url('./services-root/user.service.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelUserPath}`)),
        ]
    )
}
