import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url } from '@angular-devkit/schematics';

const mockDataPath = 'mock-data'

export function addMockData(): Rule {
    return () => {

        console.log("Adding mock-data")
        const mockDataRule = generateMockDataRule();
        
        return chain([
            mergeWith(mockDataRule, MergeStrategy.Overwrite),
        ]);
    }
}

function generateMockDataRule(): Source {
    return apply(
        url('./mock-data-root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${mockDataPath}`)),
        ]
    )
}
