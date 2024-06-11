import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const helpersImplementationPath = 'helpers';
const helpersModelsPath = 'models';

export function addHelpers(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding helper...');
        if (tree.exists(`src/app/${helpersImplementationPath}/helpers.ts`)) {
            context.logger.info('Helper methods already exists, delete the directory if you want to regenerate it');
            return tree;
        }

        const helpersRule = generateHelpersRule();
        const helpersModelsRule = generateHelperModelsRule();
        
        return chain([
            mergeWith(helpersRule, MergeStrategy.Overwrite),
            mergeWith(helpersModelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateHelpersRule(): Source {
    return apply(
        url('./files/helpers.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${helpersImplementationPath}`)),
        ]
    )
}

function generateHelperModelsRule(): Source {
    return apply(
        url('./files/helpers.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${helpersModelsPath}`)),
        ]
    )
}