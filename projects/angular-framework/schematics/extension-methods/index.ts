import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const extensionMethodsImplementationPath = 'extension-methods';

export function addExtensionMethods(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding extension methods...');
        if (tree.exists(`src/app/${extensionMethodsImplementationPath}/router.extension.ts`)) {
            context.logger.info('Extension methods already exists, delete the directory if you want to regenerate it');
            return tree;
        }

        const extensionMethodsRule = generateExtensionMethodsRule();
        
        return chain([
            mergeWith(extensionMethodsRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateExtensionMethodsRule(): Source {
    return apply(
        url('./files/extension-methods.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${extensionMethodsImplementationPath}`)),
        ]
    )
}