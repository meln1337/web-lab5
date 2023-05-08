import pytest
from app import app

app_client = app.test_client()

def test_ad_type_get():
    res = app_client.get("/advertisement_type")
    assert res.status_code == 200

def test_ad_type_post():
    res1 = app_client.post("/advertisement_type", json={
        "name": "Local"
    })
    assert res1.status_code == 201
    assert res1.data.decode("utf-8") == '{"name": "Local"}'

    res2 = app_client.post("/advertisement_type", json={
        "name": "Public"
    })
    assert res2.status_code == 201
    assert res2.data.decode("utf-8") == '{"name": "Public"}'

    res3 = app_client.post("/advertisement_type", json={
        "name": "third ad type"
    })
    assert res3.status_code == 201
    assert res3.data.decode("utf-8") == '{"name": "third ad type"}'

def test_ad_type_put():
    res = app_client.put("/advertisement_type", json={
        "id": 3,
        "name": "third ad type edited"
    })
    assert res.status_code == 200
    assert res.data.decode("utf-8") == '{"name": "third ad type edited"}'

def test_place_get():
    res = app_client.get("/place")
    assert res.status_code == 200

def test_place_post():
    res1 = app_client.post("/place", json={
        "name": "Lviv"
    })
    assert res1.status_code == 201
    assert res1.data.decode("utf-8") == '{"name": "Lviv"}'

    res2 = app_client.post("/place", json={
        "name": "Kyiv"
    })
    assert res2.status_code == 201
    assert res2.data.decode("utf-8") == '{"name": "Kyiv"}'

    res3 = app_client.post("/place", json={
        "name": "Kharkiv"
    })
    assert res3.status_code == 201
    assert res3.data.decode("utf-8") == '{"name": "Kharkiv"}'

def test_place_put():
    res = app_client.put("/place", json={
        "id": 3,
        "name": "Chernivtsi"
    })
    assert res.status_code == 200
    assert res.data.decode("utf-8") == '{"name": "Chernivtsi"}'

def test_user_get():
    res = app_client.get("/user")
    assert res.status_code == 200

def test_user_post():
    res1 = app_client.post("/user", json={
        "username": "user1",
        "email": "user1@gmail.com",
        "password": "password",
        "place_id": 1,
        "is_superuser": False
    })

    assert res1.status_code == 201
    assert res1.data.decode("utf-8") == '{"email": "user1@gmail.com", "is_superuser": false, "place_id": 1, "username": "user1"}'

    res2 = app_client.post("/user", json={
            "username": "superuser",
        "email": "superuser@gmail.com",
        "password": "password",
        "place_id": 2,
        "is_superuser": True
    })

    assert res2.status_code == 201
    assert res2.data.decode(
        "utf-8") == '{"email": "superuser@gmail.com", "is_superuser": true, "place_id": 2, "username": "superuser"}'

    res3 = app_client.post("/user", json={
        "username": "user3",
        "email": "user3@gmail.com",
        "password": "password",
        "place_id": 1,
        "is_superuser": False
    })

    assert res3.status_code == 201
    assert res3.data.decode(
        "utf-8") == '{"email": "user3@gmail.com", "is_superuser": false, "place_id": 1, "username": "user3"}'

user1_token = "Basic dXNlcjE6cGFzc3dvcmQ="
superuser_token = "Basic c3VwZXJ1c2VyOnBhc3N3b3Jk"
user3_token = "Basic dXNlcjM6cGFzc3dvcmQ="

def test_authentication():
    res1 = app_client.post("/authentication", json={
        "username": "user1",
        "password": "password"
    })

    assert res1.status_code == 200
    assert dict(res1.headers)["Authorization"] == user1_token

    res2 = app_client.post("/authentication", json={
        "username": "superuser",
        "password": "password"
    })

    assert res2.status_code == 200
    assert dict(res2.headers)["Authorization"] == superuser_token

    res3 = app_client.post("/authentication", json={
        "username": "user3",
        "password": "password"
    })

    assert res3.status_code == 200
    assert dict(res3.headers)["Authorization"] == user3_token

def test_check_authentication():
    res1 = app_client.get("/test", headers={
        "Authorization": user1_token
    })

    print(res1.data.decode("utf-8"))

    assert res1.status_code == 200
    assert res1.data.decode("utf-8") == '{"message": "test"}'

