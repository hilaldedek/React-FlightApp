from flask import Flask
from mongoengine import connect
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from views.flight import FlightSearch,AddFlight
from views.user import Login, Logout, Register

app = Flask(__name__)

CORS(app, supports_credentials=True, origins="*", host=3000)

app.config["JWT_SECRET_KEY"] = (
    "your_secret_key"
)


jwt = JWTManager(app)

api = Api(app)


connect(host="mongodb://localhost:27017/FlightApp")

api.add_resource(Login, "/user/auth/login")
api.add_resource(Register, "/user/auth/register")
api.add_resource(Logout, "/user/auth/logout")
api.add_resource(
    FlightSearch,
    "/flight-result",
)
api.add_resource(AddFlight,"/add-flight")


if __name__ == "__main__":
    app.run(debug=True)
