import shutil
import os
from subprocess import Popen, PIPE, STDOUT
import time
import json
import sys
import pandas as pd
import argparse
from datetime import datetime

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--query')
parser.add_argument('--fp')
parser.add_argument('--limit', default=1000, type=int)
args = parser.parse_args()

query = args.query
target_fp = args.fp
data_limit = args.limit

print("Query", query)
print("Filepath", target_fp)
print("Limit", data_limit)

#Remove if data folder exists
if os.path.exists("TweetScraper/Data/"):
    shutil.rmtree("TweetScraper/Data/")
    print("Removed previous data")


print(f"{query}, {target_fp} klasörüne çekiliyor.")
commands = ["scrapy", "crawl", "TweetScraper", "-a", "top_tweet=True", "-a", f"query=\"{query}\"", "-s", f"CLOSESPIDER_ITEMCOUNT={data_limit}"]
process = Popen(commands, stdout=PIPE, stderr=STDOUT, universal_newlines=True, cwd="TweetScraper/")
for line in iter(process.stdout.readline, ''):
    print(line)

dataset = []
for el in os.listdir("TweetScraper/Data/tweet"):
    fp = os.path.join("TweetScraper/Data/tweet", el)
    with open(fp) as f:
        d = json.load(f)
    dataset.append(d)

pd.DataFrame(dataset).to_json(target_fp)

if os.path.exists("TweetScraper/Data/"):
    shutil.rmtree("TweetScraper/Data/")