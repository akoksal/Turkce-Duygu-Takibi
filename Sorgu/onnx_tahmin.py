import onnxruntime as ort
from transformers import BertTokenizerFast
import pandas as pd
import re
import math
import sys
import os
import time
import numpy as np
import torch

st = time.time()
ort_session = ort.InferenceSession("distilbert.onnx")

target_fp = sys.argv[1]

url_pattern_str = r"""(?i)((?:https?:(?:/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info
                      |int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|
                      bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|
                      cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|
                      gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|
                      la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|
                      nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|
                      sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|
                      uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]
                      *?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’])|(?:(?<!@)
                      [a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name
                      |post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn
                      |bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg
                      |eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id
                      |ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|
                      md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|
                      ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|
                      sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|
                      za|zm|zw)\b/?(?!@)))"""
url_pattern = re.compile(url_pattern_str, re.IGNORECASE)
def url_removal(text):
    return re.sub(url_pattern, '', text)

tokenizer = BertTokenizerFast.from_pretrained('dbmdz/distilbert-base-turkish-cased')

df = pd.read_json(target_fp)
sentences = [url_removal(x) for x in list(df["text"])]

tokenized_sentences = tokenizer.batch_encode_plus(sentences, padding="max_length", truncation=True, max_length=128)

batch_size = 40
N = len(sentences)
final_results = []
for idx in range(math.ceil(N/batch_size)):
    print("Inference:",len(final_results),"/",N)
    inp_ids = tokenized_sentences["input_ids"][idx*batch_size:min((idx+1)*batch_size, N)]
    att_mask = tokenized_sentences["attention_mask"][idx*batch_size:min((idx+1)*batch_size, N)]
    real_size = len(inp_ids)
    if len(inp_ids)<batch_size:
        inp_ids.extend([inp_ids[0]]*(batch_size-real_size))
        att_mask.extend([att_mask[0]]*(batch_size-real_size))
    x = {'input_ids': np.array(inp_ids), 'input_atns':np.array(att_mask)}
    outputs = ort_session.run(None, x)
    values = np.argmax((outputs[0]), 1)[:real_size]
    final_results.extend([x-1 for x in values.tolist()])

df["sentiment"] = final_results
df.to_json(target_fp, orient="records", force_ascii=False)

df["date"] = [x.date() for x in df["datetime"]]
df["volume"] = 1

df_volume = df.groupby(df.date).sum().reset_index()[['date', "sentiment", "volume"]]
df_volume["sentiment"] /= df_volume["volume"]

target_fp_volume = os.path.splitext(target_fp)[0]+"_volume"+os.path.splitext(target_fp)[1]
df_volume.to_json(target_fp_volume, orient="records", force_ascii=False)

en = time.time()

print("Inference:",en-st)