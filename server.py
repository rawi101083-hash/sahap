import http.server
import socketserver
import os

class CORSRequestHandler (http.server.SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

os.chdir("c:/Users/rawi1/Desktop/Sahab_POS")
with socketserver.TCPServer(("", 5503), CORSRequestHandler) as httpd:
    httpd.serve_forever()
