import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const modelsRouterPath = 'models/router';

export function addRouter(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding extension methods...');
        if (tree.exists(`src/app/${modelsRouterPath}/route-extended.model.ts`)) {
            context.logger.info('Customized router already exists, delete the directory if you want to regenerate it');
            return tree;
        }

        const implementationRule = generateImplementationRule();
        const modelsRule = generateModelsRule();
        
        return chain([
            mergeWith(implementationRule, MergeStrategy.Overwrite),
            mergeWith(modelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateImplementationRule(): Source {
    return apply(
        url('./files/router.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app`)),
        ]
    )
}

function generateModelsRule(): Source {
    return apply(
        url('./files/router.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelsRouterPath}`)),
        ]
    )
}