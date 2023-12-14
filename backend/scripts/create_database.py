import sys
sys.path.append('../backend')

from app import db
db.create_all()
