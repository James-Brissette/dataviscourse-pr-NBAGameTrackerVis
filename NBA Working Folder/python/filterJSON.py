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
#from urllib.request import Request, urlopen
import json
import time



import urllib.request

with open('players_p.json') as f:
    data = json.load(f)
    
errors = [];
for i in range(51, len(data)):
    print('Fetching ' + str(data[i][0]) + ' ' + str(data[i][1]) + ' at i=' + str(i) + ':  ' + str(data[i][2]))
    try:
        urllib.request.urlretrieve("https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/" + str(data[i][3]) + "/2016/260x190/" + str(data[i][2]) +".png", str(data[i][2])+".png")
    except:
        print('Error at i=' +str(i))
        errors.append(i)
    
#let events = gameData.events.map(a => a.moments.map(b => b[5]));
#    //console.log('Total number of events: ' + events.length);
#
#    uniqueEvents = [];
#    let uniqueID = [];
#    uniqueID.push(1)
#
#    let unique = true;
#    for (i=1; i<events.length-1;i++) {
#        unique = false;
#        for (j = 0; j < Math.min(events[i].length,events[i+1].length); j++) {
#            /* Here i is the event index and j is the moment we're comparing. [0] is the index of the ball and [2],[3] correspond the X,Y values */
#            if (events[i][j][0][2] != events[i+1][j][0][2] && events[i][j][0][3] != events[i+1][j][0][3]) {
#                /* If there is ANY x or y value that is different, we'll call it unique. Surprising how many aren't */
#                unique = true;
#            }
#        }
#        //console.log('Comparing events ' + (i+1) + ' & ' + (i+2) + ': ' + unique);
#        if (unique == true) {
#            uniqueID.push(i+1);
#        }
#    }
#
#    uniqueID.forEach(eventID => {
#        uniqueEvents.push(gameData.events[eventID]);
#    });
#    //console.log(uniqueEvents);
#    uniqueEvents = {'gameid': gameData.gameid, 'gamedate': gameData.gamedate, 'events': uniqueEvents};
#
#    i = 0;
#    flat = uniqueEvents.events.map(a => a.moments.map(b => b[5])).flat();
#    testList = [];
#    while(i < flat.length) {
#        console.log('i: ' + i + '; flat.length = ' + flat.length);
#        t = ''+flat[i][0][0] + ''+flat[i][0][1] + ''+flat[i][0][2] + ''+flat[i][0][3] + ''+flat[i][0][4]
#        if (testList.indexOf(t) == -1) {
#            testList.push(t)
#            i++;
#        } else {
#            console.log('duplicate found at i: ' + i)
#            flat.splice(i,1);
#        }
#    }
#    return flat;


#with open('filtered.json', 'w') as outfile:
#    json.dump(gameData, outfile)