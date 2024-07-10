import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const serviceAuthPath = 'app-services/authentication';
const modelAuthPath = 'models/authentication';
const msalModulePath = 'modules/microsoft-authentication-library';

export function addAuthentication(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding authentication...');
        if (tree.exists(`src/app/${serviceAuthPath}/authentication.service.ts`)) {
            context.logger.info('Authentication service already exists, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const authenticationServiceRule = generateAuthenticationServiceRule();
        const authenticationModelsRule = generateAuthenticationModelsRule();
        const authenticationMSALModuleRule = generateMSALModuleRule();
        
        return chain([
            mergeWith(authenticationServiceRule, MergeStrategy.Overwrite),
            mergeWith(authenticationModelsRule, MergeStrategy.Overwrite),
            mergeWith(authenticationMSALModuleRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAuthenticationServiceRule(): Source {
    return apply(
        url('./files/authentication.app'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceAuthPath}`)),
        ]
    )
}
function generateAuthenticationModelsRule(): Source {
    return apply(
        url('./files/authentication.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelAuthPath}`)),
        ]
    )
}

function generateMSALModuleRule(): Source {
    return apply(
        url('./files/authentication.msal.module'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${msalModulePath}`)),
        ]
    )
}