# cmu-ep-test

## Project setup
```
setup .env file
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Docker Deploy
```
docker build -t cmu-ep-test .
```
docker run -d -p 80:80 --rm --name cmu-ep-test cmu-ep-test
```
### Docker configuration
See [Document Reference](https://docs.docker.com/engine/reference/commandline/docker/).