import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const serviceConfigPath = 'app-services/config';
const rootConfigImplementationPath = 'config';

export function addConfiguration(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding configuration...');
        if (tree.exists(`src/app/${serviceConfigPath}/config.app.ts`)) {
            context.logger.info('Config files has already been added, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const configServiceRule = generateConfigServiceRule();
        const configImplementationRule = generateConfigImplementationRule();
        const configRootRule = generateConfigRootRule();
        
        return chain([
            mergeWith(configServiceRule, MergeStrategy.Overwrite),
            mergeWith(configImplementationRule, MergeStrategy.Overwrite),
            mergeWith(configRootRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateConfigServiceRule(): Source {
    return apply(
        url('./files/config.app'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${serviceConfigPath}`)),
        ]
    )
}

function generateConfigImplementationRule(): Source {
    return apply(
        url('./files/config.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/${rootConfigImplementationPath}`)),
        ]
    )
}

function generateConfigRootRule(): Source {
    return apply(
        url('./files/config.root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src`)),
        ]
    )
}