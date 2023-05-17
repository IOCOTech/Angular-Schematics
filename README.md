# IocoFramework

This library is used to add default IOCO functionality to a starter project and to generate basic components | services in the correct format

# Local Testing

- Make sure you have [Verdaccio](https://verdaccio.org) installed.
- Run `npm install`
- From the root directory run `npm run build`.  This will build the project and copy the necessary files to the dist directory

## Framework

To add the framework to a new project create a empty angular project and the run `ng add @ioco-dev/ioco-framework`

## Services

To add a new service to a project run `ng generate @ioco-dev/ioco-framework:is`.  This will add the four basic files required for IOCO services
