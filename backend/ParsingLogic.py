import asyncio
from seleniumwire import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import aiohttp


class AsyncUniversalMarketParser:
    def __init__(self):
        self.driver = None
        self.session = None

    async def initialize(self):
        """Асинхронная инициализация драйвера и сессии"""
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument(
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--log-level=3")
        options.add_experimental_option("excludeSwitches", ["enable-logging"])

        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )

        # Инициализируем aiohttp сессию
        self.session = aiohttp.ClientSession()

    async def parse_ozon(self, url):
        """Асинхронный парсер Ozon"""
        self.driver.get(url)
        try:
            title_element = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebDriverWait(self.driver, 1).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "h1[class='m8m_28 tsHeadline550Medium']"))
                )
            )
            price_element = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebDriverWait(self.driver, 1).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "span[class='lz8_28 l8z_28 m3m_28']"))
                )
            )
            img_element = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebDriverWait(self.driver, 1).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "img[class='kk_28 kk0_28 b990-a']"))
                )
            )

            title = title_element.text.strip()
            price = price_element.text.strip()
            clean_price = ''.join(c for c in price if c.isdigit())
            img_src = img_element.get_attribute("src")

            return {
                "title": title,
                "price": int(clean_price),
                "image": img_src
            }

        except Exception as e:
            print(f"Ozon error: {e}")
            return None

    async def parse_wildberries(self, url):
        """Асинхронный парсер Wildberries"""
        nm_id = url.split("/")[4]

        async def image_url(nm_id):
            for basket in range(1, 16):
                basket = f"0{basket}" if basket <= 9 else basket
                vol = nm_id[:3] if len(str(nm_id)) == 8 else nm_id[:4]
                part = nm_id[:5] if len(str(nm_id)) == 8 else nm_id[:6]
                url = f"https://basket-{basket}.wbbasket.ru/vol{vol}/part{part}/{nm_id}/images/big/1.webp"
                try:
                    async with self.session.get(url) as response:
                        if response.status == 200:
                            return url
                except:
                    continue
            return None

        api_url = f"https://card.wb.ru/cards/v2/detail?appType=1&curr=rub&dest=-1255987&spp=30&nm={nm_id}"
        async with self.session.get(api_url) as response:
            data = await response.json()
            product = data["data"]["products"][0]
            image_url = await image_url(nm_id)

            return {
                "title": product["name"],
                "price": int(product["sizes"][0]["price"]["total"] / 100),
                "image": image_url
            }

    async def parse_yandex(self, url):
        """Асинхронный парсер Яндекс.Маркета"""
        self.driver.get(url)
        try:
            title_element = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebDriverWait(self.driver, 1).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR,
                                                    "h1[class='ds-text ds-text_weight_med ds-text_withHyphens ds-text_typography_lead-text _3liU0 ds-text_lead-text_normal ds-text_lead-text_med']"))
                )
            )
            title = title_element.text.strip()

            price_element = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebDriverWait(self.driver, 1).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "span[class='ds-valueLine']"))
                )
            )
            price_element = price_element.find_element(By.CSS_SELECTOR, "span")
            price = price_element.text.strip()
            clean_price = ''.join(c for c in price if c.isdigit())

            img_element = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: WebDriverWait(self.driver, 1).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div[class='ecYgD _1MOwX _1bCJz']"))
                )
            )
            img_element = img_element.find_element(By.CSS_SELECTOR, "div")
            img_element = img_element.find_element(By.CSS_SELECTOR, "article")
            img_element = img_element.find_element(By.CSS_SELECTOR, "img")

            return {
                "title": title,
                "price": int(clean_price),
                "image": img_element.get_attribute("src")
            }

        except Exception as e:
            print(f"Yandex error: {e}")
            return None

    async def close(self):
        """Асинхронное закрытие драйвера и сессии"""
        if self.driver:
            self.driver.quit()
        if self.session:
            await self.session.close()