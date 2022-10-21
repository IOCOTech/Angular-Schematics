import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const unitTestHelpersPath = 'unit-tests-helpers'

export function addUnitTestHelpers(): Rule {
    return () => {

        console.log("Adding unit test helpers")
        const unitTestHelpersRule = generateUnitTestHelpersRule();
        
        return chain([
            mergeWith(unitTestHelpersRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateUnitTestHelpersRule(): Source {
    return apply(
        url('./unit-test-helpers-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${unitTestHelpersPath}`)),
        ]
    )
}
