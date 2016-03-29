#!/usr/bin/env python
import logging
import os

import tornado.httpserver
import tornado.ioloop
import tornado.web

from timedelta import config
from timedelta.routes import get_routes

log = logging.getLogger('timedelta.app')


class TimedeltaApplication(tornado.web.Application):

    """The global web app singleton."""

    def __init__(self):
        settings = {
            "static_path": os.path.abspath(
                os.path.join(os.path.dirname(__file__), "../static")),
            "template_path": os.path.abspath(
                os.path.join(os.path.dirname(__file__), "../templates")),
            "cookie_secret": "NotVeryRandomRightNow",
            # "login_url": "/login",
            "xsrf_cookies": True,
            "autoreload": config.get('tornado.autoreload', False),
            "debug": config.get('tornado.debug', False),
        }

        log.info({
            'event': 'app init',
            'settings': settings,
        })

        tornado.web.Application.__init__(self, get_routes(settings), **settings)


def main():
    """The main web worker entry point."""
    app = TimedeltaApplication()
    http_server = tornado.httpserver.HTTPServer(app)
    http_port = config.get('timedelta.port', 9000)

    log.info({
        'event': 'http listener starting',
        'port': http_port,
    })

    http_server.listen(http_port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
