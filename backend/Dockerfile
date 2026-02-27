FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

ENV PORT=10000
EXPOSE 10000

CMD python -m uvicorn main:app --host 0.0.0.0 --port $PORT
