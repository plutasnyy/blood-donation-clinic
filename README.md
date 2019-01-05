# Blood Donation Clinic
App focused on the database in the Django with DRF + PostgreSQL

## Setup procss

### POSTGRESQL:
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

and add this script to database:
```
CREATE OR REPLACE FUNCTION getAvailableBlood()
  RETURNS TABLE
          (
            size     BIGINT,
            blood_id INTEGER
          )
AS
$$
SELECT sum(size), blood_id
  FROM core_sample
  WHERE core_sample.is_available = TRUE
  GROUP BY core_sample.blood_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION performTransfusion(IN pid varchar(11), IN sid integer, IN wid varchar(11),
                                              IN ts timestamp with time zone default (now() at time zone 'utc'))
  RETURNS void as
$$
  INSERT INTO core_transfusion(id, patient_id, sample_id, worker_id, date)
  VALUES (nextval('core_transfusion_id_seq'), pid, sid, wid, ts);
$$ LANGUAGE sql;

select * from core_transfusion
```

### BACKEND:
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

### FRONTEND
```bash
npm i
npm start
```
