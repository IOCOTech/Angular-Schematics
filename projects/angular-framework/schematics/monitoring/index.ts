import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const appMonitoringPath = 'app-services/monitoring';

export function addMonitoring(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding application monitoring services...');
        if (tree.exists(`src/app/${appMonitoringPath}/monitoring.app.ts`)) {
            context.logger.info('Monitoring has already been added, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const configAppRule = generateMonitoringRule();
        
        return chain([
            mergeWith(configAppRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateMonitoringRule(): Source {
    return apply(
        url('./files/monitoring.app'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${appMonitoringPath}`)),
        ]
    )
}