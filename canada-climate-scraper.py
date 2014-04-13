from bs4 import BeautifulSoup
import urllib2
import json

from pymongo import MongoClient


url = 'http://climate.weather.gc.ca/climateData/hourlydata_e.html?timeframe=1&Prov=ONT&StationID=48549&hlyRange=2009-12-10|2014-04-11&Year=2014&Month=4&Day=11'

page = urllib2.urlopen(url).read()

soup = BeautifulSoup(page)

table = soup.find(id='dynamicDataTable')

tbody = table.find('tbody')
rows = tbody.find_all('tr')

cols = tbody.find_all('td')

for row_index,row in enumerate(tbody.find_all('tr')):
  cells = [c.string for c in row.find_all('td')]
  if cells and row_index != 0:
    time = row_index - 1
    temp = cells[1]
    humdity = cells[4]
    pressure = cells[7]

    measurementEntry = (time, temp, humdity, pressure)
    print json.dumps(measurementEntry)