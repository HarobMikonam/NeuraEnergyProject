## Quick start

```bash
# 1) Backend
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # or create .env using the template below
python manage.py migrate

# run API
python manage.py runserver

# 2) Frontend
cd frontend
npm i
npm run dev
```

---

## 1) Backend setup

### 1.1 Create a Postgres database

```sql
CREATE USER energy_user WITH PASSWORD 'energy_pass';
CREATE DATABASE energy_db OWNER energy_user;
GRANT ALL PRIVILEGES ON DATABASE energy_db TO energy_user;
```

### 1.2 Configure environment

You can define your environment variables directly inside `settings.py`, but recommended to place them in a separate `.env` file and load them using `python-dotenv` or `django-environ`.
This keeps sensitive information secure and avoids hardcoding credentials in the repository.

**Example placement:**

```
backend/
├── manage.py
├── settings.py
├── .env   ← create this file
```

Create `backend/.env` with the following content (adjust values):

```ini
SECRET_KEY=dev-secret-change-me
DEBUG=True
ALLOWED_HOSTS=*

DB_NAME=energy_db
DB_USER=energy_user
DB_PASSWORD=energy_pass
DB_HOST=127.0.0.1
DB_PORT=5432
```

In your `settings.py`, load it like this:

```python
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

Run migrations:

```bash
cd backend
python manage.py migrate
```

### 1.3 Create a test user

If Django migrations already created the `auth_user` table, simply add a test user:

```bash
python manage.py shell -c "from django.contrib.auth import get_user_model;U=get_user_model();u,_=U.objects.update_or_create(username='test@test.com',defaults={'email':'test@test.com'});u.set_password('1234');u.is_staff=True;u.is_superuser=True;u.save()"
```

Now you can log in with:

- **Email:** `test@test.com`
- **Password:** `1234`

---

## 2) Load & clean dataset

Download from Kaggle:
[House-hold Energy Data](https://www.kaggle.com/datasets/jaganadhg/house-hold-energy-data/data)

Load or import the CSV into the database.

### SQL setup & cleaning

This SQL script performs a complete data import and changes for the energy dataset:

1. Creates a staging table (`energy_staging`) = imports raw CSV text data where all fields are strings.
2. Cleans malformed or string-based values = converts text to proper `date`, `time`, `float`, and `numeric` formats.
3. Normalizes units = ensures consistent units like `kWh`.
4. Cleans invalid numeric values = strips symbols and non-numeric characters.

```sql
CREATE SCHEMA IF NOT EXISTS energy;

DROP TABLE IF EXISTS energy.energy_staging;
CREATE TABLE energy.energy_staging (
  date_text text,
  start_time_text text,
  end_time_text text,
  usage_text text,
  units_text text,
  cost_text text
);

-- Load CSV manually
-- \copy energy.energy_staging FROM '/path/household_energy.csv' WITH (FORMAT csv, HEADER true);

DROP TABLE IF EXISTS energy.energy_readings;
CREATE TABLE energy.energy_readings (
  id serial PRIMARY KEY,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  usage double precision NOT NULL,
  units text NOT NULL,
  cost numeric(10,2) NOT NULL DEFAULT 0.00
);

WITH cleaned AS (
  SELECT
    to_date(trim(date_text), 'YYYY-MM-DD') AS date_val,
    (make_time(
       NULLIF(lpad(split_part(trim(start_time_text), ':', 1), 2, '0'),'')::int,
       NULLIF(lpad(split_part(trim(start_time_text), ':', 2), 2, '0'),'')::int,
       COALESCE(NULLIF(lpad(split_part(trim(start_time_text), ':', 3), 2, '0'),''),'00')::int
     )) AS start_time_val,
    (make_time(
       NULLIF(lpad(split_part(trim(end_time_text), ':', 1), 2, '0'),'')::int,
       NULLIF(lpad(split_part(trim(end_time_text), ':', 2), 2, '0'),'')::int,
       COALESCE(NULLIF(lpad(split_part(trim(end_time_text), ':', 3), 2, '0'),''),'00')::int
     )) AS end_time_val,
    NULLIF(regexp_replace(trim(usage_text), '[^0-9\.-]', '', 'g'), '')::double precision AS usage_val,
    CASE WHEN trim(units_text) ~* 'kwh' THEN 'kWh' ELSE trim(units_text) END AS units_val,
    COALESCE(NULLIF(regexp_replace(trim(cost_text), '[^0-9\.-]', '', 'g'), ''), '0')::numeric(10,2) AS cost_val
  FROM energy.energy_staging
)
INSERT INTO energy.energy_readings (date, start_time, end_time, usage, units, cost)
SELECT date_val, COALESCE(start_time_val, time '00:00:00'), COALESCE(end_time_val, time '00:00:00'),
       COALESCE(usage_val, 0.0), COALESCE(units_val, 'kWh'), COALESCE(cost_val, 0.00)
FROM cleaned
WHERE date_val IS NOT NULL;

CREATE INDEX IF NOT EXISTS energy_readings_date_idx ON energy.energy_readings(date);
CREATE INDEX IF NOT EXISTS energy_readings_date_time_idx ON energy.energy_readings(date, start_time);
```

---

## 3) Run backend API

```bash
cd backend
python manage.py runserver
```

API available at `http://127.0.0.1:8000/`

---

## 4) Frontend setup

```bash
cd frontend
npm i
npm run dev
```
