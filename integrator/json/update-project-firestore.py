#!/usr/bin/python3

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import json

FILE_TO_UPLOAD = './vm-pwa.json'

cred = credentials.Certificate('../key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

di = open(FILE_TO_UPLOAD, 'r')
di = json.load(di)
db.collection('IntegratedProjects').document(di['name']).set(di)