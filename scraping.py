import re
import time
import sqlite3
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scraping_data_population():
    url = 'https://subway.com.my/find-a-subway'
    driver = webdriver.Chrome()
    driver.get(url)

    # wait for the search field to be visible and enter the search query
    search_field = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "fp_searchAddress")))
    search_field.send_keys('kuala lumpur')

    # click the search button
    search_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "fp_searchAddressBtn")))
    search_button.click()

    # wait for 10 seconds after clicking the button
    time.sleep(10)

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    pattern = re.compile(r'fp_listitem fp_list_marker\d+')
    items = soup.find_all('div', class_ = pattern, style = lambda value: value is None or 'display: none' not in value)
    sorted_items = sorted(items, key = lambda x: int(x['style'].split(':')[1].replace(';', '').strip()))

    # connect to SQLite database
    conn = sqlite3.connect('database.db')

    # create a cursor object
    c = conn.cursor()

    for item in sorted_items:
        insert_location_name, insert_address, insert_operating_hour, \
            insert_waze_link, insert_latitude, insert_longitude = '', '', '', '', '', ''

        # check if the item is hidden just to be safe
        if 'style' in item.attrs and 'display: none' in item['style']:
            continue  # skip this item if it's hidden

        location_left_div = item.find('div', class_ = 'location_left')
        location_right_div = item.find('div', class_ = 'location_right')

        if location_left_div:
            h4_tag = location_left_div.find('h4')

            if h4_tag:
                insert_location_name = h4_tag.text.strip()

            infoboxcontent_div = location_left_div.find('div', class_ = 'infoboxcontent')

            if infoboxcontent_div:
                paragraphs = infoboxcontent_div.find_all('p', class_ = lambda x: x != 'infoboxlink')

                if len(paragraphs) >= 4:
                    address = paragraphs[0].text.strip()
                    operating_hour = paragraphs[2].text.strip()
                    insert_address = address
                    insert_operating_hour = operating_hour
                elif len(paragraphs) == 1:
                    address = paragraphs[0].text.strip()
                    operating_hour = None
                    insert_address = address
                    insert_operating_hour = operating_hour
                elif len(paragraphs) == 3:
                    address = None
                    operating_hour = paragraphs[1].text.strip()
                    insert_address = address
                    insert_operating_hour = operating_hour

        if location_right_div:
            direction_button = location_right_div.find('div', class_ = 'directionButton')
            a_links = location_right_div.find_all('a')

            if len(a_links) >= 2:
                waze_link = a_links[1]['href'] if a_links[1]['href'] else None
                insert_waze_link = waze_link

        # retrieve geocoding data
        if 'data-latitude' and 'data-longitude' in item.attrs:
            insert_latitude = item['data-latitude']
            insert_longitude = item['data-longitude']

        # insert data into database
        c.execute('''
            INSERT INTO subway (location_name, address, operating_hour, waze_link, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (insert_location_name, insert_address, insert_operating_hour, insert_waze_link, insert_latitude, insert_longitude))

    driver.quit()

    # commit the transaction
    conn.commit()

    # close the connection
    conn.close()

if __name__ == "__main__":
    scraping_data_population()