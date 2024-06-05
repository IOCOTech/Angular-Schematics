import { Rule, SchematicContext, SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { RunSchematicTask } from "@angular-devkit/schematics/tasks";
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange, RemoveChange, applyToUpdateRecorder } from '@schematics/angular/utility/change';
import * as ts from 'typescript';


const appConfigPath = '/src/app/app.config.ts';


export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding IOCO Angular Framework.....');

        if (!tree.exists(appConfigPath)) {
            throw new SchematicsException(`The file ${appConfigPath} doesn't exists...`);
        }
        const recorder = tree.beginUpdate(appConfigPath);

        addImportsToAppConfig(tree, recorder, context);
        addProvidersToAppConfig(tree, recorder, context);

        tree.commitUpdate(recorder);
        
        // Run tasks to add custom schematics
        context.addTask(new RunSchematicTask('authentication', {tree, context}));


        // context.logger.info('Installing dependencies...');
        // context.addTask(new NodePackageInstallTask());
        return tree;
    }


    function addImportsToAppConfig(tree: Tree, recorder: UpdateRecorder, context: SchematicContext) {
        context.logger.info('AppConfig: Adding imports');

        const imports: Record<string, string> =
        {
            'HTTP_INTERCEPTORS': '@angular/common/http',
            'provideHttpClient': '@angular/common/http',
            'withFetch': '@angular/common/http',
            'withInterceptorsFromDi': '@angular/common/http',
            'APP_INITIALIZER': '@angular/core',
            'importProvidersFrom': '@angular/core',
            'provideAnimationsAsync': '@angular/platform-browser/animations/async',
            'Router': '@angular/router',
            'AppConfig': './app-services/config/config.app',
            'FactoryAppConfig': './app-services/config/config.app.factory',
            'NavigationRoutes': './app.routes',
            'InterceptorError': './interceptors/error.interceptor',
            'InterceptorLoadingScreen': './interceptors/loading-indicator.interceptor',
            'MicrosoftAuthenticationLibraryModule': './modules/microsoft-authentication-library/microsoft-authentication-library.module',
        }

        addImportsToFile(tree, recorder, appConfigPath, imports)
        return tree;
    };

    function addProvidersToAppConfig(tree: Tree, recorder: UpdateRecorder, context: SchematicContext) {
        context.logger.info('AppConfig: Adding providers');

        const providersToAdd: string[] = [
            `importProvidersFrom(MicrosoftAuthenticationLibraryModule.forRoot())`,
            `provideHttpClient(withInterceptorsFromDi(), withFetch())`,
            `provideRouter(NavigationRoutes.routes)`,
            `provideAnimationsAsync()`,
            `{ provide: APP_INITIALIZER, useFactory: FactoryAppConfig, deps: [AppConfig, Router], multi: true, }`,
            `{ provide: HTTP_INTERCEPTORS, useClass: InterceptorLoadingScreen, multi: true }`,
            `{ provide: HTTP_INTERCEPTORS, useClass: InterceptorError, multi: true }`
        ]

        const changes: Change[] = [];

        const text = tree.read(appConfigPath);
        if (text === null) { throw new SchematicsException(`The file ${appConfigPath} doesn't exists...`); }
        const source = ts.createSourceFile(appConfigPath, text.toString(), ts.ScriptTarget.Latest, true) as any;
        // Find the providers array in the app.config file
        const nodes = source.statements.filter(ts.isVariableStatement);

        const appConfigNode = nodes.find((node: any) => {
            const variableDeclaration = (node.declarationList.declarations[0] as ts.VariableDeclaration).name.getText();
            return variableDeclaration === 'appConfig';
        });


        if (!appConfigNode) {
            throw new Error(`Could not find 'appConfig' in ${appConfigPath}.`);
        }

        const appConfig = (appConfigNode.declarationList.declarations[0] as ts.VariableDeclaration)
            .initializer as ts.ObjectLiteralExpression;

        const providersProperty = appConfig.properties.find(property =>
            ts.isPropertyAssignment(property) && property.name.getText() === 'providers'
        ) as ts.PropertyAssignment;

        if (!providersProperty) {
            throw new Error(`Could not find 'providers' property in 'appConfig'.`);
        }


        const startPos = providersProperty.initializer.getStart();

        // Clear the array from all default providers
        changes.push(new RemoveChange(appConfigPath, startPos, '[provideRouter(routes)]'));

        const providersArray = providersProperty.initializer as ts.ArrayLiteralExpression;

        changes.push(new InsertChange(appConfigPath, startPos, '[\n'));
        providersToAdd.forEach(providerName => {
            const change = new InsertChange(appConfigPath, providersArray.end - 1, `\t\t${providerName},\n`);
            changes.push(change);
        });
        changes.push(new RemoveChange(appConfigPath, providersArray.end - 1, ','));
        changes.push(new InsertChange(appConfigPath, providersArray.end, '\t]'));

        applyToUpdateRecorder(recorder, changes);

        return tree;
    }

    function addImportsToFile(
        tree: Tree,
        recorder: UpdateRecorder,
        filePath: string,
        imports: Record<string, string>
    ) {
        const changes: Change[] = [];
        const text = tree.read(filePath);
        if (text === null) { throw new SchematicsException(`The file ${filePath} doesn't exists...`); }
        const source = ts.createSourceFile(filePath, text.toString(), ts.ScriptTarget.Latest, true) as any;

        for (const importName in imports) {
            const change = insertImport(source, filePath, importName, imports[importName]);
            if (change instanceof InsertChange) {
                changes.push(change);
            }
        }
        applyToUpdateRecorder(recorder, changes);
    };
}