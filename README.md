# Blood Donation Clinic
App focused on the database in the Django with DRF + PostgreSQL

## Setup procss

### How to install and configure PostgreSQL:
```bash
sudo apt-get install python-pip python-dev libpq-dev postgresql postgresql-contrib
sudo su - postgres
psql
CREATE DATABASE blooddonationclinic;
CREATE USER admin WITH PASSWORD 'admin';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE blooddonationclinic TO admin;
\q
exit
```

### How to run backend:
```bash
python3 -m venv env
source env/bin/activate
pip install ./backend/BloodDonationClinic/requirements.txt
cd backend/BloodDonationClinic/
python3 manage.py runserver 0.0.0.0:8000
```

#### Remember after install packages:
```bash
pip freeze > requirements.txt
```