FROM python:3.7 

RUN mkdir /app
WORKDIR /app

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

RUN pip install --upgrade pip
RUN python3 -m pip install --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow_cpu-2.2.0-cp37-cp37m-manylinux2010_x86_64.whl
RUN pip install -r requirements.txt

COPY . /app
EXPOSE 5001 

ENTRYPOINT [ "python" ]

CMD [ "api.py" ]