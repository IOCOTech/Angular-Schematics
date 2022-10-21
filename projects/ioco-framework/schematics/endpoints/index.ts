import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const endpointsPath = 'endpoints'

export function addEndpoints(): Rule {
    return () => {

        console.log("Adding endpoints")
        const endpointsRule = generateEndpointsRule();
        
        return chain([
            mergeWith(endpointsRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateEndpointsRule(): Source {
    return apply(
        url('./endpoints-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/environments/${endpointsPath}`)),
        ]
    )
}