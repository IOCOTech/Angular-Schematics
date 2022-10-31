import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, strings, url } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { ParameterNewService } from './new-service-parameters';

export function GenerateNewService(options: ParameterNewService): Rule {
    return () => {
        const templateSource = apply(
            url('./new-service-root'), [
            applyTemplates({
                classify: strings.classify,
                dasherize: strings.dasherize,
                name: options.name
            }),
            move(normalize(`/${strings.dasherize(options.name)}`))
        ]
        )
        return chain([
            mergeWith(templateSource, MergeStrategy.Error)
        ])
    }
}