import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const servicesAuthPath = 'services/authentication.service';
const modelsAuthPath = 'models/authorization';

const serviceConfigPath = 'services/config.service';
const modelsConfigInterfacePath = 'src/environments/config';

export function addServices(): Rule {
    return () => {

        console.log("Adding services")
        const authenticationServiceRule = generateAuthenticationServiceRule();
        const authenticationServiceModelsRule = generateAuthenticationServiceModelsRule();
        const configServiceRule = generateConfigServiceRule();
        const configServiceModelsRule = generateConfigModelsRule();
        
        return chain([
            mergeWith(authenticationServiceRule, MergeStrategy.Overwrite),
            mergeWith(authenticationServiceModelsRule, MergeStrategy.Overwrite),
            mergeWith(configServiceRule, MergeStrategy.Overwrite),
            mergeWith(configServiceModelsRule, MergeStrategy.Overwrite)
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
            move(normalize(`src/app/${servicesAuthPath}`)),
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
            move(normalize(`src/app/${modelsAuthPath}`)),
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
            move(normalize(`${modelsConfigInterfacePath}`)),
        ]
    )
}


