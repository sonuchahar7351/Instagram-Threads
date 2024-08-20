import cron, { CronJob } from 'cron';
import https from 'https';

const URL = 'https://sonu-threads.onrender.com';

const job = new cron.CronJob("30 * * * *", () => {
      https.get(URL,(res)=>{
            if(res.statusCode === 200){
              console.log("get request sent successfully");
            }else{
                  console.log("get request failed");
            }
      }).on('error', (e) => {
            console.log("error while sending request",e);
      });
});

export default job;