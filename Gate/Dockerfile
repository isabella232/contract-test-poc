FROM python:3

WORKDIR /usr/src/app

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD ["gate.py"]

ENTRYPOINT ["python3"]