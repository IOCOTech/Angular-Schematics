import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from "@angular-devkit/schematics/tasks";
// import { addImportToModule } from '@schematics/angular/utility/ast-utils';
// import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
// import * as ts from 'typescript';

export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding IOCO Framework.....');

        const modulePath = 'src/app/app.module.ts'
        if (!tree.exists(modulePath)) {
            throw new SchematicsException(`the file ${modulePath} doesn't exist`)
        }

        // const recorder = tree.beginUpdate(modulePath);

        // const text = tree.read(modulePath);

        // if (text === null) {
        //     throw new SchematicsException(`The file ${modulePath} doesn't exists...`);
        // }

        // const source = ts.createSourceFile(
        //     modulePath,
        //     text.toString(),
        //     ts.ScriptTarget.Latest,
        //     true
        // ) as any;

        // applyToUpdateRecorder(recorder,
        //     addImportToModule(source, modulePath, 'SuperUiLibModule', 'super-ui-lib')
        // );

        // tree.commitUpdate(recorder);

        context.addTask(new RunSchematicTask('components', {}));
        context.addTask(new RunSchematicTask('dialog-boxes', {}));
        context.addTask(new RunSchematicTask('enums', {}));
        context.addTask(new RunSchematicTask('helpers', {}));
        context.addTask(new RunSchematicTask('interceptors', {}));
        context.addTask(new RunSchematicTask('material-design', {}));
        context.addTask(new RunSchematicTask('msal', {}));
        context.addTask(new RunSchematicTask('mock-data', {}));
        context.addTask(new RunSchematicTask('services', {}));

        context.logger.info('Adding Angular Material.....');
        context.addTask(new RunSchematicTask('@angular/material', 'ng-add', {
            theme: "custom",
            typography: true,
            animations: "true"
        }));
        context.logger.info('Adding Flex Layout.....');
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
        context.addTask(new NodePackageInstallTask({ packageName: 'concurrently --save-dev' } ));
        context.addTask(new NodePackageInstallTask({ packageName: 'dev-error-reporter --save-dev' } ));
        context.addTask(new NodePackageInstallTask({ packageName: 'json-concat --save-dev' } ));
        context.addTask(new NodePackageInstallTask({ packageName: 'json-server --save-dev' } ));
        context.addTask(new NodePackageInstallTask({ packageName: 'karma-junit-reporter --save-dev' } ));
        context.addTask(new NodePackageInstallTask({ packageName: 'onchange --save-dev' } ));
        context.addTask(new NodePackageInstallTask({ packageName: 'typescript-json-schema --save-dev' } ));


        // const rule = chain([
        //     generateRepo(name),
        //     merged
        // ]);

        // return rule(tree, _context) as Rule;

        return tree

    }
}