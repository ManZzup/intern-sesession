#!/usr/bin/env python
# -*- coding: utf-8 -*-
#  * This file is subject to the terms and conditions defined in
# file 'LICENSE.txt', which is part of this source code package
# Copyright (c) JobData Services Limited - All Rights Reserved
#
# Description   : Contains Auth API
##############################################################
"""Auth API"""

from flask import Flask, make_response, request
import token_manager

app = Flask(__name__)

@app.route("/token/generate/<user_id>", methods=['GET'])
def generate_token(user_id):
    """ API call to generate new JWT token for a given
        user
    """
    

@app.route("/token/validate", methods=['POST'])
def validate_token():
    pass


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')