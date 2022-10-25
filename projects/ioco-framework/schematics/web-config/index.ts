import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const webConfigPath = 'src';

export function addWebConfig(): Rule {
    return () => {

        console.log("Adding web config")
        const webConfigRule = generateWebConfigRule();
        
        return chain([
            mergeWith(webConfigRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateWebConfigRule(): Source {
    return apply(
        url('./web-config-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${webConfigPath}`)),
        ]
    )
}

