import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const snackbarModelsPath = 'models/snackbar';

export function addSnackBar(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding snackbar...');
        if (tree.exists(`src/app${snackbarModelsPath}/snackbar-details.model.ts`)) {
            context.logger.info('Snackbar model already exists, delete the file if you want to regenerate it');
            return tree;
        }

        const implementationRule = generateModelsRule();
        
        return chain([
            mergeWith(implementationRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateModelsRule(): Source {
    return apply(
        url('./files/snackbar.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${snackbarModelsPath}`)),
        ]
    )
}
