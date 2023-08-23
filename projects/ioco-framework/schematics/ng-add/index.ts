import { Rule, SchematicContext, SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from "@angular-devkit/schematics/tasks";
// import {
//     addPackageJsonDependency,
//     NodeDependencyType
// } from '@schematics/angular/utility/dependencies';
import { addImportToModule, addSymbolToNgModuleMetadata, getSourceNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder, InsertChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

const modulePath = 'src/app/app.module.ts'
const indexHTMLPath = 'src/index.html'
const routingModulePath = 'src/app/app-routing.module.ts'
const angularJsonPath = 'angular.json'

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
        addBootstrapToModuleFile(tree, recorder);
        updateAngularJsonOptions(tree);
        updateAngularJsonDevBuildConfiguration(tree);
        addRouteToApp(tree);
        updateIndexHTML(tree);

        tree.commitUpdate(recorder);

        context.addTask(new RunSchematicTask('app-settings', {}));
        context.addTask(new RunSchematicTask('arm-templates', {}));
        context.addTask(new RunSchematicTask('azure-pipeline', {}));
        context.addTask(new RunSchematicTask('components', {}));
        context.addTask(new RunSchematicTask('dialog-boxes', {}));
        context.addTask(new RunSchematicTask('docker', {}));
        context.addTask(new RunSchematicTask('endpoints', {}));
        context.addTask(new RunSchematicTask('enums', {}));
        context.addTask(new RunSchematicTask('helpers', {}));
        context.addTask(new RunSchematicTask('interceptors', {}));
        context.addTask(new RunSchematicTask('karma-config', {}));
        context.addTask(new RunSchematicTask('main-file', {}));
        context.addTask(new RunSchematicTask('material-design', {}));
        context.addTask(new RunSchematicTask('msal', {}));
        context.addTask(new RunSchematicTask('mock-data', {}));
        context.addTask(new RunSchematicTask('model-helpers', {}));
        context.addTask(new RunSchematicTask('services', {}));
        context.addTask(new RunSchematicTask('unit-test-helpers', {}));
        context.addTask(new RunSchematicTask('vscode', {}));
        context.addTask(new RunSchematicTask('web-config', {}));

        context.logger.info('Adding Angular Material.....');
        context.addTask(new RunSchematicTask('@angular/material', 'ng-add', {
            theme: "custom",
            typography: true,
            animations: "true"
        }));
        // context.logger.info('Adding Flex Layout.....');
        // addPackageJsonDependency(tree, { type: NodeDependencyType.Default, name: "@angular/flex-layout", version: "latest", overwrite: true })
        // context.addTask(new NodePackageInstallTask({ packageName: '@angular/flex-layout' }));
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
        context.addTask(new NodePackageInstallTask({ packageName: 'karma-sonarqube-unit-reporter --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'onchange --save-dev' }));
        context.addTask(new NodePackageInstallTask({ packageName: 'typescript-json-schema --save-dev' }));

        addScriptToPackageJson(tree, "build:config", "npx typescript-json-schema \"src/environments/config/config.interface.ts\" \"IConfig\" -o \"src/environments/config/config.schema.json\" --required true")
        addScriptToPackageJson(tree, "build:prod", "ng build -c production")
        addScriptToPackageJson(tree, "build:db", "json-concat ./src/app/mock-data/separated-entities/ ./src/app/mock-data/db.json")
        addScriptToPackageJson(tree, "start:mock-server", "npm run build:db & json-server --watch ./src/app/mock-data/db.json --silent")
        addScriptToPackageJson(tree, "start:mock", "concurrently \"ng serve --configuration=mock\" \"npm run start:mock-server\" \"npm run build:config\" \"npm run lint:watch\"")
        addScriptToPackageJson(tree, "start", "npm run start:mock")
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
        'HttpClientModule': '@angular/common/http',
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

function addBootstrapToModuleFile(tree: Tree, recorder: UpdateRecorder) {

    const bootstraps: string[] = [
        'MsalRedirectComponent',
    ];

    const text = tree.read(modulePath);
    if (text === null) { throw new SchematicsException(`The file ${modulePath} doesn't exists...`); }
    const source = ts.createSourceFile(modulePath, text.toString(), ts.ScriptTarget.Latest, true) as any;

    bootstraps.forEach((provider: string) => {
        const providerContext = addSymbolToNgModuleMetadata(source, modulePath, 'bootstrap', provider, null)
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
        'InterceptorError': './interceptors/error.interceptor',
        'InterceptorLoadingScreen': './interceptors/loading.interceptor',
        'MsalBroadcastService, MsalRedirectComponent, MsalService': '@azure/msal-angular',
        'Router': '@angular/router',
        'ServiceConfig': './services/config/config.service',
        'ServiceMonitoring': './services/monitor/monitor.service'
    };

    const text = tree.read(modulePath);
    if (text === null) { throw new SchematicsException(`The file ${modulePath} doesn't exists...`); }
    const source = ts.createSourceFile(modulePath, text.toString(), ts.ScriptTarget.Latest, true) as any;

    for (const importName in imports) {
        const importContext = [insertImport(source, modulePath, importName, imports[importName])]
        applyToUpdateRecorder(recorder, importContext);
    }
}

function updateAngularJsonOptions(tree: Tree) {

    const assets: string[] = [
        "src/config.json",
        "src/web.config",
    ];

    if (tree.exists(angularJsonPath)) {
        var currentAngularJson = tree.read(angularJsonPath)!.toString('utf-8');
        var json = JSON.parse(currentAngularJson);
        var projectName = Object.keys(json['projects'])[0];
        const optionsJson = json['projects'][projectName]['architect']['build']['options'];
        assets.forEach((asset: string) => {
            optionsJson['assets'].push(asset);
        });

        json['projects'][projectName]['architect']['build']['options'] = optionsJson;
        tree.overwrite(angularJsonPath, JSON.stringify(json, null, 2));
    } else {
        throw new SchematicsException('angular.json not found at ' + angularJsonPath);
    }
    return tree;
}

function updateAngularJsonDevBuildConfiguration(tree: Tree) {

    const assetDev = JSON.parse(
        `[{
            "input": "src/environments/config/dev",
            "output": "/",
            "glob": "config.json"
        }]`
    )
    const fileReplacementsDev = JSON.parse(
        `[{
            "replace": "src/environments/app-settings/app-settings.ts",
            "with": "src/environments/app-settings/app-settings.dev.ts"
        }]`
    )
    const assetMock = JSON.parse(
        `[{
            "input": "src/environments/config/mock",
            "output": "/",
            "glob": "config.json"
        }]`
    )
    const fileReplacementsMock = JSON.parse(
        `[{
            "replace": "src/environments/app-settings/app-settings.ts",
            "with": "src/environments/app-settings/app-settings.mock.ts"
        }]`
    )
    const testOptionsReplacements = JSON.parse(
        `{
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          }`
    )

    if (tree.exists(angularJsonPath)) {
        var currentAngularJson = tree.read(angularJsonPath)!.toString('utf-8');
        var json = JSON.parse(currentAngularJson);
        var projectName = Object.keys(json['projects'])[0];

        const serveConfiguration = JSON.parse(
            `
            {
                "browserTarget": "${projectName}:build:mock"
            }
            `
        )


        const configurationDevJson = json['projects'][projectName]['architect']['build']['configurations']['development'];
        json['projects'][projectName]['architect']['build']['configurations']['mock'] = JSON.parse(JSON.stringify(configurationDevJson));
        const configurationMockJson = json['projects'][projectName]['architect']['build']['configurations']['mock'];

        configurationDevJson['assets'] = assetDev;
        configurationDevJson['fileReplacements'] = fileReplacementsDev;
        json['projects'][projectName]['architect']['build']['configurations']['development'] = configurationDevJson;

        configurationMockJson['assets'] = assetMock;
        configurationMockJson['fileReplacements'] = fileReplacementsMock;
        json['projects'][projectName]['architect']['build']['configurations']['mock'] = configurationMockJson;

        const configurationServe = json['projects'][projectName]['architect']['serve']['configurations']
        configurationServe['mock'] = serveConfiguration;
        json['projects'][projectName]['architect']['serve']['configurations'] = configurationServe;

        const configurationTest = json['projects'][projectName]['architect']['test']
        configurationTest["options"] = testOptionsReplacements
        json['projects'][projectName]['architect']['test'] = configurationTest;

        tree.overwrite(angularJsonPath, JSON.stringify(json, null, 2));
    } else {
        throw new SchematicsException('angular.json not found at ' + angularJsonPath);
    }
    return tree;
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
        json.scripts[scriptName] = scriptContent;
        json.scripts = sortObjectByKeys(json.scripts);
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

function addRouteToApp(tree: Tree) {
    // tslint:disable-next-line
    const appRouting = tree.read(routingModulePath)!.toString('utf-8');
    const src = ts.createSourceFile('app-routing.module.ts', appRouting, ts.ScriptTarget.Latest, true) as any;
    const route = `
        { path: '', component: NotFoundComponent },
        { path: NavigationRoutes.NotFound.path, component: NotFoundComponent, canActivate: [AbstractRouteGuard]  }
    `;
    const nodes = getSourceNodes(src);
    const routeNodes = nodes
        .filter((n: any) => {
            if (n.kind === ts.SyntaxKind.VariableDeclaration) {
                if (
                    n.getChildren().findIndex((c: any) => {
                        return (
                            c.kind === ts.SyntaxKind.Identifier && c.getText() === 'routes'
                        );
                    }) !== -1
                ) {
                    return true;
                }
            }
            return false;
        })
        .map((n: any) => {
            const arrNodes = n
                .getChildren()
                .filter((c: any) => (c.kind = ts.SyntaxKind.ArrayLiteralExpression));
            return arrNodes[arrNodes.length - 1];
        });
    if (routeNodes.length === 1) {
        const navigation: ts.ArrayLiteralExpression = routeNodes[0] as ts.ArrayLiteralExpression;
        const pos = navigation.getStart() + 1;
        const fullText = navigation.getFullText();
        let toInsert = '';
        if (navigation.elements.length > 0) {
            if (fullText.match(/\r\n/)) {
                toInsert = `${(fullText.match(/\r\n(\r?)\s*/) as any)[0]}${route},`;
            } else {
                toInsert = `${route},`;
            }
        } else {
            toInsert = `${route}`;
        }
        const recorder = tree.beginUpdate(routingModulePath);

        const imports: Record<string, string> =
        {
            'AbstractRouteGuard': './modules/microsoft-authentication-library/route-guard/route-mock.guard.abstract',
            'NavigationRoutes': './helpers/navigation.routes.helper',
            'NotFoundComponent': './components/not-found/not-found.component'
        }

        // const importRouterGuard = insertImport(src, routingModulePath,'AbstractRouteGuard', './modules/microsoft-authentication-library/route-guard/route-mock.guard.abstract');
        // recorder.insertLeft((importRouterGuard as InsertChange).pos, (importRouterGuard as InsertChange).toAdd );
        // const importRouterGuard = insertImport(src, routingModulePath,'NavigationRoutes', './modules/microsoft-authentication-library/route-guard/route-mock.guard.abstract');
        // recorder.insertLeft((importRouterGuard as InsertChange).pos, (importRouterGuard as InsertChange).toAdd );

        for (const importName in imports) {
            const importInstance = insertImport(src, routingModulePath, importName, imports[importName]);
            recorder.insertLeft((importInstance as InsertChange).pos, (importInstance as InsertChange).toAdd);
        }
        recorder.insertRight(pos, toInsert);
        tree.commitUpdate(recorder);
    }
}

function updateIndexHTML(tree: Tree) {
    const elementToInsert = "<app-redirect></app-redirect>";
    const content = tree.read(indexHTMLPath);
    if (content === null) { throw new SchematicsException(`The file ${indexHTMLPath} doesn't exists...`); }
    let text = content.toString();
    const appendIndex = text.indexOf('</app-root>') + 11;
    const updatedContent = text.slice(0, appendIndex) + elementToInsert + text.slice(appendIndex);
    tree.overwrite(indexHTMLPath, updatedContent);
}
