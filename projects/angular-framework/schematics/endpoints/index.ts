import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const endpointsImplementationPath = 'services/endpoints';

export function addEndpoints(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding endpoints...');
        if (tree.exists(`src/app/${endpointsImplementationPath}/endpoints.service.ts`)) {
            context.logger.info('Endpoints has already been added, delete the directory if you want to regenerate it');
            return tree;
        }

        const serviceRule = generateEndpointServiceRule();
        
        return chain([
            mergeWith(serviceRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateEndpointServiceRule(): Source {
    return apply(
        url('./files/endpoints.implementation'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${endpointsImplementationPath}`))
        ]
    )
}