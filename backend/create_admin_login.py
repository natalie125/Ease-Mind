from app import db, models, bcrypt

# delete existing username and passwords
for p in models.User_Login.query.all():
    db.session.delete(p)

db.session.commit()


# this file exists to run a script that will add our admin login
hashed_password = bcrypt.generate_password_hash("admin")
admin = models.User_Login(email="admin@gmail.com", password=hashed_password)
db.session.add(admin)
db.session.commit()


# shows all details in the database
for p in models.User_Login.query.all():
    print(f'{p.email} {p.password}')
