import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

export function addWebConfig(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding web config...');
        if (tree.exists(`src/web.config`)) {
            context.logger.info('Web.Config already exists, delete the file if you want to regenerate it');
            return tree;
        }

        const implementationRule = generateImplementationRule();
        
        return chain([
            mergeWith(implementationRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateImplementationRule(): Source {
    return apply(
        url('./files/web-config.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src`)),
        ]
    )
}
