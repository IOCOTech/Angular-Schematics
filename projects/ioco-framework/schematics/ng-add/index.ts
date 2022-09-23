import { normalize } from '@angular-devkit/core';
import { apply, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { getWorkspacePath, getWorkspace } from '@schematics/angular/utility/workspace'

export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding IOCO Framework.....');
        const workspace = getWorkspace(host);

        const modulePath = 'src/app/app.module.ts'
        const confirmationDialogTemplatePath = '/src/app/dialog-boxes/confirmation-dialog'
        if (!tree.exists(modulePath)) {
            throw new SchematicsException(`the file ${modulePath} doesn't exist`)
        }

        // const recorderHelpers = tree.beginUpdate(modulePath);

        // // applyToUpdateRecorder(recorderHelpers)

        


        const confirmationDialogTemplate = apply(
            url('./dialog-boxes'),
            [
                move(normalize(confirmationDialogTemplatePath))
            ]
        )

        // Keep so we can run it at the end
        // context.addTask(new NodePackageInstallTask())
        return chain([
            externalSchematic('@schematics/angular', 'component', {}),
            mergeWith(confirmationDialogTemplate, MergeStrategy.Overwrite)
        ])
    }
}