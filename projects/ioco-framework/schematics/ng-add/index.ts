import { Rule, SchematicContext, SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from "@angular-devkit/schematics/tasks";
// import {
//     addPackageJsonDependency,
//     NodeDependencyType
// } from '@schematics/angular/utility/dependencies';
import { addImportToModule, addSymbolToNgModuleMetadata, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

const modulePath = 'src/app/app.module.ts'

export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding IOCO Framework.....');


        if (!tree.exists(modulePath)) {
            throw new SchematicsException(`the file ${modulePath} doesn't exist`)
        }
        const recorder = tree.beginUpdate(modulePath);

        addImportsToAppModuleFile(tree, recorder);
        addProvidersToAppModuleFile(tree, recorder);
        addImportBarrelsToAppModuleFile(tree, recorder);

        tree.commitUpdate(recorder);

        context.addTask(new RunSchematicTask('components', {}));
        context.addTask(new RunSchematicTask('dialog-boxes', {}));
        context.addTask(new RunSchematicTask('endpoints', {}));
        context.addTask(new RunSchematicTask('enums', {}));
        context.addTask(new RunSchematicTask('helpers', {}));
        context.addTask(new RunSchematicTask('interceptors', {}));
        context.addTask(new RunSchematicTask('material-design', {}));
        context.addTask(new RunSchematicTask('msal', {}));
        context.addTask(new RunSchematicTask('mock-data', {}));
        context.addTask(new RunSchematicTask('services', {}));
        context.addTask(new RunSchematicTask('unit-test-helpers', {}));

        context.logger.info('Adding Angular Material.....');
        context.addTask(new RunSchematicTask('@angular/material', 'ng-add', {
            theme: "custom",
            typography: true,
            animations: "true"
        }));
        context.logger.info('Adding Flex Layout.....');
        // addPackageJsonDependency(tree, { type: NodeDependencyType.Default, name: "@angular/flex-layout", version: "latest", overwrite: true })
        context.addTask(new NodePackageInstallTask({ packageName: '@angular/flex-layout' }));
        context.addTask(new NodePackageInstallTask({ packageName: '@angular/cdk' }));
        context.logger.info('Adding Microsoft Authentication Library.....');
        context.addTask(new NodePackageInstallTask({ packageName: '@azure/msal-browser' }));
        context.addTask(new NodePackageInstallTask({ packageName: '@azure/msal-angular@latest' }));
        context.logger.info('Adding Application insights.....');
        context.addTask(new NodePackageInstallTask({ packageName: '@microsoft/applicationinsights-web' }));
        context.logger.info('Adding ESLint.....');
        context.addTask(new RunSchematicTask('@angular-eslint/schematics', 'ng-add', {}));
        context.logger.info('Adding DevDependencies.....');

        context.addTask(new NodePackageInstallTask({ packageName: 'concurrently --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'dev-error-reporter --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'json-concat --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'json-server --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'karma-junit-reporter --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'onchange --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'typescript-json-schema --save-dev' }));

        addScriptToPackageJson(tree, "build:config", "npx typescript-json-schema \"src/environments/config/config.interface.ts\" \"IConfig\" -o \"src/environments/config/config.schema.json\" --required true")
        addScriptToPackageJson(tree, "build:prod", "ng build -c production")
        addScriptToPackageJson(tree, "build:db", "json-concat ./src/app/mock-data/separated-entities/ ./src/app/mock-data/db.json")
        addScriptToPackageJson(tree, "start:mock-server", "npm run build:db & json-server --watch ./src/app/mock-data/db.json --silent")
        addScriptToPackageJson(tree, "start:mock", "concurrently \"ng serve --configuration=mock\" \"npm run start:mock-server\" \"npm run lint:watch\"")
        addScriptToPackageJson(tree, "start:dev", "ng serve --configuration=development")
        addScriptToPackageJson(tree, "lint:fix", "npm run lint --silent -- --fix")
        addScriptToPackageJson(tree, "lint:watch", "onchange \"src/**/*.ts\" -- onerror \"npm run lint --silent\"  -t Error -m \"There are linting errors on your Angular project\"")
        addScriptToPackageJson(tree, "e2e", "ng e2e")


        // const rule = chain([
        //     generateRepo(name),
        //     merged
        // ]);

        // return rule(tree, _context) as Rule;

        return tree

    }
}

