#!/usr/bin/env python
# -*- coding: utf-8 -*-
#  * This file is subject to the terms and conditions defined in
# file 'LICENSE.txt', which is part of this source code package
# Copyright (c) JobData Services Limited - All Rights Reserved
#
# Description   : Contains JWT token related functions
##############################################################
"""JWT token related functions"""

import jwt

SECRET = "HJanj67asnans667"

def generate_token(payload):
    encoded = jwt.encode(payload, SECRET, algorithm='HS256')
    return encoded.decode()

def validate_token(token):
    try:
        decoded = jwt.decode(token, SECRET, algorithm='HS256')
        return decoded
    except Exception as e:
        return None
