# MAP OPERATION

Training using a map and a linked intervention list.
You'll find a CRUD of interventions and a visualization of the various elements on the map.

## Technologie used

- Langage: ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
- Markup language: ![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
- Style: ![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
- Framework: ![Svelte](https://img.shields.io/badge/Svelte-FF3E00?logo=svelte&logoColor=white)
- ORM: ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
- Database: ![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)

## How to install ?

1. Copy the repo
2. Make sure you have node installed
If not:

Windows: https://nodejs.org/dist/v20.15.1/node-v20.15.1-x64.msi

Linux:   https://nodejs.org/dist/v20.15.1/node-v20.15.1-linux-x64.tar.xz

OR

Linux:

- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
- `nvm install 20`
- ( you may need to restart the terminal )
- `node -v`
- ( should print v20.15.1 )

3. Type the command `npm i`
4. Type the command `npm run dev -- --open`
5. Enjoy

## Don't want to install ?

You can try it on:

https://operation.pelsy.net

If it doesn't work, it's because the DNS is currently spreading and may cause instable fluctuations on the first week.

## Want to have fun with the API ?

Endpoints :

| Method  | Endpoint                        | Description                     | Body (data)                                 |
|---------|---------------------------------|---------------------------------|---------------------------------------------|
| GET     | `/api/interventions`            | Get the intervention list       | N/A                                         |
| POST    | `/api/interventions`            | Add an intervention             | `{address, date, description, status, type}`|
| DELETE  | `/api/interventions/{id}`       | Delete an intervention          | N/A                                         |
| PUT     | `/api/interventions/{id}`       | Update an intervention          | `{address, date, description, status, type}`|

