# juno

This is the repository with the backend and frontend logic for swapay.club site.

## Local development

### Requirements

You need python 3.6 on your machine and PostgresQL server 11.

### Instruction for PyCharm

The recommended IDE is PyCharm Pro, though the project can be configured on any IDE.

First of all, clone the repository:

    git clone https://github.com/Swapay/juno.git
Open the cloned directory in PyCharm. Then, go to File -> Settings. Choose Project Settings -> Project Interpreter and a new virtualenv interpreter.
Install all dependencies and run migrations as described in the following section.

### Running server
To run the server and to be able to debug you need to go to Edit Configurations in the top right panel. Click + and choose **Django server** template. Click Apply and now the new configuration should be available to run.

If you're working with React frontend, you will also need to add other run configuration. Go again to Edit Configurations, click + and choose **npm** template. Provide the path to package file (`frontend/package.json`) and choose script **start_v2**. 

For convenience, you can also add Compound template configuration and add both above-described configurations. Both will be started simultaneously.

### Keeping env up-to-date

If you just cloned the project or pulled new updates, you need to ensure that all the dependencies are installed in your virtualenv and that your local database is up-to-date. To do that, simply follow the instruction:

    - pip install -r requirements.txt
    - ctrl + alt + r # to call Django management console
    - migrate 
    - go to terminal and cd to frontend directory
    - npm install
After these operations, you should have an up-to-date environment.

### Database

If you don't have Postgres yet, download the 11th version from the [official website](https://www.postgresql.org/download/windows/) and follow the instructions.
Then you have two options:

 1. You can create default database and user that you can find in [code](https://github.com/Swapay/juno/blob/master/juno/database_settings.py#L8-L12)
 2. You can override default settings, having provided env variable as described in the configuration section.

### Configuration

You need to locally create `.env` file. In this file, you put configurations and secrets for connecting to services. You mustn't commit this file.
The main variables that you need to run the server locally:

    # General config 
    SECRET_KEY=<key goes here>
    RUN_ENV=DEV 
    DEFAULT_HOST="http://localhost:8000" 
    GOOGLE_CLIENT_ID=<id> # provide if you need sign in with Google locally
    
    # Email settings 
    USE_EMAIL=FALSE 
    
    # S3 settings 
    USE_S3=FALSE
    
    # Telegram Bot settings 
    USE_BOT=FALSE 
    
    # Logging to MongoDB settings 
    USE_MONGO_LOGGING=FALSE

Additionally you can specify `DEV_DB_NAME`, `DEV_DB_USER`, `DEV_DB_PASSWORD` and `DEV_DB_HOST` to override default connection to database.
