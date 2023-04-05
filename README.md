# Facebook Instant Articles Builder

[![CircleCI](https://circleci.com/gh/facebook/instant-articles-builder.svg?style=shield)](https://circleci.com/gh/facebook/instant-articles-builder)

## 🚨 Important Note

**⚠️ Instant Articles will not be available starting April 20, 2023**

All related developer tools will be archived.

---

**Instant Articles Builder** helps you to create a template to build [Facebook Instant Articles](https://instantarticles.fb.com/) from articles on your website.

Try it out (Windows/Mac): https://facebook.github.io/instant-articles-builder/

## Building from source

Run (on the root of the project):

```
npm install
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

## Preview config

To enable the experimental preview of the Instant Article, you can run the webserver locally or point to a remote one.

There are three environment variables that are used to configure the webserver:

- `IA_BUILDER_START_LOCAL_PREVIEW_WEBSERVER` (true|false). Optional.
  - When true, when launching the Builder it will start the local webserver (requires php to be installed locally)
  - Default value: true
- `IA_BUILDER_PREVIEW_WEBSERVER_HOST` ({protocol}:{hostname}). Optional.
  - Example: http://webserver.example.org
  - When present, overrides the location where the webserver is
  - Default value: http://localhost
- `IA_BUILDER_PREVIEW_WEBSERVER_PORT` ({port number}). Optional.
  - When present overrides the port of the webserver
  - Default value: 8105

### Local webserver

To enable the preview using a local webserver (which requires PHP to be installed in your local environment) navigate to the `webserver` directory:

```
cd webserver
```

And install the composer dependencies:

```
composer install
```

### Remote webserver

You may also point to a remote webserver for the preview. To configure the remote webserver you can use the mentioned environment variables, or if you are building from source you can create a file called `.env` in the root of the repo with content similar to:

```
IA_BUILDER_START_LOCAL_PREVIEW_WEBSERVER=false
IA_BUILDER_PREVIEW_WEBSERVER_HOST=http://localhost
IA_BUILDER_PREVIEW_WEBSERVER_PORT=8105
```

You can use the [Docker](https://www.docker.com/) image included in this repo under `docker/webserver` to get a webserver instance running locally in Docker.

#### Single container (no cache)

You can get a single container with the webserver without cache by running the following command to build the image:

```
docker build ./docker/webserver -t ia-webserver
```

and then the following command to run your container and make it accessible through the 8105 port (which is also configurable):

```
docker run -it --rm -p 8105:8000 --name ia-webserver ia-webserver:latest
```

#### Docker-compose (with cache)

Update .env with the port according with docker-compose file. As default, memcache it is configured: "8107:8000".

You can get a webserver with cache (using [memcached](https://memcached.org/)) by running the following command from the `Docker/webserver/ folder:

```
docker-compose up
```

You can take a look at the cache stats by going to http://localhost:11212.

once you are done you can stop both containers with the following command:

```
docker-compose down
```

## License
Please read the [LICENSE](https://github.com/facebook/instant-articles-builder/blob/master/LICENSE) file for more information.
