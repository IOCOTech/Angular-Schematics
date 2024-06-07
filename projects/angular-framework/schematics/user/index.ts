import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const serviceUserPath = 'services/user';
const modelsUserPath = 'models/user';
const componentsUserPath = 'components';

export function addUserExamples(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding user examples...');
        if (tree.exists(`src/app/${modelsUserPath}/user.model.ts`)) {
            context.logger.info('User examples already exists, delete the directory if you want to regenerate it');
            return tree;
        }

        const serviceRule = generateServiceRule();
        const modelsRule = generateModelsRule();
        const componentsRule = generateComponentsRule();
        
        return chain([
            mergeWith(serviceRule, MergeStrategy.Overwrite),
            mergeWith(modelsRule, MergeStrategy.Overwrite),
            mergeWith(componentsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateServiceRule(): Source {
    return apply(
        url('./files/user.service'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceUserPath}`)),
        ]
    )
}

function generateModelsRule(): Source {
    return apply(
        url('./files/user.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelsUserPath}`)),
        ]
    )
}

function generateComponentsRule(): Source {
    return apply(
        url('./files/user.components'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${componentsUserPath}`)),
        ]
    )
}