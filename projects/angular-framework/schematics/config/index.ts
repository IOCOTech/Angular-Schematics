import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const serviceConfigPath = 'app-services/config';
const modelAuthPath = 'config';

export function addConfiguration(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding configuration...');
        if (tree.exists(`src/app/${serviceConfigPath}/config.app.ts`)) {
            context.logger.info('Config files has already been added, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const configServiceRule = generateConfigServiceRule();
        const configRootRule = generateConfigRootRule();
        
        return chain([
            mergeWith(configServiceRule, MergeStrategy.Overwrite),
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

function generateConfigRootRule(): Source {
    return apply(
        url('./files/config.root'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/${modelAuthPath}`)),
        ]
    )
}