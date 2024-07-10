import { normalize } from '@angular-devkit/core';
import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, strings, url, SchematicContext, Tree} from '@angular-devkit/schematics';

const appLoadingIndicatorPath = 'app-services/loading-indicator';
const componentLoadingIndicatorPath = 'components/loading-indicator';
const interceptorLoadingIndicatorPath = 'interceptors';

export function addLoadingIndicator(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding loading indicator...');
        if (tree.exists(`src/app/${appLoadingIndicatorPath}/loading-indicator.app.ts`)) {
            context.logger.info('Loading indicator has already been added, delete the directory for the service if you want to regenerate it');
            return tree;
        }

        const appRule = generateLoadingIndicatorRule();
        const componentRule = generateLoadingIndicatorComponentRule();
        const interceptorRule = generateLoadingIndicatorInterceptorRule();
        
        return chain([
            mergeWith(appRule, MergeStrategy.Overwrite),
            mergeWith(componentRule, MergeStrategy.Overwrite),
            mergeWith(interceptorRule, MergeStrategy.Overwrite)
        ]);
    }
}

function generateLoadingIndicatorRule(): Source {
    return apply(
        url('./files/loading-indicator.app'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${appLoadingIndicatorPath}`)),
        ]
    )
}

function generateLoadingIndicatorComponentRule(): Source {
    return apply(
        url('./files/loading-indicator.component'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${componentLoadingIndicatorPath}`)),
        ]
    )
}

function generateLoadingIndicatorInterceptorRule(): Source {
    return apply(
        url('./files/loading-indicator.interceptor'),
        [
            applyTemplates({
                dasherize: strings.dasherize,
            }),
            move(normalize(`src/app/${interceptorLoadingIndicatorPath}`)),
        ]
    )
}