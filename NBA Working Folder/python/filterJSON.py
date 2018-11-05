# -*- coding: utf-8 -*-
"""
Created on Sun Nov  4 15:22:55 2018

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



with open('0021500434.json', 'r') as file:
    gameData = json.load(file);
    


#with open('filtered.json', 'w') as outfile:
#    json.dump(gameData, outfile)