from xml.dom import ValidationErr
from flask import jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from flask_restful import Resource
from models.flight import Flight
from models.ticket import Ticket
from datetime import datetime
from flask import request


class FlightSearch(Resource):
    @cross_origin()
    def post(self):
        data = request.get_json()
        where = data.get("where")
        to = data.get("to")
        departure_date = data.get("departure")
        company = data.get("company")
        print(where, to, departure_date, company)
        regex_pattern = f"^{departure_date}"
        print(regex_pattern)
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
        print(formatted_posts)
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
        print("Data received: ", data)

        new_flight = Flight(
            where=data.get("where"),
            to=data.get("to"),
            departure=data.get("departure"),
            company=data.get("company"),
            businessClassPrice=data.get("businessClassPrice"),
            economicClassPrice=data.get("economicClassPrice"),
            directPrice=direct_price,
            type=data.get("type"),
            duration=data.get("duration"),
            empty=[f"Seat {i}" for i in range(1, 11)],
            full=[],
        )
        try:
            new_flight.save()
        except ValidationErr:
            return make_response(
                jsonify({"message": "Doğrulama hatası", "status": "400"}),
                400,
            )

        return make_response(
            jsonify({"message": "Yeni uçuş başarıyla eklendi.", "status": "201"}),
            201,
        )


class SelectSeat(Resource):
    @cross_origin()
    @jwt_required()
    def put(self):
        current_user = get_jwt_identity()
        data = request.get_json()
        print("DATA: ", data)
        flight_id = data["flight_id"]
        selected_seats = data["selected"]
        flight = Flight.objects(_id=flight_id).first()
        if not flight:
            return make_response(jsonify({"message": "Flight not found"}), 404)
        already_sold_seats = [seat for seat in selected_seats if seat in flight.full]
        if already_sold_seats:
            return make_response(
                jsonify({"message": f"Seats already sold: {already_sold_seats}"}), 400
            )
        flight.update(pull_all__empty=selected_seats, push_all__full=selected_seats)
        existing_ticket = Ticket.objects(
            flight_id=flight_id, username=current_user
        ).first()
        if existing_ticket:
            # Mevcut bilet varsa koltuk numaralarını güncelle
            existing_seats = set(existing_ticket.seat)
            new_seats = set(selected_seats)
            updated_seats = list(existing_seats.union(new_seats))
            existing_ticket.update(set__seat=updated_seats)
            flight.update(pull_all__empty=selected_seats, push_all__full=selected_seats)
            return make_response(
                jsonify(
                    {
                        "message": f"Seats {selected_seats} have been successfully added to your existing reservation."
                    }
                ),
                200,
            )
        else:
            # Mevcut bilet yoksa yeni bilet oluştur
            flight.update(pull_all__empty=selected_seats, push_all__full=selected_seats)
            ticket = Ticket(
                flight_id=data["flight_id"],
                username=current_user,
                where=data["where"],
                to=data["to"],
                departure=data["departure"],
                company=data["company"],
                seat=data["selected"],
            )
            ticket.save()
            return make_response(
                jsonify(
                    {
                        "message": f"Seats {selected_seats} have been successfully reserved."
                    }
                ),
                201,
            )


class FlightsDetail(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        flights = Flight.objects(
            company=current_user,
        ).all()

        formatted_flights = [
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
        print(formatted_flights)
        if len(formatted_flights) > 0:
            return make_response(
                jsonify({"flights": formatted_flights, "status": "200"}), 200
            )

        return make_response(
            jsonify({"message": "flights is not found.", "status": "404"}), 404
        )

    @jwt_required()
    def delete(self):
        current_user = get_jwt_identity()
        data = request.get_json()
        flight_id = data.get("_id")

        if not flight_id:
            return make_response(
                jsonify({"message": "Flight ID is required.", "status": "400"}), 400
            )

        flight = Flight.objects(company=current_user, _id=flight_id).first()

        if flight:
            flight.delete()
            return make_response(
                jsonify({"message": "Flight deleted successfully", "status": "200"}),
                200,
            )
        else:
            return make_response(
                jsonify(
                    {
                        "message": "This Flight does not belong to your company.",
                        "status": "403",
                    }
                ),
                403,
            )


class TicketDetail(Resource):
    @cross_origin()
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        tickets = Ticket.objects(
            username=current_user,
        ).all()
        formatted_tickets = [
            {
                "flight_id": ticket.flight_id,
                "where": ticket.where,
                "to": ticket.to,
                "departure": ticket.departure,
                "company": ticket.company,
                "seat": ticket.seat,
            }
            for ticket in tickets
        ]
        print(formatted_tickets)
        if len(formatted_tickets) > 0:
            return make_response(
                jsonify({"tickets": formatted_tickets, "status": "200"}), 200
            )

        return make_response(
            jsonify({"message": "tickets is not found.", "status": "404"}), 404
        )
