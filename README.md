# IocoFramework

This library is used to add default IOCO functionality to a starter project and to generate basic components | services in the correct format

### Local Testing

- Make sure you have [Verdaccio](https://verdaccio.org) installed and setup/start the server.
- In the Angular Schematics project run `npm install`
- Update the version of the project in the [projects/ioco-framework/package.json](projects/ioco-framework/package.json).
- From the root directory run `npm run build`.  This will build the project and copy the necessary files to the `dist/ioco-framework` directory
- Open a terminal in the `dist/ioco-framework` directory and run `npm publish --registry http://localhost:4873`(  Where the registry url is the Verdaccio server url)
- Create a new angular project using `ng new <your-test-project>`
- In your newly created project run `ng add @ioco-dev/ioco-framework --registry http://localhost:4873`(  Where the registry url is the Verdaccio server url)

### To publish to npmjs.com

- Update the version of the project test locally to ensure everything works.
- Create a new branch and push to the github repository.
- Create a pull request into the main branch.
- Approve and merge the branch into main, this wil automatically publish the new version to [https://www.npmjs.com/package/@ioco-dev/ioco-framework](https://www.npmjs.com/package/@ioco-dev/ioco-framework)

### Framework

To add the framework to a new project create a empty angular project and the run `ng add @ioco-dev/ioco-framework`.

### Services

To add a new service to a project run `ng generate @ioco-dev/ioco-framework:is`.  This will add the four basic files required for IOCO services
