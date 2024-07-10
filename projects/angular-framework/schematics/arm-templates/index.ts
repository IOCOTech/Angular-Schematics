import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const bicepFilesPath = '.azuredevops/biceps'

export function addBicepFiles(): Rule {
    return () => {

        console.log("Adding bicep files")
        const bicepFilesRule = generateBicepFilesRule();
        
        return chain([
            mergeWith(bicepFilesRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateBicepFilesRule(): Source {
    return apply(
        url('./files/arm-template.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${bicepFilesPath}`)),
        ]
    )
}