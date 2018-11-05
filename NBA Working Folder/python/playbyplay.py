# -*- coding: utf-8 -*-
"""
Created on Thu Nov  1 22:09:41 2018

@author: jtbri
"""

from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from selenium import webdriver
from pandas import *
import pandas
import numpy as np
from urllib.request import Request, urlopen
import json
import time

#def simple_get(url):
#    """
#    Attempts to get the content at `url` by making an HTTP GET request.
#    If the content-type of response is some kind of HTML/XML, return the
#    text content, otherwise return None.
#    """
#    try:
#        with closing(get(url, stream=True)) as resp:
#            if is_good_response(resp):
#                return resp.content
#            else:
#                return None
#
#    except RequestException as e:
#        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
#        return None
#
#
#def is_good_response(resp):
#    """
#    Returns True if the response seems to be HTML, False otherwise.
#    """
#    content_type = resp.headers['Content-Type'].lower()
#    return (resp.status_code == 200 
#            and content_type is not None 
#            and content_type.find('html') > -1)
#
#
#def log_error(e):
#    """
#    It is always a good idea to log errors. 
#    This function just prints them, but you can
#    make it do anything.
#    """
#    print(e)


#gameID = 1
#hdr = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'}
#
#url = 'https://stats.nba.com/stats/playbyplayv2/?gameId=0021500001&startPeriod=0&endPeriod=14'
#req = Request(url,headers={'User-Agent': 'Mozilla/5.0'})
#response = urlopen(req)
#
#data = json.loads(response.read())
#
#with open('PlayByPlayTest.json', 'w') as outfile:
#    json.dump(data, outfile)
    

#td = []
#for e in html.select('td'):
#    if e['class'] == 'status':
#        print(e)
        
    
#==============================================================================
gameData = []
path_to_chromedriver = r'D:\Users\jtbri\Anaconda3\envs\NBAScraper\Library\bin\chromedriver.exe'
browser = webdriver.Chrome(executable_path=path_to_chromedriver)


for gameId in range(515,664):
    print('Beginning extraction of Game ' + str(gameId))
    t1 = time.clock()
    url = 'https://stats.nba.com/game/0021500'+str(gameId).zfill(3)+'/playbyplay/'
    browser.get(url)
    browser.implicitly_wait(5) 
    browser.find_element_by_xpath('/html/body/main/div[2]/div/div/div[4]/div/div[2]/div/div[3]/table')
    
    table = browser.find_element_by_xpath('/html/body/main/div[2]/div/div/div[4]/div/div[2]/div/div[3]/table')
    tr = table.find_elements_by_tag_name('tr')
    
    htm = []
    vtm = []
    status = []
    
    for row in tr:
        if 'scoring' in row.get_attribute('class'):
            for td in row.find_elements_by_tag_name('td'):
                if 'vtm' in td.get_attribute('class'):
                    vtm.append(td.text)
                elif 'htm' in td.get_attribute('class'):
                    htm.append(td.text)
                elif 'status' in td.get_attribute('class'):
                    status.append([td.find_element_by_class_name('time').text,td.find_element_by_class_name('score').text])
    
    gameData.append({'gameID': '0021500'+str(gameId).zfill(3), 'results':{'htm':htm, 'vtm':vtm, 'status':status}})
    t2 = time.clock()
    print('Elapsed time for Game ' + str(gameId) + ': ' + str(t2-t1));

with open('PlayByPlay.json', 'w') as outfile:
    json.dump(gameData, outfile)

#gameId = 434;
#gameData = []
#path_to_chromedriver = r'D:\Users\jtbri\Anaconda3\envs\NBAScraper\Library\bin\chromedriver.exe'
#browser = webdriver.Chrome(executable_path=path_to_chromedriver)
#
#for gameId in range(1,5):
#    url = 'https://stats.nba.com/game/0021500'+str(gameId)+'/playbyplay/'
#    browser.get(url)
#    
#    table = browser.find_element_by_xpath('/html/body/main/div[2]/div/div/div[4]/div/div[2]/div/div[3]/table')
#    tr = table.find_elements_by_tag_name('tr')
#    
#    htm = []
#    vtm = []
#    status = []
#    
#    for row in tr:
#        if 'scoring' in row.get_attribute('class'):
#            for td in row.find_elements_by_tag_name('td'):
#                if 'vtm' in td.get_attribute('class'):
#                    vtm.append(td.text)
#                elif 'htm' in td.get_attribute('class'):
#                    htm.append(td.text)
#                elif 'status' in td.get_attribute('class'):
#                    status.append([td.find_element_by_class_name('time').text,td.find_element_by_class_name('score').text])
#    
#    gameData.append({'htm':htm, 'vtm':vtm, 'status':status})


# https://stats.nba.com/stats/playbyplayv2/?gameId=0021500001&startPeriod=0&endPeriod=14