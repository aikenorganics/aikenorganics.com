Aiken Organics

## Local Setup

### Install Some Dependencies

* [git](http://git-scm.org/)
* [io.js](https://iojs.org/)
* postgresql
* [Heroku Toolbelt](https://toolbelt.heroku.com/)

### Clone the repo

    git clone https://github.com/aikenorganics/aikenorganics.com.git

### Install Packages

    npm install

### Run Tests

    npm test

### Set Environment Variables

* `PORT` - The server port.
* `DATABASE_URL` - Postgres database url.
* `SECRET` - Encryption key for authentication/authorization.
* `LOG_SQL` - If present, SQL queries are logged to STDOUT.
* `AWS_ACCESS_KEY_ID` - Exactly what it sounds like.
* `AWS_SECRET_ACCESS_KEY` - Also what it sounds like.
* `BUCKET` - The S3 bucket to store files in.
* `POSTMARK_API_TOKEN` - The Postmark API token.
* `DOMAIN` - App domain.
* `OPEN` - Is the market open?
