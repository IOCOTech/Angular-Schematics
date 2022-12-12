import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const mainFilePath = 'src'

export function addMainFileConfiguration(): Rule {
    return () => {

        console.log("Adding IOCO main.ts file")
        const mainFileConfigurationRule = generateMainFileConfigurationRule();
        
        return chain([
            mergeWith(mainFileConfigurationRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateMainFileConfigurationRule(): Source {
    return apply(
        url('./main-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${mainFilePath}`)),
        ]
    )
}