import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const componentPageNotFoundPath = 'components/page-not-found';

export function addPageNotFound(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding page not found...');
        if (tree.exists(`src/app/${componentPageNotFoundPath}/page-not-found.component.ts`)) {
            context.logger.info('Page not found has already been added, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const componentRule = generatePageNotFoundComponentRule();
        
        return chain([
            mergeWith(componentRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generatePageNotFoundComponentRule(): Source {
    return apply(
        url('./files/page-not-found.component'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${componentPageNotFoundPath}`))
        ]
    )
}