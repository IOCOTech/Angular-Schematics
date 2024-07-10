import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const appServicePath = 'app-services';

export function addAppService(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding app service...');
        if (tree.exists(`src/app/${appServicePath}/app-service.app.ts`)) {
            context.logger.info('App service already exists, delete the files if you want to regenerate it');
            return tree;
        }

        const appRule = generateAppRule();
        
        return chain([
            mergeWith(appRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAppRule(): Source {
    return apply(
        url('./files/app-service.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${appServicePath}`)),
        ]
    )
}
