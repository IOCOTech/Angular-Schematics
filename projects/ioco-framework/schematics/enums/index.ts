import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const enumsPath = 'enums'

export function addEnums(): Rule {
    return () => {

        console.log("Adding enums")
        const enumRule = generateEnumsRule();
        
        return chain([
            mergeWith(enumRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateEnumsRule(): Source {
    return apply(
        url('./enums-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize
            }),
            move(normalize(`src/app/${enumsPath}`)),
        ]
    )
}
