import tweepy
from secrets import CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET
from datetime import datetime
import pandas as pd
import argparse

parser = argparse.ArgumentParser(description='Process tweets.')
parser.add_argument('--query')
parser.add_argument('--fp')
parser.add_argument('--limit', default=1000, type=int)
args = parser.parse_args()

query = args.query
target_fp = args.fp
data_limit = int(args.limit)


auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

api = tweepy.API(auth)

query = query+" -filter:retweets"

max_tweets = data_limit
searched_tweets = [status for status in tweepy.Cursor(api.search, q=query, lang="tr", tweet_mode='extended').items(max_tweets)]

tweets = []
for status in searched_tweets:
    temp = {}
    temp["usernameTweet"] = status.user.screen_name
    temp["ID"] = status.id
    temp["text"] = status.full_text
    temp["url"] = status.user.screen_name+"/status/"+status.id_str
    temp["nbr_retweet"] = status.retweet_count
    temp["nbr_favorite"] = status.favorite_count
    temp["datetime"] = int(datetime.timestamp(status.created_at))
    temp["user_id"] = status.user.id
    tweets.append(temp)

df = pd.DataFrame(tweets)
df.to_json(target_fp, orient="records")

print(f"Data saved to {target_fp}")
