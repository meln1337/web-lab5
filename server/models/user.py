from sqlalchemy import ForeignKey
from sqlalchemy import Column, Integer, VARCHAR, Boolean
from core.db import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(VARCHAR(64), nullable=False)
    email = Column(VARCHAR(64), nullable=False)
    password = Column(VARCHAR(64), nullable=False)
    place_id = Column(Integer, ForeignKey("place.id"), nullable=False)
    is_superuser = Column(Boolean, nullable=False)

    def __repr__(self):
        return f"<User id={self.id}, username={self.username}, email={self.email}, place_id={self.place_id}, is_superuser={self.is_superuser}>"