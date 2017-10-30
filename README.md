# longhorn-js-client

A JavaScript Client for Okapi Longhorn API, written using ReactJS & ES6.

It supports all the API features of [Okapi Longhorn](http://okapiframework.org/wiki/index.php?title=Longhorn)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Demo

* A demo is accessible at [https://clementmouchet.github.io/longhorn-js-client](https://clementmouchet.github.io/longhorn-js-client) using GitHub gh-pages static deployment.

* Another demo is running on Heroku: [https://longhorn-js-client.herokuapp.com](https://longhorn-js-client.herokuapp.com) using a Node Server.

* It's also accessible in a custom build of Okapi Longhorn running on Heroku: [https://okapi-longhorn.herokuapp.com](https://okapi-longhorn.herokuapp.com) using an embBedded Jetty Server.

This demonstrates that the client can be deployed easily anywhere.

_All clients are linked to the Longhorn API deployed [here](https://okapi-longhorn.herokuapp.com)_

## User Guide

The App is very simple, and highlights the 4 key steps.

The left hand side list shows projects in the Longhorn workspace.

Projects can be created or deleted.

### ① Upload batch configuration

The first section has an **optional** text area to specify overrides for the pipeline steps.

> Steps must be specified **before** the `.bconf` is selected & uploaded.

Here's an example:

```xml
<l>
  <e>
     <stepClassName>net.sf.okapi.steps.rainbowkit.creation.ExtractionStep</stepClassName>
     <stepParams>writerClass=net.sf.okapi.steps.rainbowkit.xliff.XLIFFPackageWriter
                 packageName=pack_${srcLang}_${trgLang}
                 packageDirectory=${inputRootDir}
                 supportFiles=
                 message=
                 outputManifest.b=true
                 createZip.b=false
                 sendOutput.b=false
                 writerOptions.placeholderMode.b=true
                 writerOptions.includeNoTranslate.b=true
                 writerOptions.setApprovedAsNoTranslate.b=false
                 writerOptions.copySource.b=true
                 writerOptions.includeAltTrans.b=true
                 writerOptions.includeCodeAttrs.b=true
                 writerOptions.includeIts.b=true
                 writerOptions.useSkeleton.b=true</stepParams>
  </e>
</l>
```

The only requirement in this first step is to select a `.bconf` file.

Once selected, it'll be uploaded automatically. 

> The API doesn't currently expose configuration, so you'll just see a confirm message for 5 seconds.

### ② Upload input files or Okapi work pack

This section has a multi select file input. It supports `.zip` archive, such as work packs, but also individual files.

Once selected, files are uploaded automatically. 

### ③ Configure language combination(s) & Execute

This section has two **optional** language select using select2Js. 
The source select is a single select, the target select is a multi-select. 

> Not all pipeline are suitable for 
multiple languages, please refer to the Okapi Documentation for details.

Click the button to execute the pipeline.

### ④ Download Output Files

This section simply lists the output files, which can be downloaded individually or zipped.

## Deployment Configuration

You can package & serve the content of the `build` folder (see [npm run build](#npm-run-build) below) anywhere you like.

### Environment Variables

`REACT_APP_LONGHORN_URL` can be set to the url of your instance of Longhorn, otherwise it'll default to `https://okapi-longhorn.herokuapp.com`

### Static Server

For environments using Node, the easiest way to handle this would be to install serve and let it handle the rest:

    npm install -g serve

    serve -s build

The last command shown above will serve your static site on the port `5000`. Like many of serve’s internal settings, the port can be adjusted using the `-p` or `--port` flags.

Run this command to get a full list of the options available:

    serve -h

## Development

### npm package.json

In the project directory, you can run:

#### `npm start`

    npm start

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm run start-less`

    npm run start-less

Runs a watcher for changes to the `.less` files, and triggers the `build-less` script when needed.

#### `npm run build`

    npm run build

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

#### `npm run build-less`

    npm run build-less

Compiles the less files to `.css` in the `src/.css` folder.

#### `npm run eject`

    npm run eject

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Docker docker-compose.yml

This spins up an Okapi Longhorn server and an Nginx server acting as a revers proxy allowing `CORS`. This is very 
useful for development.

The Longhorn workspace is mapped to `docker/Okapi-Longhorn-Files` so you can inspect it's content from your 
development environment.