import tornado.web

from timedelta.handlers.main_handler import MainHandler


def get_routes(settings):
    return [
        (r"/", MainHandler),
        (r"/(apple-touch-icon\.png)", tornado.web.StaticFileHandler,
         dict(path=settings['static_path'])),
    ]
