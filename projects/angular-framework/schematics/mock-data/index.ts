import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const mockDataPath = 'mock-data';

export function addMockData(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding mock data...');
        if (tree.exists(`src/app/${mockDataPath}/db.generated.json`)) {
            context.logger.info('Mock data already exists, delete the directory if you want to regenerate it');
            return tree;
        }

        const mockDataRule = generateMockDataRule();
        
        return chain([
            mergeWith(mockDataRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateMockDataRule(): Source {
    return apply(
        url('./files/mock-data.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${mockDataPath}`)),
        ]
    )
}