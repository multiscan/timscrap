// Installare node e npm
// Installare dipendenze: npm install
// Eseguire: PASSWORD="..." [SLEEP=2000] [HEADFUL=1] node index.js

const cheerio = require('cheerio')
const puppeteer = require('puppeteer');

const PASSWORD = process.env.PASS
const SSLEEP = process.env.SLEEP || 2000
const LSLEEP = 2 * SSLEEP

async function main() {

  let data = {}

  const browser = await puppeteer.launch({headless: ! process.env.HEADFUL });
  const page = await browser.newPage();
  await page.goto("http://modemtim.homenet.telecomitalia.it:8080/login.lp")
  await page.waitFor(SSLEEP);

  await page.type('#password', PASSWORD)
  await page.click('[name="ok"]')
  await page.waitForNavigation()
  await page.waitFor(SSLEEP);

  await page.goto("http://modemtim.homenet.telecomitalia.it:8080/")
  await page.waitFor(SSLEEP);
  content = await page.content()
  let $ = cheerio.load(content)

  data['etherlist'] = $('#sEthernetList li').toArray().map( (e) => e.attribs ).map( (e) => ({
    'dev': e.name, 
    'ip':  e['data-id'], 
    'mac': e['mac-id']
  }))

  await page.goto("http://modemtim.homenet.telecomitalia.it:8080/network-global.lp")
  await page.waitFor(LSLEEP);
  content = await page.content()
  $ = cheerio.load(content)

  data['dsl_status'] = $('#network-global-broadband').find('dd').eq(0).text().trim()
  data['dsl_uptime'] = await page.evaluate( () => dsl_time )

  data['ppp_status'] = $('#network-global-internet').find('dd').eq(0).text().trim()
  data['ppp_uptime'] = await page.evaluate( () => ppp_time )

  data['ppp_vlan'] = $('#network-global-internet').find('dd.advance').eq(0).text().trim()
  data['ppp_proto'] = $('#network-global-internet').find('dd.advance').eq(1).text().trim()
  data['ppp_ipv4'] = $('#network-global-internet').find('dd.advance').eq(2).text().trim()
  data['ppp_netmask'] = $('#network-global-internet').find('dd.advance').eq(3).text().trim()
  data['ppp_ipv6'] = $('#network-global-internet').find('dd.advance').eq(4).text().trim()
  data['ppp_dns'] = $('#network-global-internet').find('dd.advance').eq(5).text().trim().replace(/[\n\t ]+/g, " ");
  data['ppp_ntp'] = $('#network-global-internet').find('dd.advance').eq(6).text().trim().replace(/[\n\t ]+/g, " ");

  await page.goto("http://modemtim.homenet.telecomitalia.it:8080/network-expert-dsl.lp")
  await page.waitFor(LSLEEP);
  content = await page.content()
  $ = cheerio.load(content)

  data['dsl_mode'] = $('#dslmode').first().text().trim()
  data['dsl_status2'] = $('#dsl_status').first().text().trim()
  data['dsl_cbr'] = $('#cbr').first().text().trim()
  data['dsl_ginp'] = $('#ginp').first().text().trim()
  data['dsl_mabr'] = $('#mabr').first().text().trim()
  data['dsl_noisemargin'] = $('#nm').first().text().trim()
  data['dsl_tpower'] = $('#ptl').first().text().trim()
  data['dsl_delay'] = $('#ad').first().text().trim()
  data['dsl_inp'] = $('#inp').first().text().trim()
  data['dsl_la'] = $('#la').first().text().trim()

  await page.goto("http://modemtim.homenet.telecomitalia.it:8080/network-expert-internet.lp")
  await page.waitFor(LSLEEP);
  content = await page.content()
  $ = cheerio.load(content)

  data['ip_packets_up_total'] = $('span.input-small').eq(0).text().trim()
  data['ip_packets_down_total'] = $('span.input-small').eq(1).text().trim()

  data['ip_bytes_up_total'] = $('span.input-small').eq(2).text().trim()
  data['ip_bytes_down_total'] = $('span.input-small').eq(3).text().trim()


  data['ip_packets_up_multicast'] = $('span.input-small').eq(4).text().trim()
  data['ip_packets_down_multicast'] = $('span.input-small').eq(5).text().trim()

  data['ip_packets_up_broadcast'] = $('span.input-small').eq(6).text().trim()
  data['ip_packets_down_broadcast'] = $('span.input-small').eq(7).text().trim()

  data['ip_packets_discard_total'] = $('span.input-small').eq(8).text().trim()

  browser.close()
  return data
};


main().then( (data) => {console.log(JSON.stringify(data))}).catch(console.error)