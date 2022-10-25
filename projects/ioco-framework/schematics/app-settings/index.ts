import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const appSettingsPath = 'app-settings'

export function addAppSettings(): Rule {
    return () => {

        console.log("Adding app settings")
        const appSettingsRule = generateAppSettingsRule();
        
        return chain([
            mergeWith(appSettingsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAppSettingsRule(): Source {
    return apply(
        url('./app-settings-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/environments/${appSettingsPath}`)),
        ]
    )
}