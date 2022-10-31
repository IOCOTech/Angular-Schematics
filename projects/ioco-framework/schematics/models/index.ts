import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const karmaPath = 'src/app/models'

export function addModelHelpers(): Rule {
    return () => {

        console.log("Adding IOCO Model helpers")
        const modelHelpersRule = generateModelHelpersRule();
        
        return chain([
            mergeWith(modelHelpersRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateModelHelpersRule(): Source {
    return apply(
        url('./models-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${karmaPath}`)),
        ]
    )
}