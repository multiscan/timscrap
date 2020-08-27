# TIM modem data fetcher

This simple script can automaticaly download usefull informations from DSL
modems installed in italian households by Telecom Italia. It uses [pupeteer][pupeteer] and [cheerio][cheerio]

## Install

### System Requirements
Install the following packages in your system
 - node
 - npm
 - jq (optional)

### Node Packages
Install the required node packages with the following command. Note that it 
might take a while.

```
npm install
```

## Run
```
PASSWORD="your administrator password" [SLEEP=2000] [HEADFUL=1] node index.js
```

The script output a json formatted object. In order to make it more readable,
I suggest to pipe it to [jq json parser][jq]. Example:

```
node index.js | tee /tmp/aaa.json | jq -r .ip_packets_up_total
cat /tmp/aaa.json | jq -r .etherlist[0].mac
```

[pupeteer]: https://github.com/puppeteer/puppeteer
[cheerio]: https://github.com/cheeriojs/cheerio
[jq]: https://stedolan.github.io/jq/