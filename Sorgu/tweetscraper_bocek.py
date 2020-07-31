import shutil
import os
from subprocess import Popen, PIPE, STDOUT
import time
import json
import sys
import pandas as pd
import argparse
import datetime
import random

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--query')
parser.add_argument('--fp')
parser.add_argument('--limit', default=1250, type=int)
args = parser.parse_args()

query = args.query
target_fp = args.fp
data_limit = int(args.limit)

print("Query", query)
print("Filepath", target_fp)
print("Limit", data_limit)

#Remove if data folder exists
if os.path.exists("TweetScraper/Data/"):
    shutil.rmtree("TweetScraper/Data/")
    print("Removed previous data")

today = datetime.date.today()
since = (today-datetime.timedelta(30)).strftime("%Y-%m-%d")
print(f"{query}, {target_fp} klasörüne top twitler çekiliyor.")
commands = ["scrapy", "crawl", "TweetScraper", "-a", "top_tweet=True", "-a", f"query=\"{query}\" since:{since}", "-s", f"CLOSESPIDER_ITEMCOUNT={2*data_limit//5}"]
process = Popen(commands, stdout=PIPE, stderr=STDOUT, universal_newlines=True, cwd="TweetScraper/")
for line in iter(process.stdout.readline, ''):
    print(line)
process.kill()

total_day = 30
total_data = 3*data_limit//5
for i in range(total_day):
    day = (today-datetime.timedelta(i)).strftime("%Y-%m-%d")
    next_day = (today-datetime.timedelta(i-1)).strftime("%Y-%m-%d")
    x = random.randrange(total_data//total_day-5, total_data//total_day+5)
    print(f"{query}, {target_fp} klasörüne en yakın twitler {day}-{next_day} günler arasında olacak şekilde toplam {x} twit çekilecek.")

    commands = ["scrapy", "crawl", "TweetScraper", "-a", f"query=\"{query} since:{day} until:{next_day} \"", "-s", f"CLOSESPIDER_ITEMCOUNT={x}"]
    process = Popen(commands, stdout=PIPE, stderr=STDOUT, universal_newlines=True, cwd="TweetScraper/")
    for line in iter(process.stdout.readline, ''):
        print(line)

    process.kill()


dataset = []
for el in os.listdir("TweetScraper/Data/tweet"):
    fp = os.path.join("TweetScraper/Data/tweet", el)
    with open(fp) as f:
        d = json.load(f)
    dataset.append(d)

pd.DataFrame(dataset).to_json(target_fp)

if os.path.exists("TweetScraper/Data/"):
    shutil.rmtree("TweetScraper/Data/")
