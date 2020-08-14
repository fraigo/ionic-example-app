# Ionic Example App

Example Ionic application with additional tooling to create Desktop apps (Mac/Win)

## Prepare environment

### Install Ionic CLI

`npm install -g @ionic/cli`

## Install Electron Packager

`npm install -g electron-packager`

## Update npm packages

`npm install`

## Main commands

* `ionic serve` Run locally (web)
* `ionic build` Build and prepare for platform
* `ionic cap add  [ios|android|electron]` Add iOS/Android/Electron platform
* `ionic cap copy [ios|android|electron]` Copy build source to platform
* `ionic cap sync [ios|android]` Rebuild project using updated configuration
* `ionic cap open [ios|android|electron]` Open the environment to run the application
* `npm run electron:mac` Build a MacOS application package (.app)
* `npm run electron:win` Build a Windows application package (.app)
* `npm run electron:mac-icon` Build MacOS icon (.icns) to copy to Electron build.

