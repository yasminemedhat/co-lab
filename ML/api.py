# -*- coding: utf-8 -*-
"""
Created on Wed May  6 23:23:40 2020

@author: Loujaina
"""

from flask import Flask, jsonify, request
import pickle as pkl
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

app = Flask(__name__)
tokenizer = None
model = None

def load():
    # load the pre-trained Keras model (here we are using a model
    # pre-trained on ImageNet and provided by Keras, but you can
    # substitute in your own networks just as easily)
    global model, tokenizer


    with open('finalTokenizer.pkl', 'rb') as handle:
        tokenizer = pkl.load(handle)
    
    model =load_model('finalModel.h5')


@app.route("/", methods=["POST"])
def index():
    review=request.form.get("review")
    review=tokenizer.texts_to_sequences([review])
    review=pad_sequences(review,250)

    pred=model.predict(review)


    return jsonify({"rating": str(np.argmax(pred)+1)})


if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
        "please wait until server has fully started"))
    load()
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)

