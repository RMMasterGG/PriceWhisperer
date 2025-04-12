from fastapi import FastAPI, Request, Response, HTTPException, status, Cookie
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from model import UserRegister, UserLogin
from DataBaseLogic import database, Shop, Product, User
from token_service import create_token, verify_token
from ParsingLogic import AsyncUniversalMarketParser
from model import UrlRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/register")
async def register(user: UserRegister, access_token: str = Cookie(None)):
    existing_users = await database.get_users()
    user_id = None
    for existing_user in existing_users:
        if existing_user.user_token == access_token:
            user_id = existing_user.user_id
            break

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not authenticated"
        )

    token = await create_token(user.email)
    user_id = await database.add_user(
        name=user.name,
        email=user.email,
        password=user.password,
        token=token,
        product_id=None
    )

    return {
        "user_id": user_id,
        "token": token,
        "message": "Пользователь успешно зарегистрирован"
    }

@app.post("/api/login")
async def login(user: UserLogin, response: Response):
    existing_users = await database.get_users()
    user_found = None

    for existing_user in existing_users:
        if existing_user.user_email == user.email:
            user_found = existing_user
            break

    if not user_found:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
        )

    if user_found.user_password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
            )

    access_token = await create_token(user.email)
    await database.update_user(user_found.user_id, user_token=access_token)

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=365 * 24 * 3600,
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {
        "message": "Вход выполнен успешно",
        "user_id": user_found.user_id,
        "email": user_found.user_email
    }


@app.post("/api/logout")
async def logout(response: Response, access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not authenticated"
        )
    existing_users = await database.get_users()

    for existing_user in existing_users:
        if existing_user.user_token == access_token:
            user_id = existing_user.user_id
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not authenticated"
            )
    await database.update_user(user_id, user_token=None)

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return {
        "message": "Success logout"
    }


@app.post("/api/parsing")
async def parsing(data: UrlRequest, access_token: str = Cookie(None)):
    print(access_token)
    url = data.url
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not authenticated"
        )

    existing_users = await database.get_users()

    for existing_user in existing_users:
        if existing_user.user_token == access_token:
            user_id = existing_user.user_id
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not authenticated"
            )



    shop_name_url = url.split("/")[2]
    shop_name = shop_name_url.split(".")[1]

    parser = AsyncUniversalMarketParser()
    await parser.initialize()
    if shop_name == "wildberries":
        data = await parser.parse_wildberries(url)
        print("Wildberries:", data)
        await parser.close()
        shop_id = 1
    elif shop_name == "ozon":
        data = await parser.parse_ozon(url)
        print("Ozon:", data)
        await parser.close()
        shop_id = 2
    elif shop_name == "yandex":
        data = await parser.parse_yandex(url)
        print("Yandex:", data)
        await parser.close()
        shop_id = 3
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный URL"
        )



    name = data["title"]
    price = data["price"]
    image = data["image"]

    product_id = await database.add_product(
        product_name=name,
        price=price,
        img=image,
        product_src=url,
        user_id=user_id,
        shop_id=shop_id
    )


    return {
        "product_id": product_id,
        "product_name": name,
        "product_price": price,
        "product_img": image,
        "product_url": url,
        "shop_name": shop_name,
    }