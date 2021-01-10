import { WebPageData } from "Core/types/types";

(async () => {
    const webPageData: WebPageData = await new Promise(resolve => {
        chrome.storage.local.get(['webPageData'], function(items){
            resolve(items['webPageData']);
        });
    });

    console.log(webPageData);
})();