import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';


export function addAppComponent(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding app component...');
        if (tree.exists(`src/app/app.component.ts`)) {
            // context.logger.info('App component already exists, delete the directory if you want to regenerate it');
        }

        const componentRule = generateComponentRule();
        
        return chain([
            mergeWith(componentRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateComponentRule(): Source {
    return apply(
        url('./files/app-component.component'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app`)),
        ]
    )
}
