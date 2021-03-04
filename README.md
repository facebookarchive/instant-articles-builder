# Facebook Instant Articles Builder

[![CircleCI](https://circleci.com/gh/facebook/instant-articles-builder.svg?style=shield)](https://circleci.com/gh/facebook/instant-articles-builder)

**Instant Articles Builder** helps you to create a template to build [Facebook Instant Articles](https://instantarticles.fb.com/) from articles on your website.

Try it out (Windows/Mac): https://facebook.github.io/instant-articles-builder/

## Building from source

Run (on the root of the project):

```
npm install
```
### Preview config

To enable the experimental preview of the Instant Article, you can run the webserver locally or point to a remote one.

#### Local webserver

To enable the preview using a local webserver (which requires PHP to be installed in your local environment) navigate to the `webserver` directory:

```
cd webserver
```

And install the composer dependencies:

```
composer install
```

#### Remote webserver

You may also point to a remote webserver for the preview. To configure the remote webserver create a file called `.env` in the root of the repo with content similar to:

```
START_LOCAL_PREVIEW_WEBSERVER=false
PREVIEW_WEBSERVER_HOST=http://localhost
PREVIEW_WEBSERVER_PORT=8105
```

You can use the [Docker](https://www.docker.com/) image included in this repo under `docker/webserver` to get a webserver instance running locally in Docker.

Run the following command to build the image:

```
docker build ./docker/webserver -t ia-webserver
```

and then the following command to run your container and make it accessible through the 8105 port (which is also configurable):

```
docker run -it --rm -p 8105:8000 --name ia-webserver ia-webserver:latest
```

### Launching the App

Just run (on the root of the project):

```
npm start
```

### Testing

Run the following command (on the root of the project):

```
npm test
```

## License
Please read the [LICENSE](https://github.com/facebook/instant-articles-builder/blob/master/LICENSE) file for more information.
