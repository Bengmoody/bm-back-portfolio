In order to run this project, it is necessary to make some .env.* variables.  
These are used by the SQL pool set-up, found in connection.js in the 'db' directory.

This script dynamically detects the run-time environment, identifying if it is in a testing environment or a development one.
This utilises one of the two following .env.* files to calibrate the pool appropriately with the correct PGDATABASE name.


To allow the dev route, make the following file in your main directory:
.env.dev
containing the line:
PGDATABASE="project_database"

To allow the test route, make the following file in your main directory:
.env.test
containing the line:
PGDATABASE="project_database_test"

Make sure both of these files are added to your .gitignore file