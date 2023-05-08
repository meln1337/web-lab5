from sqlalchemy import ForeignKey
from sqlalchemy import Column, Integer, VARCHAR
from core.db import Base


class Advertisement(Base):
    __tablename__ = "advertisement"

    id = Column(Integer, primary_key=True)
    text = Column(VARCHAR(255), nullable=False)
    type_id = Column(Integer, ForeignKey("advertisement_type.id"), nullable=False)
    place_id = Column(Integer, ForeignKey("place.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    def __repr__(self):
        return f"<Advertisement id={self.id}, text={self.text}, type_id={self.type_id}, place_id={self.place_id}, author_id={self.author_id}>"