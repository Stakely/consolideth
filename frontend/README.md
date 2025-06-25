# Consolideth frontend

## Setup project

Install all dependencies:

```shell
yarn install
```

Run the project in dev mode with HMR.

```shell
yarn dev
```

## Docker image

```shell
docker build -t consolideth-frontend .
```

```shell
docker run -p 4000:80 --name consolideth-frontend consolideth-frontend
```

## Utility Scripts

### Build

Builds the project generating the chunks and static files; Also it will run a
development server to serve the static files. In this mode it takes the variables declared in `.env`.

```shell
yarn preview
```

It builds the project generating chunks and static files without running a development server.
In this mode it takes variables declared in `.env`.

```shell
yarn build
```

### Coding Style

Run prettier and eslint to check for errors in the coding style.

```shell
yarn cs:check
```

Run prettier and eslint in a mode that will try to automatically fix errors.

```shell
yarn cs:fix
```
