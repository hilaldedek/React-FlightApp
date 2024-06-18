from mongoengine import *


class Flight(Document):
    _id = SequenceField(primary_key=True)
    where = StringField(required=True)
    to = StringField(required=True)
    departure = StringField(required=True)
    company = StringField(required=True)
    businessClassPrice = IntField(required=True)
    economicClassPrice = IntField(required=True)
    directPrice = IntField(required=False)
    type = StringField(required=True)
    duration = IntField(required=True)
