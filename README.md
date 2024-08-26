# Public Space Maintenance Request Management System (PSM-RMS)

This project is the frontend of a (under construction) Public Space Maintenance Request Management System app built with Angular.
The application allows citizens to submit requests related to public cleanliness and green spaces issues, which are then managed by officers.
Admins have oversight and control over the application.

## Project Overview

This application is designed to facilitate:

- User **Authentication** and **Authorization** based on credentials and role.
- **Citizens**: To submit requests for public space maintenance issues.
- **Officers**: To review and manage maintenance requests.
- **Admins**: To oversee the system, manage users, and have control over various administrative functions.

## Features

- **Request Submission**: Citizens can create and submit requests for maintenance issues. They can also view a list of their submitted requests along with their status (pending, in progress, complete).
- **Request Management**: Officers of the Municipality can view all the submitted requests and assign them to the relevant department.
- **Administrative Tools**: Admins can manage users and departments and access various system metrics
  (e.g. can view all signed up users, view all existing departments and add/edit/delete a department etc.).

## Installation

To get started with the application, follow these steps:

1. Clone the repository.
2. Install the required dependencies.
3. Run the application.

## Development server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Contributing

If you want to contribute to this project, please fork the repository and submit a pull request with your changes.
