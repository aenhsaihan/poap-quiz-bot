## Running backend
- Run `docker-compose up -d` in the `hasura` folder
- Make sure all migrations are applied by running `npm run hasura:apply`
- Start handler server by running `npm run hasura:actions-server:start`
- To do development, start hasura console with `npm run hasura:console`