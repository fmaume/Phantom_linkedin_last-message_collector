// Phantombuster configuration {
"phantombuster command: nodejs"
"phantombuster package: 5"
"phantombuster dependencies: lib-StoreUtilities.js, lib-LinkedIn.js, lib-LinkedInScraper.js"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick({
	loadImages: true,
	printPageErrors: false,
	printResourceErrors: false,
	printNavigation: false,
	printAborts: false,
	debug: false,
	timeout: 30000,
	heigth: 800
})

const StoreUtilities = require("./lib-StoreUtilities")
const { promisify } = require("util")
const jsonexport = promisify(require("jsonexport"))
const utils = new StoreUtilities(nick, buster)
const LinkedIn = require("./lib-LinkedIn")
const linkedIn = new LinkedIn(nick, buster, utils)
const LinkedInScraper = require("./lib-LinkedInScraper")
const { URL } = require("url")

const MAX_SKILLS = 6
const MAX_PROFILES = 100

// }

//get list of message thread available
const get_thread_list = (arg, done) => {



  try {
        stemp = document.querySelectorAll('[data-control-name="view_message"]')
        result = []
        var i;
        for (i = 0; i < stemp.length; i++) {
            stemp2 = stemp[i].href
            result.addObject(stemp2)
        }


  } catch(err) {
    result = []
  }  
  done(null, result)
  
  
}
//get list of number of message within a thread
const count_messages = (arg, done) => {



    try {
      stemp = document.querySelectorAll('.msg-s-message-group__meta')
      stemp = document.querySelectorAll('.msg-s-message-group__meta')
      result = stemp.length




  } catch(err) {
    result = 0
  }  
  done(null, result)
  
  
}
//get list name of seder from first message
const get_sender_name = (arg, done) => {



  try {
        stemp = document.querySelector('.msg-s-message-group__meta')
        stemp = stemp.querySelector('[data-control-name="view_profile"]')
        stemp = stemp.innerText


  } catch(err) {
    stemp = 0
  }  
  done(null, stemp)
  
  
}
//get user profile from message panet
const get_user_profile = (arg, done) => {



  try {
    stemp = document.querySelector('[data-control-name="topcard"]')
    link = stemp.href

  } catch(err) {
    link = "unknow"
  }  
  done(null, link)
  
  
}

// get time header
const get_time_stemps = (arg, done) => {
try {
stemp = document.querySelectorAll('.msg-s-message-list__time-heading')
result = []
var i;
for (i = 0; i < stemp.length ; i++) {
    console.log(i)
    result.push(stemp[i].innerText)
}
} catch (err) {
    result = err
}  
    done(null, result)


}

// get senders name
const get_counterparts = (arg, done) => {
    try {
        stemp = document.querySelectorAll('[data-control-name="view_profile"]')
        result = []
        var i;
        for (i = 1; i < stemp.length; i = i + 2) {
            console.log(i)
            result.push(stemp[i].innerText)
        }
    } catch (err) {
        result = err
    }
    done(null, result)


}

//function to transform a list of array into a csv file
const create_csv = (array_list, header) => {
    //init csv
    csvContent = ""

    // add heard
    var i;
    for (i = 0; i < header.length; i++) {
        csvContent = csvContent + header[i] + ","
    }
    csvContent = csvContent + "\r\n"

    // get number of expected csv line
    array_lenght = array_list[0].length

    var i;
    for (i = 0; i < array_lenght; i++) {
        var y
        for (y = 0; y < array_list.length; y++) {
            stemp = array_list[y][i]
            try {
                stemp = String(stemp)
                stemp = stemp.split(",").join("<comma>")
            } catch (error) {
                stemp = stemp
            }
            csvContent = csvContent + stemp + ","



        }
        csvContent = csvContent + "\r\n"
    }

    return csvContent
}


async function main(){
    const arg = buster.argument
    const linkedInScraper = new LinkedInScraper(utils)
    const tab = await nick.newTab()
    //loging
    await linkedIn.login(tab, arg.sessionCookie)

    //open messaging tab
    await tab.open("https://www.linkedin.com/messaging/")

    //scrool to revel more message
    const pageTimeout = 5000
    selectors = '[data-control-name="view_message"]'
    await tab.waitUntilVisible(selectors, pageTimeout)
    console.log("redirected to messages")

    //swolly scroll to reaveal more threads
    await tab.scrollToBottom()
    console.log("scrolled down")
    await tab.wait(10000)
    console.log("waited")
    await tab.scrollToBottom()
    console.log("scrolled down")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    await tab.wait(10000)
    console.log("waited")
    const thread_list = await tab.evaluate(get_thread_list, arg)
    console.log(thread_list)

    // init the different list to save our results

    interlocutor = []
    time_seprator_list = []
    conterpart_list = []
    message_count_list = []

    // loop to check all message thread and extract the info we are interested in
    var i;
    for (i = 0; i < arg.AccountNumber; i++) {

        console.log(i)
        try {
            //load the tread
            await tab.open(thread_list[i])
            await tab.wait(10000)

            // get message count or return "unknown" in case of error
            try {
                stemp = await tab.evaluate(count_messages, arg)
                console.log(stemp)
                
            } catch (error) {
                console.log("There is an issue with scraping " + thread_list[i]);
                stemp = 'unknown'
                
            }
            message_count_list.push(stemp)


            try {
                stemp = await tab.evaluate(get_time_stemps , arg)
                console.log(stemp)
                
            } catch (error) {
                console.log("There is an issue with scraping " + thread_list[i]);
                stemp = 'unknown'
                
            }
            time_seprator_list.push(stemp)

            try {
                stemp = await tab.evaluate(get_counterparts, arg)
                console.log(stemp)
                
            } catch (error) {
                console.log("There is an issue with scraping " + thread_list[i]);
                stemp = 'unknown'
                
            }
            conterpart_list.push(stemp)

            try {
                stemp = await tab.evaluate(get_user_profile, arg)
                console.log(stemp)
                
            } catch (error) {
                console.log("There is an issue with scraping " + thread_list[i]);
                stemp = 'unknown'
                
            }
            interlocutor.push(stemp)


        } catch (error) {
            console.log("There is an issue with this thread " + thread_list[i]);
            console.error(error);
        }
    }

    result_object = { "thread": thread_list, "time_seprator_list": time_seprator_list, "conterpart_list": conterpart_list, "message_count_list": message_count_list, "interlocutor": interlocutor }
    //await buster.setResultObject(result_object)
    const jsonUrl = await buster.saveText(JSON.stringify(result_object), "result.json")
    console.log("json saved")

    header = ["thread", "time_seprator_list", "conterpart_list", "message_count_list", "interlocutor"]
    array_list = [thread_list, time_seprator_list, conterpart_list, message_count_list, interlocutor]
    //console.log(conterpart_list)
    //console.log("array_list")
    //console.log(array_list)
    result_csv = await create_csv(array_list, header)
    console.log("csv generated")
    //console.log(result_csv)
    const csvUrl = await buster.saveText(result_csv, "result.csv")

    


nick.exit()
    
}  

async function main_with_error_handling(){ 
try {
    await main()
}catch(error) {
    console.error(error);
    nick.exit()
}
}

main_with_error_handling()
