import tornado.web
import tornado.wsgi


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
