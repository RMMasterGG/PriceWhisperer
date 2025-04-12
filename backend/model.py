from pydantic import BaseModel, EmailStr, constr

class UserRegister(BaseModel):
    name: constr(min_length=3, max_length=50)
    email: EmailStr
    password: constr(min_length=8, max_length=64)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UrlRequest(BaseModel):
    url: str