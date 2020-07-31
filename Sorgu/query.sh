#!/bin/sh
if [ "$#" -ne 3 ]; then
    python3 tweetscraper_bocek.py --query "$1" --fp "$2"
else
    python3 tweetscraper_bocek.py --query "$1" --fp "$2" --limit "$3"
fi

python3 onnx_tahmin.py "$2"