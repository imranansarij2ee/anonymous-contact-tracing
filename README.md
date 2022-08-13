# Anonymous Contact Tracing
# Content
* [Requisites](#requisites)
* [App Structure](#App-structure)
* [Install, Configure & Run](#install-configure--run)
* [Enviroment](#Enviroment)
* [List of Routes](#API-routes)

# Requisites
* node (>= 18.7.2)
* tsc (>= 4.7.4)
* typescript (>= 4.7.4)
* postgres ()
* neo4j ()

# App Structure
```bash
├── dist
├── src
│   ├── controller
│   │     ├── survey.ts
│   │     └── user.ts
│   │ 
│   │
│   ├── database
│   │      ├── neo.ts
│   │      └── user.ts
│   │      
│   ├── schema
│   │      ├── monkeypox.json
│   │      └── sample_message.ts    
│   │    
│   ├── helper.ts    
│   ├── index.ts 
│   ├── routes.ts 
│   └── validator.ts 
│   
│   
├── package.json 
├── package-lock.json
├── Procfile
├── README.md
└── tsconfig.json
    
```
# Install, Configure & Run

Below mentioned are the steps to install, configure & run in your platform/distributions.

```bash
# Clone the repo.
git clone https://github.com/imranansarij2ee/anonymous-contact-tracing.git;

# Goto the cloned project folder.
cd anonymous-contact-tracing;
```

```bash
# Install NPM dependencies.
npm install;

# Edit your DotEnv file using any editor of your choice.
# Please Note: You should add all the configurations details
cp .env.example .env;

# Build the app
npm run build

# Run the app
npm start 

OR
 
npm run dev;
```
# Enviroment

develop => https://act-develop.herokuapp.com

# API Routes

```sh
+--------+---------------------------------------------------------------------+
  Method | URI                     |  Description
+--------+---------------------------------------------------------------------+
  POST  | /user                   | generate & return unique username
  GET   | /user/name/:username    | get user by username
  GET   | /user/private/:privateId| get user by private id
  GET   | /user/public/:publicId  | get user by public id
  POST  | /survey                  | accept survey data and persist in neo4j
+--------+----------------------------------------------------------------------+

https://act-develop.herokuapp.com/user
https://act-develop.herokuapp.com/user/name
https://act-develop.herokuapp.com/survey

```
