import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';

const confirmationDialogName = 'confirmation-dialog'
const confirmationDialogPath = 'dialog-boxes'

const errorDialogName = 'error-dialog'
const errorDialogPath = 'dialog-boxes'


const modelsPath = 'models/dialog-data'


export function addDialogBoxes(): Rule {
    return () => {

        console.log("Adding confirmation dialog box")
        const confirmationDialogRule = generateConfirmationDialogRule();
        const errorDialogRule = generateErrorDialogRule();

        const modelsForDialogsRule = generateModelsRule()
        
        return chain([
            externalSchematic('@schematics/angular', 'component', { name: `${confirmationDialogPath}/${confirmationDialogName}` }),
            mergeWith(confirmationDialogRule, MergeStrategy.Overwrite),
            mergeWith(errorDialogRule, MergeStrategy.Overwrite),
            mergeWith(modelsForDialogsRule, MergeStrategy.Overwrite)
        ]);
    }
} 

function generateConfirmationDialogRule(): Source {

    return apply(
        url('./confirmation-dialog'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
                name: confirmationDialogName
            }),
            move(normalize(`src/app/${confirmationDialogPath}/${strings.dasherize(confirmationDialogName)}`)),
        ]
    )
}

function generateErrorDialogRule(): Source {

    return apply(
        url('./error-dialog'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
                name: errorDialogName
            }),
            move(normalize(`src/app/${errorDialogPath}/${strings.dasherize(errorDialogName)}`)),
        ]
    )
}

function generateModelsRule(): Source {
    return apply(url('./models/dialog-data'), [
        applyTemplates({
            dasherize: strings.dasherize
        }),
        move(normalize(`src/app/${modelsPath}`))
    ]);
}