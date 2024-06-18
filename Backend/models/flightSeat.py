from mongoengine import *
from models.flight import Flight

class FlightSeat(Document):
    _id=SequenceField(primary_key=True)
    flightId=ReferenceField(Flight)
    seat=ListField(BooleanField())