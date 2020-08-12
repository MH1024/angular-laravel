# For Front End Angular

## Before Install Angular Front End Dependencies

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.28.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# For Laravel Backend

## Before Install Project Dependencies

Laravel utilizes Composer to manage its dependencies. make sure you install the composer first, or download a copy of the composer.phar. Once you have the PHAR archive, you can either keep it in your local project directory or move to usr/local/bin to use it globally on your system. On Windows, you can use the Composer Windows installer.


## Install Dependencies

In the root of this Laravel application, run the php composer.phar install (or composer install) command to install all of the framework's dependencies. This process requires Git to be installed on the server to successfully complete the installation.

## Set Database

create .env file follow the sample of .env.sample file. Create Databse and fill user and password in .env file.
After create .env file run 
```bash
php artisan jwt:secret
```
to genrate jwt secret settings to .env file.

## Migrate

After create and set database and .env file run 
```bash
php artisan migrate --seed
```
in the root of this Laravel application to create tables and seed some sample date to table.
Then the project can running in the server. use /public directory to serve the application 