function addImportsToAppModuleFile(tree: Tree, recorder: UpdateRecorder) {

    const imports: Record<string, string> =
    {
        'MaterialDesignModule.forRoot()': './modules/material-design/material-design.module',
        'MicrosoftAuthenticationLibraryModule.forRoot()': './modules/microsoft-authentication-library/microsoft-authentication-library.module'
    };

    const text = tree.read(modulePath);
    if (text === null) { throw new SchematicsException(`The file ${modulePath} doesn't exists...`); }
    const source = ts.createSourceFile(modulePath, text.toString(), ts.ScriptTarget.Latest, true) as any;

    for (const importName in imports) {
        const importContext = addImportToModule(source, modulePath, importName, imports[importName])
        applyToUpdateRecorder(recorder, importContext);
    }
}

function addProvidersToAppModuleFile(tree: Tree, recorder: UpdateRecorder) {

    const providers: string[] = [
        `// APP INITIALIZER'
       { provide: APP_INITIALIZER, useFactory: FactoryServiceConfig, deps: [ServiceConfig, Router], multi: true },
       // HTTP INTERCEPTORS
       { provide: HTTP_INTERCEPTORS, useClass: InterceptorLoadingScreen, multi: true },
       { provide: HTTP_INTERCEPTORS, useClass: InterceptorError, multi: true },
       { provide: AbstractEndpoints, useFactory: FactoryEndpoints, deps: [ServiceConfig, ServiceMonitoring] },
       {
          provide: AbstractServiceAuthentication,
          useFactory: FactoryServiceAuthentication,
          deps: [MsalService, MsalBroadcastService, AbstractEndpoints, ServiceMonitoring]
        },
        { provide: ErrorHandler, useClass: ConsoleErrorHandler }`,
    ];

    const text = tree.read(modulePath);
    if (text === null) { throw new SchematicsException(`The file ${modulePath} doesn't exists...`); }
    const source = ts.createSourceFile(modulePath, text.toString(), ts.ScriptTarget.Latest, true) as any;

    providers.forEach((provider: string) => {
        const providerContext = addSymbolToNgModuleMetadata(source, modulePath, 'providers', provider, null)
        applyToUpdateRecorder(recorder, providerContext);
    })
}

function addImportBarrelsToAppModuleFile(tree: Tree, recorder: UpdateRecorder) {

    const imports: Record<string, string> =
    {
        'AbstractEndpoints': 'src/environments/endpoints/endpoints.abstract',
        'AbstractServiceAuthentication': './services/authentication/authentication.service.abstract',
        'APP_INITIALIZER': '@angular/core',
        'ConsoleErrorHandler': '../app/helpers/console-error.helper',
        'ErrorHandler': '@angular/core',
        'FactoryEndpoints': 'src/environments/endpoints/endpoints.factory',
        'FactoryServiceAuthentication': './services/authentication/authentication.service.factory',
        'FactoryServiceConfig': './services/config/config.service.factory',
        'HTTP_INTERCEPTORS': '@angular/common/http',
        'HttpClient': '@angular/common/http',
        'HttpClientModule': '@angular/common/http',
        'InterceptorError': './interceptors/error.interceptor',
        'InterceptorLoadingScreen': './interceptors/loading.interceptor',
        'ServiceConfig': './services/config.service/config.service',
        'ServiceMonitoring': './services/monitor/monitor.service',
        'ServiceSnackBar': './services/snack-bar/snack-bar.service'
    };

    const text = tree.read(modulePath);
    if (text === null) { throw new SchematicsException(`The file ${modulePath} doesn't exists...`); }
    const source = ts.createSourceFile(modulePath, text.toString(), ts.ScriptTarget.Latest, true) as any;

    for (const importName in imports) {
        const importContext = [insertImport(source, modulePath, importName, imports[importName])]
        applyToUpdateRecorder(recorder, importContext);
    }
}

interface PackageJson {
    scripts: Record<string, string>;
}
function addScriptToPackageJson(tree: Tree, scriptName: string, scriptContent: string): Tree {
    if (tree.exists("package.json")) {
        const sourceText = tree.read("package.json")!.toString("utf-8");
        const json = JSON.parse(sourceText) as PackageJson;
        if (!json.scripts) {
            json.scripts = {};
        }
        if (!json.scripts[scriptName]) {
            json.scripts[scriptName] = scriptContent;
            json.scripts = sortObjectByKeys(json.scripts);
        }
        tree.overwrite("package.json", JSON.stringify(json, null, 2));
    }
    return tree;
}

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: Record<string, string>) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {} as Record<string, string>);
}
