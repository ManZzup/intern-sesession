#!/usr/bin/env python
# -*- coding: utf-8 -*-
#  * This file is subject to the terms and conditions defined in
# file 'LICENSE.txt', which is part of this source code package
# Copyright (c) JobData Services Limited - All Rights Reserved
#
# Description   : Contains data layer from the common util
##############################################################
"""Database layer functions"""

import pymongo
from pymongo import MongoClient, DESCENDING
from bson import ObjectId
import datetime
import sys
import hashlib

HOST = "localhost"
PORT = 27017
DATABASE = "mockapp"
USERS_COLLECTION = "users"

client = MongoClient(HOST, PORT)
db = client[DATABASE]
users = db[USERS_COLLECTION]

def add_user(user_data):
    user_data["password"] = hashlib.sha224(user_data["password"]).hexdigest()
    user = users.update({
        "username": user_data["username"]
    }, user_data, upsert=True)
    return user


if __name__ == "__main__":
    user1 = {
        "username": "user01",
        "password": "user11235"
    }
    user2 = {
        "username": "user02",
        "password": "user11235"
    }
    user3 = {
        "username": "user03",
        "password": "user11235"
    }

    add_user(user1)
    add_user(user2)
    add_user(user3)