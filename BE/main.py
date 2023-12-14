from typing import Optional
from fastapi import FastAPI, Body, HTTPException, Response, status, Depends, Form
from fastapi.middleware.cors import CORSMiddleware

import psycopg2
from pydantic import BaseModel
from random import randrange
import psycopg2
from psycopg2.extras import RealDictCursor
import time

#uvicorn BE.main:app --reload

app = FastAPI()

origins = ["*"] # domains which can talk to api

app.add_middleware( 
    CORSMiddleware, #middleware runs before every request
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# db connection
while True:
    try:
        conn = psycopg2.connect(host='localhost', database='activities', user='postgres', password='root', cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("DB connection successful!")
        break
    except Exception as e:
        print("DB connection failed:\n ", e)
        time.sleep(10)


@app.post('/login')
#def login(user_credentials: User):
def login(username: str = Form(...), password: str = Form(...)): #form input with names username and password are stored in vars with same name

#    cursor.execute("""SELECT * FROM users WHERE email = %s""", (user_credentials.email,)) #comma to fix internal server error
    cursor.execute("""SELECT email, type FROM users WHERE email = %s and password = %s""", (username, password)) #comma to fix internal server error
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    return {"creds": user}

@app.post('/users')
#def register(user_credentials: User):
def register(username: str = Form(...), password: str = Form(...), type: str = Form(...)): #form input with names username and password are stored in vars with same name

    cursor.execute("""INSERT INTO users (email, password, type) VALUES (%s, %s, %s) RETURNING *""", (username, password, type))
    new_user = cursor.fetchone()
    conn.commit()
    return {"data":new_user}

@app.post("/upload", status_code=status.HTTP_201_CREATED)
def submit_activity(user_id: str = Form(...), semester: str = Form(...), category: str = Form(...), title: str = Form(...), proof: str = Form(...)):
    cursor.execute("""INSERT INTO actable (user_id, semester, category, title, proof) VALUES (%s, %s, %s, %s, %s) RETURNING *""", (user_id, semester, category, title, proof))
    new_post = cursor.fetchone()
    conn.commit()
    return {"data":new_post}

@app.post("/view")
def get_activities(user_id: str = Form(...)):
    cursor.execute("""SELECT semester, category, title, proof, points FROM actable where user_id = (%s) ORDER BY semester DESC""", (user_id, ))
    acts = cursor.fetchall()
    return {"data": acts} 

@app.post("/total")
def get_total(user_id: str = Form(...)):
    cursor.execute("""SELECT sum(points) FROM actable where user_id = (%s)""", (user_id, ))
    tot = cursor.fetchone()
    return {"data": tot} 


@app.post("/teacher/allot")
def allot_points(post_id: str = Form(...), points: str = Form(...)):
    cursor.execute("""UPDATE actable set points = (%s) WHERE id = (%s) RETURNING *""", (points, post_id))
    updates = cursor.fetchone()
    conn.commit()
    return {"data": updates} 

@app.get("/teacher/viewold")
def get_old():
    cursor.execute("""SELECT user_id,SUM(points) FROM actable GROUP BY user_id""")
    rows = cursor.fetchall()
    return {"data": rows} 

@app.get("/teacher/viewnew")
def get_new():
    cursor.execute("""SELECT id,user_id,category,title,proof FROM actable WHERE points is NULL ORDER BY user_id""")
    rows = cursor.fetchall()
    return {"data": rows} 

# url/docs or url/redoc for viewing auto created documentation
