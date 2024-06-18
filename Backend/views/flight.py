from xml.dom import ValidationErr
from flask import jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt, jwt_required
from flask_restful import Resource
from models.flight import Flight
from datetime import datetime
from flask import request


class FlightSearch(Resource):
    @cross_origin()
    def get(self):
        where = request.args.get("where")
        to = request.args.get("to")
        departure_date = request.args.get("departure")
        company = request.args.get("company")

        regex_pattern = f"^{departure_date}"  #
        if company:
            flights = Flight.objects(
                where=where,
                to=to,
                departure={"$regex": regex_pattern},
                company=company,
            ).all()
        else:
            flights = Flight.objects(
                where=where,
                to=to,
                departure={"$regex": regex_pattern},
            ).all()

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
                "empty": flight.empty,
                "full": flight.full,
            }
            for flight in flights
        ]
        if len(formatted_posts) > 0:
            return make_response(
                jsonify({"flights": formatted_posts, "status": "200"}), 200
            )

        return make_response(
            jsonify({"message": "flights is not found.", "status": "404"}), 404
        )


class AddFlight(Resource):
    @cross_origin()
    def post(self):
        data = request.get_json()
        direct_price = data.get("directPrice", 0)
        new_flight = Flight(
            where=data.get("where"),
            to=data.get("to"),
            departure=data.get("departure"),
            company=data.get("company"),
            businessClassPrice=int(data.get("businessClassPrice")),
            economicClassPrice=int(data.get("economicClassPrice")),
            directPrice=int(direct_price),
            type=data.get("type"),
            duration=int(data.get("duration")),
            empty=[f"Seat {i}" for i in range(1, 11)],
            full=[],
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
