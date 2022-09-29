import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const interceptorsPath = 'interceptors'

export function addInterceptors(): Rule {
    return () => {

        console.log("Adding interceptors")
        const interceptorsRule = generateInterceptorsRule();
        
        return chain([
            mergeWith(interceptorsRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateInterceptorsRule(): Source {
    return apply(
        url('./interceptors-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${interceptorsPath}`)),
        ]
    )
}
