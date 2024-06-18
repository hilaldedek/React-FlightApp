from mongoengine import *
from models.flight import Flight
from models.user import User

class Ticket(Document):
    _id=SequenceField(primary_key=True)
    userId=ReferenceField(User)
    flightId=ReferenceField(Flight)