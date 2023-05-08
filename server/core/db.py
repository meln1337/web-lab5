from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DB_URL = "mysql://root:password@localhost:3306/lab9_ap"

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

engine = create_engine(DB_URL)
session = sessionmaker(bind=engine)
s = session()

# alembic revision --autogenerate -m "Name of migration" (Create migration)
# alembic upgade head (Apply last migration)