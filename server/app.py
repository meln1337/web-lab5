from flask import Flask, Response, make_response, json, request as req
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from base64 import b64encode, b64decode

from core import s
from models import AdvertisementType, Advertisement, Place, User
from utils import unserialize, validate_email

app = Flask(__name__)
cors = CORS(app)
app.config["Access-Control-Allow-Origin"] = "*"
auth = HTTPBasicAuth()

bcrypt = Bcrypt(app)
app.secret_key = "Secret key"

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:password@localhost:3306/lab9_ap"
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False

db = SQLAlchemy()

def create_app():
    """Construct the core application."""
    application = Flask(__name__)
    application.config.from_object('config')    # Set globals
    db = SQLAlchemy()

    with application.app_context():
        # Initialize globals/extensions in app context
        db.init_app(app)        

        # import routes here
        from . import routes

    return application

def check_authentication(func):
    def wrapper(*args, **kwargs):
        if req.authorization is None:
            return Response(json.dumps({"message": "please, provide token"}), status=400, mimetype="application/json")
        username = req.authorization.get("username")
        password = req.authorization.get("password")
        user = s.query(User).filter(User.username == username).first()
        if user is None:
            return Response(json.dumps({"message": "user with such username doen't exist"}), status=400, mimetype="application/json")
        if not bcrypt.check_password_hash(user.password, password):
            print("Passwords don't match")
            return Response(json.dumps({"message": "Passwords don't match"}), status=400, mimetype="application/json")
        print("Passwords match")
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def check_authorization(func):
    def wrapper(*args, **kwargs):
        if req.authorization is None:
            return Response(json.dumps({"message": "please, provide token"}), status=400, mimetype="application/json")
        username = req.authorization.get("username")
        password = req.authorization.get("password")
        user = s.query(User).filter(User.username == username).first()
        if user is None:
            return Response(json.dumps({"message": "user with such username doen't exist"}), status=400, mimetype="application/json")
        if not bcrypt.check_password_hash(user.password, password):
            print("Passwords don't match")
            return Response(json.dumps({"message": "Passwords don't match"}), status=400, mimetype="application/json")
        print("Passwords match")
        return func(auth_user=user, *args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

def check_authorization_ad_get(func):
    def wrapper(*args, **kwargs):
        if req.authorization is None:
            return func(auth_user=None, *args, **kwargs)
        username = req.authorization.get("username")
        password = req.authorization.get("password")
        user = s.query(User).filter(User.username == username).first()
        if user is None:
            return func(auth_user=None, *args, **kwargs)
        if not bcrypt.check_password_hash(user.password, password):
            return func(auth_user=None, *args, **kwargs)
        print("Passwords match")
        return func(auth_user=user, *args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

@app.route("/advertisement_type", methods=["GET"])
def advertisement_type_get():
    if req.method == "GET":
        ad_types = s.query(AdvertisementType).all()
        data = unserialize(ad_types, ["id", "name"])
        return Response(json.dumps(data), status=200, mimetype="application/json")

@app.route("/advertisement_type", methods=["POST", "PUT"])
def advertisement_type():
    if req.method == "POST":
        body = req.get_json()

        name = body["name"]

        if len(name) == 0:
            return Response(json.dumps({"message": "name can't be empty"}), status=400, mimetype="application/json")
        ad_type = AdvertisementType(name=name)
        s.add(ad_type)
        s.commit()

        return Response(json.dumps({
            "name": name
        }), status=201, mimetype="application/json")
    elif req.method == "PUT":
        body = req.get_json()

        id = body["id"]
        name = body["name"]

        if len(name) == 0:
            return Response(json.dumps({"message": "name can't be empty"}), status=400, mimetype="application/json")

        s.query(AdvertisementType).filter(AdvertisementType.id == id).update({"name": name})
        s.commit()

        return Response(json.dumps({
            "name": name
        }), status=200, mimetype="application/json")


@app.route("/place", methods=["GET"])
def place_get():
    if req.method == "GET":
        places = s.query(Place).all()
        print(places)
        data = unserialize(places, ["id", "name"])
        res = make_response(Response(json.dumps(data), status=200, mimetype="application/json"))
        # res.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:5500"
        # s.commit()
        return res

@app.route("/place", methods=["POST", "PUT"])
def place():
    if req.method == "POST":
        body = req.get_json()

        name = body["name"]

        if len(name) == 0:
            return Response(json.dumps({"message": "name can't be empty"}), status=400, mimetype="application/json")

        place = Place(name=name)
        s.add(place)
        s.commit()

        return Response(json.dumps({
            "name": name
        }), status=201, mimetype="application/json")
    elif req.method == "PUT":
        body = req.get_json()

        id = body["id"]
        name = body["name"]

        if len(name) == 0:
            return Response(json.dumps({"message": "name can't be empty"}), status=400, mimetype="application/json")

        s.query(Place).filter(Place.id == id).update({"name": name})
        s.commit()

        return Response(json.dumps({
            "name": name
        }), status=200, mimetype="application/json")

# @app.route("/place/<int:id>", methods=["DELETE"])
# @check_authorization
# def place_delete():
#     return Response({}, )

@app.route("/advertisement", methods=["GET"])
@check_authorization_ad_get
def advertisement_get(auth_user):
    if req.method == "GET":
        if auth_user is None:
            print('user is none')
            ads = s.query(Advertisement).filter(Advertisement.type_id == 1).all()
            data = unserialize(ads, ["id", "text", "type_id", "place_id", "author_id"])
            return Response(json.dumps(data), status=200, mimetype="application/json")

        if auth_user.is_superuser:
            ads = s.query(Advertisement).all()
            print(ads)
            data = unserialize(ads, ["id", "text", "type_id", "place_id", "author_id"])
            return Response(json.dumps(data), status=200, mimetype="application/json")

        print(auth_user.place_id)
        ads = s.query(Advertisement).filter((Advertisement.type_id == 1) | (Advertisement.place_id == auth_user.place_id)).all()
        data = unserialize(ads, ["id", "text", "type_id", "place_id", "author_id"])
        return Response(json.dumps(data), status=200, mimetype="application/json")

@app.route("/advertisement", methods=["POST", "PUT"])
@check_authorization
def advertisement(auth_user):
    if req.method == "POST":
        body = req.get_json()

        text = body["text"]
        type_id = body["type_id"]
        place_id = body["place_id"]
        author_id = auth_user.id

        if len(text) == 0:
            return Response(json.dumps({"message": "text can't be empty"}), status=400, mimetype="application/json")

        ad = Advertisement(text=text, type_id=type_id, place_id=place_id, author_id=author_id)
        s.add(ad)
        s.commit()

        return Response(json.dumps({
            "text": text,
            "type_id": type_id,
            "place_id": place_id,
            "author_id": author_id
        }), status=201, mimetype="application/json")
    elif req.method == "PUT":
        body = req.get_json()

        id = body["id"]
        text = body["text"]
        type_id = body["type_id"]
        place_id = body["place_id"]
        author_id = auth_user.id

        if len(text) == 0:
            return Response(json.dumps({"message": "data can't be empty"}), status=400, mimetype="application/json")

        ad = s.query(Advertisement).filter(Advertisement.id == id).first()

        if ad is None:
            return Response(json.dumps({"message": "Ad with such id doen't exist"}), status=400, mimetype="application/json")

        if auth_user.is_superuser:
            s.query(Advertisement).filter(Advertisement.id == id).update({
                "text": text,
                "type_id": type_id,
                "place_id": place_id,
                "author_id": author_id
            })
            s.commit()

            return Response(json.dumps({
                "text": text,
                "type_id": type_id,
                "place_id": place_id,
                "author_id": author_id
            }), status=200, mimetype="application/json")

        if ad.author_id == auth_user.id:
            s.query(Advertisement).filter(Advertisement.id == id).update({
                "text": text,
                "type_id": type_id,
                "place_id": place_id,
                "author_id": author_id
            })
            s.commit()

            return Response(json.dumps({
                "text": text,
                "type_id": type_id,
                "place_id": place_id,
                "author_id": author_id
            }), status=200, mimetype="application/json")
        return Response(json.dumps({"message": "Restricted"}), status=401,
                        mimetype="application/json")


@app.route("/advertisement/<int:id>", methods=["DELETE"])
@check_authorization
def advertisement_delete(auth_user, id):
    ad = s.query(Advertisement).filter(Advertisement.id == id).first()

    if ad is None:
        return Response(json.dumps({"message": "Ad with such id doen't exist"}), status=400,
                        mimetype="application/json")

    if auth_user.is_superuser:
        s.query(Advertisement).filter(Advertisement.id == id).delete()
        s.commit()
        return Response(json.dumps({"message": f"advertisement with id={id} has been deleted"}), status=200, mimetype="application/json")

    if ad.author_id == auth_user.id:
        s.query(Advertisement).filter(Advertisement.id == id).delete()
        s.commit()
        return Response(json.dumps({"message": f"advertisement with id={id} has been deleted"}), status=200,
                        mimetype="application/json")
    return Response(json.dumps({"message": "Restricted"}), status=401,
                    mimetype="application/json")

@app.route("/user", methods=["GET"])
def user_get():
    if req.method == "GET":
        users = s.query(User).all()
        data = unserialize(users, ["id", "username", "email", "place_id", "is_superuser"])
        s.close()
        return Response(json.dumps(data), status=200, mimetype="application/json")


@app.route("/user", methods=["POST"])
def user_post():
    if req.method == "POST":
        body = req.get_json()

        username = body["username"]
        email = body["email"]
        password = body["password"]
        place_id = body["place_id"]
        is_superuser = body["is_superuser"]

        if len(username) == 0 or len(email) < 2 or len(password) < 7:
            return Response(json.dumps({"message": "Check length of your data"}), status=400, mimetype="application/json")

        if not validate_email(email):
            return Response(json.dumps({"message": "please, enter correct email"}), status=400, mimetype="application/json")

        hashed_password = bcrypt.generate_password_hash(password)

        user = User(username=username, email=email, password=hashed_password, place_id=place_id, is_superuser=is_superuser)
        s.add(user)
        s.commit()

        return Response(json.dumps({
            "username": username,
            "email": email,
            "place_id": place_id,
            "is_superuser": is_superuser
        }), status=201, mimetype="application/json")

@app.route("/user_change", methods=["PUT"])
def user_put():
    if req.method == "PUT":
        print('here')
        body = req.get_json()
        print('after here')

        print('begin')

        id = body["id"]
        username = body["username"]
        email = body["email"]
            # password = body["password"]
        place_id = body["place_id"]
        is_superuser = body["is_superuser"]

            # if len(username) == 0 or len(email) < 2 or len(password) < 7:
            #     return Response(json.dumps({"message": "Check length of your data"}), status=400, mimetype="application/json")

        if not validate_email(email):
            return Response(json.dumps({"message": "please, enter correct email"}), status=400, mimetype="application/json")


        print("before hashed")
            # hashed_password = bcrypt.generate_password_hash(password)

        s.query(User).filter(User.id == id).update({
                    "username": username,
                    "email": email,
                    # "password": hashed_password,
                    "place_id": place_id,
                    "is_superuser": is_superuser
                })
        s.commit()

        return Response(json.dumps({
                    "username": username,
                    "email": email,
                    "place_id": place_id,
                    "is_superuser": is_superuser
                }), status=200, mimetype="application/json")


@app.route("/user/<int:id>", methods=["DELETE"])
@check_authorization
def user_delete(auth_user, id):
    if auth_user.is_superuser:
        s.query(User).filter(User.id == id).delete()
        s.commit()
        return Response(json.dumps({"message": f"user with id={id} has been deleted"}), status=200, mimetype="application/json")
    if auth_user.id == id:
        s.query(User).filter(User.id == id).delete()
        s.commit()
        return Response(json.dumps({"message": f"user with id={id} has been deleted"}), status=200,
                        mimetype="application/json")
    return Response(json.dumps({"message": "You can't delete user"}), status=401,
                    mimetype="application/json")

@app.route("/authentication", methods=["POST"])
def user_authorization():
    body = req.get_json()
    username = body.get("username")
    password = body.get("password")
    user = s.query(User).filter(User.username == username).first()
    if user is None:
        return Response(json.dumps({"message": "user with such username doen't exist"}), status=400,
                        mimetype="application/json")
    if not bcrypt.check_password_hash(user.password, password):
        print("Passwords don't match")
        return Response(json.dumps({"message": "Password don't match"}), status=400, mimetype="application/json")
    str_to_encode = f"{username}:{password}".encode()
    str_to_encode = b64encode(str_to_encode).decode("utf-8")
    res = Response(json.dumps({"Authorization": f"Basic {str_to_encode}"}), status=200, mimetype="application/json")
    return res

@app.route("/test", methods=["GET"])
@check_authentication
def test():
    return Response(json.dumps({"message": "test"}), status=200, mimetype="application/json")

@app.route("/delete_data_from_table", methods=["POST"])
def delete_data_from_table():
    s.query(Advertisement).delete()
    s.commit()
    s.query(User).delete()
    s.commit()
    s.query(AdvertisementType).delete()
    s.commit()
    s.query(Place).delete()
    s.commit()
    return Response(json.dumps({"message": "All the rows have been deleted"}), status=200, mimetype="application/json")

@app.route("/me", methods=["GET"])
def get_me():
    basic = req.headers['Authorization']
    print(basic)
    basic = basic.split(' ')[1]
    basic_decoded = b64decode(basic).decode("utf-8")
    username = basic_decoded.split(":")[0]
    user = s.query(User).filter(User.username == username).all()
    user = unserialize(user, ["id", "username", "email", "place_id", "is_superuser"])
    return Response(json.dumps(user[0]), status=200, mimetype="application/json")

if __name__ == "__main__":
   app.run()