def test_user_put():
    res1 = app_client.put("/user", json={
        "id": 3,
        "username": "user3.1",
        "email": "user3.1@gmail.com",
        "password": "password",
        "place_id": 1,
        "is_superuser": False
    }, headers={
        "Authorization": user3_token
    })

    assert res1.status_code == 200
    assert res1.data.decode("utf-8") == '{"email": "user3.1@gmail.com", "is_superuser": false, "place_id": 1, "username": "user3.1"}'

def test_authentication_2():
    global user3_token
    res1 = app_client.post("/authentication", json={
        "username": "user3.1",
        "password": "password"
    })

    assert res1.status_code == 200
    user3_token = dict(res1.headers)["Authorization"]

def test_user_delete():
    res1 = app_client.delete("/user/3", headers={
        "Authorization": user3_token
    })

    assert res1.status_code == 200
    assert res1.data.decode("utf-8") == '{"message": "user with id=3 has been deleted"}'

def test_ad_get():
    res1 = app_client.get("/advertisement")

    assert res1.status_code == 200

def test_ad_post():
    res1 = app_client.post("/advertisement", json={
        "text": "Ad 1",
        "type_id": 1,
        "place_id": 2
    }, headers={
        "Authorization": user1_token
    })

    assert res1.status_code == 201
    assert res1.data.decode("utf-8") == '{"author_id": 1, "place_id": 2, "text": "Ad 1", "type_id": 1}'

    res2 = app_client.post("/advertisement", json={
        "text": "Ad 2",
        "type_id": 2,
        "place_id": 2
    }, headers={
        "Authorization": superuser_token
    })

    assert res2.status_code == 201
    assert res2.data.decode("utf-8") == '{"author_id": 2, "place_id": 2, "text": "Ad 2", "type_id": 2}'

    res3 = app_client.post("/advertisement", json={
        "text": "Ad 3",
        "type_id": 1,
        "place_id": 1
    }, headers={
        "Authorization": user1_token
    })

    assert res3.status_code == 201
    assert res3.data.decode("utf-8") == '{"author_id": 1, "place_id": 1, "text": "Ad 3", "type_id": 1}'

def test_ad_get_2():
    res1 = app_client.get("/advertisement")

    print(res1.data.decode("utf-8"))

    assert res1.status_code == 200
    assert res1.data.decode("utf-8") == '[{"author_id": 2, "id": 2, "place_id": 2, "text": "Ad 2", "type_id": 2}]'

    res2 = app_client.get("/advertisement", headers={
        "Authorization": user1_token
    })

    print(res2.data.decode("utf-8"))

    assert res2.status_code == 200
    assert res2.data.decode("utf-8") == '[{"author_id": 2, "id": 2, "place_id": 2, "text": "Ad 2", "type_id": 2}, {"author_id": 1, "id": 3, "place_id": 1, "text": "Ad 3", "type_id": 1}]'

    res3 = app_client.get("/advertisement", headers={
        "Authorization": superuser_token
    })

    print(res3.data.decode("utf-8"))

    assert res3.status_code == 200
    assert res3.data.decode("utf-8") == '[{"author_id": 1, "id": 1, "place_id": 2, "text": "Ad 1", "type_id": 1}, {"author_id": 2, "id": 2, "place_id": 2, "text": "Ad 2", "type_id": 2}, {"author_id": 1, "id": 3, "place_id": 1, "text": "Ad 3", "type_id": 1}]'

def test_ad_put():
    res1 = app_client.put("/advertisement", json={
        "id": "1",
        "text": "Ad 1.1",
        "type_id": 1,
        "place_id": 2
    }, headers={
        "Authorization": user1_token
    })

    assert res1.status_code == 200
    assert res1.data.decode("utf-8") == '{"author_id": 1, "place_id": 2, "text": "Ad 1.1", "type_id": 1}'

def test_ad_delete():
    res1 = app_client.delete("/advertisement/1", headers={
        "Authorization": user1_token
    })

    assert res1.status_code == 200
    assert res1.data.decode("utf-8") == '{"message": "advertisement with id=1 has been deleted"}'

def test_delete_data_from_table():
    res = app_client.post("/delete_data_from_table")
    assert res.status_code == 200
    assert res.data.decode("utf-8") == '{"message": "All the rows have been deleted"}'

# pytest test.py
# coverage run -m pytest test.py
# coverage report