import { test, expect } from '@playwright/test';
import { link } from 'fs';
import { addAbortListener } from 'stream';
//Set test timeout for 2 minutes
test.setTimeout(120000);
//Song Title and Artist variable to be input by user from command, search variables with %20 instead of spaces for links
let songinput;
let title = process.env.TITLE || 'right foot creep';
let artist = process.env.ARTIST || 'youngboy never broke again';
//search variables for website urls requiring "%20" instead of spaces
let titlesearch = title.replace(/\s+/g, '%20');
let artistsearch = artist.replace(/\s+/g, '%20');

test('QUICKSPOTIFY', async ({ page }) => {

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


//MLC SEARCH FOR THE SONGWRITERS FOUND IN SPOTIFY

await page.goto('https://portal.themlc.com/search#work');
await page.getByRole('link', { name: 'Allow all cookies' }).click();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Add Criteria' }).click();

await page.getByTestId('search.0.searchTerm').click();
await page.getByTestId('search.0.searchTerm').fill(title);

let mlcsearch_array;
//For every writer, search for codes -> For every code found, print code!!
for(let i = 0; i < spwrblock_array.length; i++){
    await page.getByTestId('search.1.searchTerm').click();
    await page.getByTestId('search.1.searchTerm').fill(spwrblock_array[i]);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(1000);
    const mlcsongcode_array = await page.locator('div').filter({ hasText: /^MLC Song Code/}).allTextContents();
    await page.waitForTimeout(1000);

    for(let i = 0; i < mlcsongcode_array.length; i++){
        console.log(mlcsongcode_array[i]);
    }
    await page.waitForTimeout(300);
  }


/*await page.getByTestId('search.1.searchTerm').click();
await page.getByTestId('search.1.searchTerm').fill('Jon Brion');
await page.getByRole('button', { name: 'Search' }).click();
await page.getByRole('link', { name: 'TROUBLE MLC Song Code:T4556J' }).click();
await page.getByRole('button', { name: '< Back to public search' }).click();
await page.getByRole('link', { name: 'TROUBLE MLC Song Code:X77249' }).click();
await page.getByRole('button', { name: '< Back to public search' }).click();*/


});


