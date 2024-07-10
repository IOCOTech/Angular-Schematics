import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const errorInterceptorPath = 'interceptors';

export function addErrorInterceptor(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding error interceptor...');
        if (tree.exists(`src/app/${errorInterceptorPath}/error.interceptor.ts`)) {
            context.logger.info('Error interceptor already exists, delete the file if you want to regenerate it');
            return tree;
        }

        const interceptorRule = generateInterceptorRule();
        
        return chain([
            mergeWith(interceptorRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateInterceptorRule(): Source {
    return apply(
        url('./files/error.interceptor'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${errorInterceptorPath}`)),
        ]
    )
}