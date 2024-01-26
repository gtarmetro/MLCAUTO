import { test, expect } from '@playwright/test';
import nlp from 'compromise';


//Set test timeout for 2 minutes
test.setTimeout(120000);
//Song Title and Artist variable to be input by user from command, search variables with %20 instead of spaces for links
let songinput;
let title = process.env.TITLE || 'right foot creep';
let artist = process.env.ARTIST || 'youngboy never broke again';
//search variables for website urls requiring "%20" instead of spaces
let titlesearch = title.replace(/\s+/g, '%20');
let artistsearch = artist.replace(/\s+/g, '%20');

test('DSPSEARCH', async ({ page }) => {

console.log('Results for:', title, '-', artist);


//SPOTIFY SEARCH - CAN BE SEPARATE TEST EVENTUALLY

    songinput = titlesearch + '%20' + artistsearch;
    await page.goto('https://open.spotify.com/search' + '/' + songinput);
    await page.getByTestId('herocard-click-handler').click();
    await page.getByTestId('action-bar-row').getByTestId('more-button').click();
    await page.getByRole('menuitem', { name: 'Show credits' }).click();

console.log(' ');
console.log('-----SPOTIFY RESULTS-----');

    const spwrblock = page.locator('div')
        .filter({ hasText: /^Written by/ }).locator('span');
    const spprblock = page.locator('div')
        .filter({ hasText: /^Produced by/ }).locator('span');


    await page.waitForTimeout(300);
    const spwrblock_array = await spwrblock.allInnerTexts();
    const spprblock_array = await spprblock.allInnerTexts();

console.log('Writers:', spwrblock_array );
console.log('Producers:', spprblock_array );

/*BIG BLOCK OF TRIES! We're past this but I don't wanna move stuff and break things so I'll do it later
await page.waitForTimeout(100);
console.log('allTextContents Writers:', await spwrblock.allTextContents());
await page.waitForTimeout(100);
console.log('allTextContents Writers:', await spwrblock.allTextContents());
await page.waitForTimeout(100);
console.log('allInnerTexts Writers:', await spwrblock.allInnerTexts());
await page.waitForTimeout(100);
console.log('allInnerTexts Writers:', await spwrblock.allInnerTexts());
await page.waitForTimeout(100);
console.log('allTextContents Producers:', await spprblock.allTextContents());
await page.waitForTimeout(100);
console.log('allTextContents Producers:', await spprblock.allTextContents());
await page.waitForTimeout(100);
console.log('allInnerTexts Producers:', await spprblock.allInnerTexts());
await page.waitForTimeout(100);
console.log('allInnerTexts Producers:', await spprblock.allInnerTexts());*/


//GOOGLE SEARCH - CAN BE SEPARATE TEST EVENTUALLY

//search variables for google search urls requiring "+" instead of spaces
    let googlesearch1 = artist.replace(/\s+/g, '+');
    let googlesearch2 = googlesearch1 + '+' + title.replace(/\s+/g, '+') + '+Lyrics';

console.log(' ');
console.log('-----GOOGLE RESULTS-----');

    await page.goto('https://www.google.com/search?q=' + googlesearch1);

    const aboutsection = page.locator('div')
        .filter({ hasText: /^About/ }).locator('div')
        .filter({ hasText: /^Description/ });

    const description_array = await aboutsection.allInnerTexts();

//PARSE OUT NAMES FOR MLC SEARCH!
    /*const desctext = description_array[1];
    const descdoc = nlp(desctext);
    console.log(descdoc.people().text());*/

console.log(' ');
console.log(description_array[1] || 'No Description Provided');

/*let newStr = description_array[1];
let newArray = ['Scrub'];

for (let i = 0; i < newStr.length, newStr[i] !== '.'; i ++) {
    if (newStr[i].match(/[A-Z]/)) {
        newArray.push(newStr[i]);
       
    }
}
console.log(newArray);*/

    await page.waitForTimeout(100);
    await page.goto('https://www.google.com/search?q=' + googlesearch2);

    const lyricfind = page.locator('div')
        .filter({ hasText: /^Songwriters/ });
console.log(' ');
console.log('LyricFind:', await lyricfind.allInnerTexts());


//ASCAP SEARCH - CAN BE SEPARATE TEST EVENTUALLY

    await page.goto('https://www.ascap.com/repertory#/ace/search/' + 'title/' + titlesearch + '/performer/' + artistsearch + '?at=false&searchFilter=SVW&page=1');
    await page.frameLocator('iframe[name="trustarc_cm"]').getByRole('button', { name: 'Agree and Proceed' }).click();
    await page.getByRole('button', { name: 'I Agree' }).click();
    await page.getByRole('button', { name: 'Skip' }).click();

    const writerstable = page.locator('table').getByRole('cell');

console.log(' ');
console.log('-----ASCAP RESULTS-----');

    await page.waitForTimeout(8000);

console.log('Writers:', await writerstable.allInnerTexts());

});
