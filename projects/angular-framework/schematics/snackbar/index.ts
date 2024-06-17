import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const appSnackbarPath = 'app-services/snackbar';
const modelsSnackbarPath = 'models/snackbar';

export function addSnackbar(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding snackbar...');
        if (tree.exists(`src/app/${modelsSnackbarPath}/snackbar-details.model.ts`)) {
            context.logger.info('Snackbar already exists, delete the files if you want to regenerate it');
            return tree;
        }

        const appRule = generateAppRule();
        const modelsRule = generateModelsRule();
        
        return chain([
            mergeWith(appRule, MergeStrategy.Overwrite),
            mergeWith(modelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAppRule(): Source {
    return apply(
        url('./files/snackbar.app'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${appSnackbarPath}`)),
        ]
    )
}

function generateModelsRule(): Source {
    return apply(
        url('./files/snackbar.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelsSnackbarPath}`)),
        ]
    )
}
