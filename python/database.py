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

HOST = "localhost"
PORT = 27017
DATABASE = "mockapp"
USERS_COLLECTION = "users"

client = MongoClient(HOST, PORT)
db = client[DATABASE]
users = db[USERS_COLLECTION]

def find_user(user_id):
    user = users.find_one({
        "_id": ObjectId(user_id)
    })
    return user

def find_user_by_token(token):
    user = users.find_one({
        "token": token
    })
    return user

def update_user(user_dict):
    user = users.update({
        "_id": user_dict["_id"]
    }, user_dict)
    return user