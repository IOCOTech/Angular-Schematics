import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const vscodePath = '.vscode';

export function addVSCode(): Rule {
    return () => {

        console.log("Adding .vscode folder")
        const vsCodeRule = generateVSCodeSettingsRule();
        
        return chain([
            mergeWith(vsCodeRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateVSCodeSettingsRule(): Source {
    return apply(
        url('./files/vscode.helpers'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${vscodePath}`)),
        ]
    )
}
