import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const serviceAuthPath = 'app-services/authentication';
const modelAuthPath = 'models/authentication';

export function addAuthentication(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding authentication...');
        if (tree.exists(serviceAuthPath + '/authentication.service.ts')) {
            context.logger.info('Authentication service already exists, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const authenticationServiceRule = generateAuthenticationServiceRule();
        const authenticationServiceModelsRule = generateAuthenticationServiceModelsRule();
        
        return chain([
            mergeWith(authenticationServiceRule, MergeStrategy.Overwrite),
            mergeWith(authenticationServiceModelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAuthenticationServiceRule(): Source {
    return apply(
        url('./files/authentication.service'),
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
        url('./files/authentication.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelAuthPath}`)),
        ]
    )
}