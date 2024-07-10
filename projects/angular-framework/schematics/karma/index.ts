import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const karmaPath = ''

export function addKarmaConfiguration(): Rule {
    return () => {

        console.log("Adding IOCO karma configuration")
        const karmaConfigurationRule = generateKarmaConfigurationRule();
        
        return chain([
            mergeWith(karmaConfigurationRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateKarmaConfigurationRule(): Source {
    return apply(
        url('./files/karma.config'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${karmaPath}`)),
        ]
    )
}