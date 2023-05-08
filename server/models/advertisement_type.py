from sqlalchemy import Column, Integer, VARCHAR
from core.db import Base


class AdvertisementType(Base):
    __tablename__ = "advertisement_type"

    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(64), nullable=False)

    def __repr__(self):
        return f"<AdvertisementType id={self.id}, name={self.name}>"