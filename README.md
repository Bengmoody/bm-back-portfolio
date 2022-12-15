# Ben Moody Exemplar Work
## Introduction
My name is Ben Moody.
This repository is an example of my work.
This example API is built on the premise of a fictional database used to store data relating to board game reviews, along with associated users, comments and categories.
This data is stored in a relational database via PostgreSQL.

## Functionality
This repo comes with a range of built-in functionality, such as various working and fully-tested end-points.
Some of the end-points utilise parameterised datacapture from the URL.
Others accept optional queries from the user.
The end-points allow a combination of GET, DELETE, PATCH and POST operations.

Below is a link to a hosted version of the database:
[Hosted database](https://bmoody-portfolio.onrender.com/api)

That particular end-point provides .json data explaining all of the available end-points.

## Cloning the repo
To download the repository from github, please execute the following command in your terminal.
By default this will clone into the cwd so please make sure you are in the correct place before cloning:

`git clone https://github.com/Bengmoody/bm-back-portfolio.git`

## Dependencies
After cloning, *cd* into the cloned repo and run the following command:
`npm install`

This will install all dependencies for the project to run.
The dependencies are all available through Node Package Manager, and are currently listed as:

- dot-env - version **16.0.0 or above**
[dot-env docs](https://www.npmjs.com/package/dotenv)

- express - version **4.18.2 or above**
[express docs](https://www.npmjs.com/package/express)

- pg (PostgreSQL) - version **8.7.3 or above**
[PostgreSQL docs](https://node-postgres.com)

- pg-format - version **1.0.4 or above**
[pg-format docs](https://www.npmjs.com/package/pg-format)

This library is based on the Node engine (version **19.0.0**), and utilises the npm package manager (version **8.19.2**).
Versions no earlier than these should be used.

## Further details needed to run the project locally on your machine
In order to run this project, it is necessary to make some .env.* variables.  
These are used by the SQL pool set-up, found in connection.js in the 'db' directory.

This script dynamically detects the run-time environment, identifying if it is in a testing environment or a development one.
This utilises one of the two following .env.* files to calibrate the pool appropriately with the correct PGDATABASE name.

### Setting up the dev path .env.dev
To allow the dev route, make the following file in your main directory:
*.env.dev*
containing the line:
`PGDATABASE="project_database"`

### Setting up the testing path .env.test
To allow the test route, make the following file in your main directory:
*.env.test*
containing the line:
`PGDATABASE="project_database_test"`

Make sure both of these files are added to your *.gitignore* file

## Database seeding
This is done automatically in one of two different ways, depending on the way you are accessing the database.

### dev access
If you are accessing the dev database (*project_database*) you will do so using the following script:

`npm run dev`

The working of this route depends on the installation of a further dev dependency:

- nodemon - version **2.0.20 or above**
[nodemon docs](https://nodemon.io)

This can be installed via the following command:
`npm install -g nodemon`

Once this is installed, the above script will create your pg databases locally, using *./db/setup.sql*.
**N.B. throughout the rest of this file, local paths preceeded by . refer to paths starting in the repository's main directory.**

The script then uses *./db/seeds/run-seed.js* to execute the seed function with a set of dev data.

The dev data has a wider set of data than the test database, and is more akin to a real end-user database.  The data is found in a set of files in the *./db/data/development-data/* directory, as follows:
- categories.js
- comments.js
- reviews.js
- users.js

The *index.js* file in that folder simply requires in the data-sets from the other files in that directory and exports them via *module.exports*.

This data is required in via the *run-seed.js* file and then passed to the database seeding function inside *./db/seeds/seed.js*.

This drops the tables, constructs them again and populates them using the dev data.

Once this is all done, *nodemon* is launched and is set to listen to port: 9090 on the *local host*.  

From here, an external package like [Insomnia] (https://insomnia.rest) can be used to access the api end-points.  

### Testing access
Testing has been conducted with respect to the *jest* package.

Inside the *./__tests__/* folder there is a testing file which can be used to demonstrate the correct working of the repository.

To utilise this, the following module dependencies will be needed:

- jest - version **27.5.1 or above**
[jest docs](https://jestjs.io)

- jest-extended - version **2.0.0 or above**
[jest-extended docs](https://www.npmjs.com/package/jest-extended)

- jest-sorted - version **1.0.14 or above**
[jest-sorted docs](https://www.npmjs.com/package/jest-sorted)

- supertest - version **6.3.3 or above**
[supertest docs](https://www.npmjs.com/package/supertest)

The script `test` is automatically set to set-up the databases locally as per *./db/setup.sql* and to then launch *jest*.

Example usage would be:
`npm test app.test.js`

In the testing access route, database seeding is handled within the *./__tests__/app.test.js* file.

At the start of the test file, the test data is required into the run-time environment from the files in *./db/data/test-data*.  As in the dev access path, these files have the names:
- categories.js
- comments.js
- reviews.js
- users.js

Again, the *index.js* file requires in that data and exports it directly.  

In the `beforeEach()` at the start of the test file, we can see that the database is set to be automatically re-seeded before each *jest* `test()` block, using the test data.  

After all tests have run, the local pool connection will be closed.  

## Closing words
I hope you have found this .readme file useful.

Thank you for downloading my repository.  I hope you enjoy using it.

If you have been directed to this repository personally by myself, please feel free to contact me directly with any feedback.  
