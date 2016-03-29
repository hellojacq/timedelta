#!/bin/bash

if [[ "$VIRTUAL_ENV" == "" ]]; then
	. env/bin/activate
fi

PORT=80 FLASK_CONFIG=config/production.yaml fab serve
