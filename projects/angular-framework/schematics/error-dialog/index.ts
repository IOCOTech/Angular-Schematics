import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const appDialogErrorDialogPath = 'app-services/error-dialog';
const componentErrorDialogPath = 'dialog-boxes/error-dialog';
const modelErrorDialogPath = 'models/dialog-boxes';

export function addErrorDialog(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding error dialog box...');
        if (tree.exists(`src/app/${componentErrorDialogPath}/error-dialog.component.ts`)) {
            context.logger.info('Error dialog box already exists, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const appRule = generateErrorDialogAppRule();
        const componentRule = generateErrorDialogComponentRule();
        const modelsRule = generateErrorDialogModelsRule();
        
        return chain([
            mergeWith(appRule, MergeStrategy.Overwrite),
            mergeWith(componentRule, MergeStrategy.Overwrite),
            mergeWith(modelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateErrorDialogAppRule(): Source {
    return apply(
        url('./files/error-dialog-box.app'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${appDialogErrorDialogPath}`)),
        ]
    )
}

function generateErrorDialogComponentRule(): Source {
    return apply(
        url('./files/error-dialog-box.component'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${componentErrorDialogPath}`)),
        ]
    )
}

function generateErrorDialogModelsRule(): Source {
    return apply(
        url('./files/error-dialog-box.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelErrorDialogPath}`)),
        ]
    )
}
