import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const dockerPath = ''

export function addDocker(): Rule {
    return () => {

        console.log("Adding docker files")
        const dockerRule = generateDockerRule();
        
        return chain([
            mergeWith(dockerRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateDockerRule(): Source {
    return apply(
        url('./docker-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${dockerPath}`)),
        ]
    )
}