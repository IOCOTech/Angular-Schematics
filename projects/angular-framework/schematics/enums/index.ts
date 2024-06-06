import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const enumsAllPath = 'enums';
const enumsStandalonePath = 'enums/standalone';

export function addEnums(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding Enums structure...');
        if (tree.exists(`src/app/${enumsAllPath}/enums.ts`)) {
            context.logger.info('Enums has already been added, delete the directory if you want to regenerate it');
            return tree;
        }

        const enumsAllRule = generateEnumsAllRule();
        const enumsStandaloneRule = generateEnumsStandaloneRule();
        
        return chain([
            mergeWith(enumsAllRule, MergeStrategy.Overwrite),
            mergeWith(enumsStandaloneRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateEnumsAllRule(): Source {
    return apply(
        url('./files/enums.all'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${enumsAllPath}`)),
        ]
    )
}

function generateEnumsStandaloneRule(): Source {
    return apply(
        url('./files/enums.standalone'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${enumsStandalonePath}`)),
        ]
    )
}