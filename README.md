[![Build Status](https://travis-ci.org/hbouvier/restctl.png)](https://travis-ci.org/hbouvier/restctl)
[![dependency Status](https://david-dm.org/hbouvier/restctl/status.png?theme=shields.io)](https://david-dm.org/hbouvier/restctl#info=dependencies)
[![devDependency Status](https://david-dm.org/hbouvier/restctl/dev-status.png?theme=shields.io)](https://david-dm.org/hbouvier/restctl#info=devDependencies)
[![NPM version](https://badge.fury.io/js/restctl.png)](http://badge.fury.io/js/restctl)

restctl
===

A RESTful client to send HTTP Rest commands (e.g. GET/POST/PUT/DELETE)

## Installation

    sudo npm install -g restctl

## REST CONFIGURATION

	REST_URL  (default: http://127.0.0.1:8080/)

## Usage

### restcrl exit values
	0 = Success (created/modifed/found)
	1 = Not found
	-1 = Server Error

### Version

    restctl version

### GET

    restctl get /store/api/v1/key/version

### PUT

    restctl put /store/api/v1/key/version '0.0.1'

### POST

    restctl post /store/api/v1/key 'I was here'


### DELETE

    restctl delete /store/api/v1/key/version
