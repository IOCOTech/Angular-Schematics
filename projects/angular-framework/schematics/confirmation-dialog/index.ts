import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const dialogConfirmationDialogPath = 'dialog-boxes/confirmation-dialog';
const modelConfirmationDialogPath = 'models/dialog-boxes';

export function addConfirmationDialog(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding confirmation dialog box...');
        if (tree.exists(`src/app/${dialogConfirmationDialogPath}/confirmation-dialog.component.ts`)) {
            context.logger.info('Confirmation dialog box already exists, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const componentRule = generateConfirmationDialogRule();
        const modelsRule = generateConfirmationDialogModelsRule();
        
        return chain([
            mergeWith(componentRule, MergeStrategy.Overwrite),
            mergeWith(modelsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateConfirmationDialogRule(): Source {
    return apply(
        url('./files/confirmation-dialog-box.component'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${dialogConfirmationDialogPath}`)),
        ]
    )
}

function generateConfirmationDialogModelsRule(): Source {
    return apply(
        url('./files/confirmation-dialog-box.models'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${modelConfirmationDialogPath}`)),
        ]
    )
}