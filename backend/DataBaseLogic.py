import sqlalchemy as db
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import select, update, delete
import asyncio

# Асинхронный движок (для SQLite)
engine = create_async_engine("sqlite+aiosqlite:///.dbPriceWhisperer")

# Базовый класс для моделей
Base = declarative_base()

# Сессия для работы с БД
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


# Модели (таблицы)
class Shop(Base):
    __tablename__ = "shops"
    shop_id = db.Column(db.Integer, primary_key=True)
    shop_name = db.Column(db.Text)


class Product(Base):
    __tablename__ = "products"
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.Text)
    product_price = db.Column(db.Integer)
    product_img = db.Column(db.Text)
    product_src = db.Column(db.Text)
    user_id= db.Column(db.Integer, db.ForeignKey("users.user_id"))
    shop_id = db.Column(db.Integer, db.ForeignKey("shops.shop_id"))


class User(Base):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.Text)
    user_email = db.Column(db.Text)
    user_password = db.Column(db.Text)
    user_token = db.Column(db.Text)


# Класс для работы с БД
class Database:
    def __init__(self):
        self.engine = engine
        self.async_session = async_session

    async def clear_database(self):
        """Очищает все данные из всех таблиц, сохраняя структуру"""
        async with self.async_session() as session:
            # Важно соблюдать порядок удаления из-за foreign key constraints
            await session.execute(delete(User))
            await session.execute(delete(Product))
            await session.execute(delete(Shop))
            await session.commit()

    async def create_tables(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    # CRUD для магазинов (Shop)
    async def add_shop(self, shop_name: str):
        async with self.async_session() as session:
            new_shop = Shop(shop_name=shop_name)
            session.add(new_shop)
            await session.commit()
            return new_shop.shop_id

    async def get_shops(self):
        async with self.async_session() as session:
            result = await session.execute(select(Shop))
            return result.scalars().all()

    async def update_shop(self, shop_id: int, new_name: str):
        async with self.async_session() as session:
            stmt = update(Shop).where(Shop.shop_id == shop_id).values(shop_name=new_name)
            await session.execute(stmt)
            await session.commit()

    async def delete_shop(self, shop_id: int):
        async with self.async_session() as session:
            stmt = delete(Shop).where(Shop.shop_id == shop_id)
            await session.execute(stmt)
            await session.commit()

    # CRUD для продуктов (Product)
    async def add_product(self, product_name: str, price: int, img: str, product_src: str, user_id: int, shop_id: int):
        async with self.async_session() as session:
            new_product = Product(
                product_name=product_name,
                product_price=price,
                product_img=img,
                product_src=product_src,
                user_id=user_id,
                shop_id=shop_id
            )
            session.add(new_product)
            await session.commit()
            return new_product.product_id

    async def get_products(self):
        async with self.async_session() as session:
            result = await session.execute(select(Product))
            return result.scalars().all()

    async def update_product(self, product_id: int, **kwargs):
        async with self.async_session() as session:
            stmt = update(Product).where(Product.product_id == product_id).values(**kwargs)
            await session.execute(stmt)
            await session.commit()

    async def delete_product(self, product_id: int):
        async with self.async_session() as session:
            stmt = delete(Product).where(Product.product_id == product_id)
            await session.execute(stmt)
            await session.commit()

    # CRUD для пользователей (User)
    async def add_user(self, name: str, email: str, password: str, token: str, product_id: int = None):
        async with self.async_session() as session:
            new_user = User(
                user_name=name,
                user_email=email,
                user_password=password,
                user_token=token
            )
            session.add(new_user)
            await session.commit()
            return new_user.user_id

    async def get_users(self):
        async with self.async_session() as session:
            result = await session.execute(select(User))
            return result.scalars().all()

    async def update_user(self, user_id: int, **kwargs):
        async with self.async_session() as session:
            stmt = update(User).where(User.user_id == user_id).values(**kwargs)
            await session.execute(stmt)
            await session.commit()

    async def delete_user(self, user_id: int):
        async with self.async_session() as session:
            stmt = delete(User).where(User.user_id == user_id)
            await session.execute(stmt)
            await session.commit()


database = Database()