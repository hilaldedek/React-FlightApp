from mongoengine import *
from models.flight import Flight
from models.user import User

class Ticket(Document):
    _id=SequenceField(primary_key=True)
    flight_id=IntField()
    username=StringField()
    where=StringField()
    to=StringField()
    departure=StringField()
    company=StringField()
    seat=ListField(StringField())