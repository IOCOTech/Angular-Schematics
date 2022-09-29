import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const helpersPath = 'helpers'

export function addHelpers(): Rule {
    return () => {

        console.log("Adding helpers")
        const helpersRule = generateHelpersRule();
        
        return chain([
            mergeWith(helpersRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateHelpersRule(): Source {
    return apply(
        url('./helpers-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${helpersPath}`)),
        ]
    )
}
