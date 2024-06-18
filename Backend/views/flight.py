from xml.dom import ValidationErr
from flask import jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt, jwt_required
from flask_restful import Resource
from models.flight import Flight
from datetime import datetime
from flask import request


class FlightSearch(Resource):
    # @jwt_required()
    @cross_origin()
    def get(self):
        print(request.get_json())
        data = request.get_json()
        print(data["where"])
        flights = Flight.objects(where=data["where"], to=data["to"]).all()
        formatted_posts = [
            {
                "_id": str(flight.id),
                "where": flight.where,
                "to": flight.to,
                "departure": flight.departure,
                "company": flight.company,
                "businessClassPrice": flight.businessClassPrice,
                "economicClassPrice": flight.economicClassPrice,
                "directPrice": flight.directPrice,
                "type": flight.type,
                "duration": flight.duration,
            }
            for flight in flights
        ]
        return make_response(jsonify({"posts": formatted_posts, "status": "200"}), 200)


class AddFlight(Resource):
    @cross_origin()
    def post(self):
        data = request.get_json()
        direct_price = data.get(
            "directPrice", 0
        )
        new_flight = Flight(
            where=data.get("where"),
            to=data.get("to"),
            departure=data.get("departure"),
            company=data.get("company"),
            businessClassPrice=int(data.get("bussinessClassPrice")),
            economicClassPrice=int(data.get("economicClassPrice")),
            directPrice=int(direct_price),
            type=data.get("flightType"),
            duration=int(data.get("duration")),
        )

        try:
            new_flight.save()  # Saving the flight to the database
        except ValidationErr:
            return make_response(
                jsonify({"message": "Doğrulama hatası", "status": "400"}),
                400,
            )

        return make_response(
            jsonify({"message": "Yeni uçuş başarıyla eklendi.", "status": "201"}),
            201,
        )
