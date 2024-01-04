import sys
sys.path.append('../backend')

from app import db, models, bcrypt

# delete existing username and passwords
for p in models.Users.query.all():
    db.session.delete(p)
db.session.commit()

# add our admin login
hashed_password = bcrypt.generate_password_hash("admin")
admin = models.Users(email="admin@gmail.com", password=hashed_password)
db.session.add(admin)
db.session.commit()

# show all user emails and passwords in the database
for p in models.Users.query.all():
    print(f'{p.email} {p.password}')
