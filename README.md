# Collective
An app that allows individuals and organizations to purchase local fresh produces at an affordable price

## Deployed Node Server
[Collective](https://collective-web.herokuapp.com/)

## Instructions for Starting Development
To start developing the app, make sure to install dependencies:
```
npm install
```

Store environment variables by creating a .env file and write:
```
DATABASE_USERNAME=YOUR_MAC_USER_NAME
DATABASE_PASS=your_new_password
DATABASE_NAME=collective
```

To start development, run:
```
npm run start-dev
```

## Postgres Local Instructions & Tips:
1. Install Postgres on local and run the server by following [these instructions](https://launchschool.com/blog/how-to-install-postgresql-on-a-mac)
2. Create database
```
createdb collective
```
3. Use database
```
psql collective
```
4. Inside psql, change postgres password
```
alter user "YOUR_MAC_USER_NAME" with password "NEW_PASSWORD";
```
(semi-colon is a MUST)
5. Inside your .env
```
DATABASE_USERNAME=YOUR_MAC_USER_NAME
DATABASE_PASS=your_new_password
DATABASE_NAME=collective
```
6. Learn how Sequelize works [here](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WXRGp9PytYh)

Other useful commands:
Inside psql:
* Show all tables
```
\dt
```
* Quit from psql
```
\q
```

Outside psql:
* drop database (DANGEROUS)
```
* dropdb collective
```
* If doing sql queries in terminal, you must put double quotes for the table name
```
select * from "Users";
```

## Workflow
Fork the master repo
1. Clone down your fork
2. Make a new branch
3. "git remote add upstream MASTER_REPO_URL"
4. Pick a ticket on Trello "Backlog" and move it to "In Progress"
5. After committing the code and when you're ready to push, make sure to pull down the latest version of the master to your local branch by executing "git pull --rebase upstream master"
6. Push your local code "git push origin BRANCH_NAME"
7. Conduct a pull request of your branch to the master repo
8. Go to Heroku and wait for the review app to finish building
9. Manually test the review app
10. If all good, request a code review on your pull request (look up how)
11. Move Trello ticket from "In Progress" to "Staged for Review"
12. Once a member of the team approves your code, move Trello ticket to "Ready for Production Deploy"
13. Do final checks on the code, test the review app more and push any last minute changes
14. Merge the pull request and move Trello ticket to "Deployed to Production"
15. Announce to all engineering members that new code has been merged and to remember to rebase to merge new code into their local machines
16. If other team members experience uncertain merge conflicts, make sure to work together to resolve them

Happy developing!
