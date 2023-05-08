from sqlalchemy import Column, Integer, VARCHAR
from core.db import Base


class Place(Base):
    __tablename__ = "place"

    id = Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(VARCHAR(64), nullable=False)

    def __repr__(self):
        return f"<Place id={self.id}, name={self.name}>"