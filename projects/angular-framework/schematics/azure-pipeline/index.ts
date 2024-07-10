import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const azurePipelinePath = '.azuredevops'

export function addAzurePipeline(): Rule {
    return () => {

        console.log("Adding IOCO default azure pipeline")
        const azurePipelineRule = generateAzurePipelineRule();
        
        return chain([
            mergeWith(azurePipelineRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAzurePipelineRule(): Source {
    return apply(
        url('./files/azure-pipeline.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`${azurePipelinePath}`)),
        ]
    )
}