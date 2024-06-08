import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';


export function addAppConfig(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Overwriting app.config...');
        if (!tree.exists(`src/app/app.config.ts`)) {
            context.logger.warn('App.config doesn\'t exist, a new file will be created');
        }

        const configImplementationRule = generateAppConfigImplementationRule();
        
        return chain([
            mergeWith(configImplementationRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateAppConfigImplementationRule(): Source {
    return apply(
        url('./files/app-config.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app`)),
        ]
    )
}