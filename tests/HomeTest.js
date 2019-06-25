import {
    BasePage
} from "../pages/BasePage";

const page = new BasePage();

fixture `Home`.page(page.baseUrl);

test('Correct title displays', async t => {
    await t
        .expect(page.title.textContent)
        .eql("name game");
});

test('Attempts counter increments after selecting a photo', async t => {
    const initialAttemptsCount = Number(await page.attempts.textContent);

    await t.click(page.photo);

    const finalAttemptsCount = Number(await page.attempts.textContent);

    await t
        .expect(finalAttemptsCount)
        .eql(initialAttemptsCount + 1);
});


test('Verify the "streak" counter is incrementing on correct selects', async t => {
    await page.waitForPageLoad();

    const initialStreakCount = Number(await page.streak.textContent);
    const correctSelection = await page.getCorrectSelection();

    await page.selectPhoto(correctSelection);

    const finalStreakCount = Number(await page.streak.textContent);

    await t
        .expect(finalStreakCount)
        .eql(initialStreakCount + 1);

})


test('Verify the a multiple “streak” counter resets after getting an incorrect answer', async t => {
    await page.waitForPageLoad();

    const initialStreakCount = Number(await page.streak.textContent);
    var correctSelection = await page.getCorrectSelection()

    await page.selectPhoto(correctSelection);

    var streakCount = Number(await page.streak.textContent);

    await t
        .expect(streakCount)
        .eql(initialStreakCount + 1);

    await page.waitForNextRound();

    correctSelection = await page.getCorrectSelection();

    await page.selectPhoto(correctSelection);

    streakCount = Number(await page.streak.textContent);

    await t
        .expect(streakCount)
        .eql(initialStreakCount + 2);

    await page.waitForNextRound();

    correctSelection = await page.getCorrectSelection();
    const incorrectSelection = await page.getIncorrectSelection(correctSelection);

    await page.selectPhoto(incorrectSelection);

    streakCount = Number(await page.streak.textContent);

    await t
        .expect(streakCount)
        .eql(0, {
            timeout: 1000
        });
})

test('Verify that the correct counters are being incremented for tries and correct counters', async t => {
    await page.waitForPageLoad();

    const initialCorrectCount = Number(await page.correct.textContent);
    const initialTriesCount = Number(await page.attempts.textContent);

    var correctSelection = await page.getCorrectSelection()

    await page.selectPhoto(correctSelection);
    await page.waitForNextRound();

    const correctCount = Number(await page.correct.textContent);
    const triesCount = Number(await page.attempts.textContent);

    await t
        .expect(correctCount)
        .eql(initialCorrectCount + 1);

    await t
        .expect(triesCount)
        .eql(initialTriesCount + 1);

})

test('Verify name and displayed photos change after selecting the correct answer', async t => {
    await page.waitForPageLoad();

    const initialWhoIs = await page.whois.textContent;
    const initialImages = await page.getImageScources();
    const correctSelection = await page.getCorrectSelection();

    await page.selectPhoto(correctSelection);
    await page.waitForNextRound();

    const currentWhoIs = await page.whois.textContent;
    const currentImages = await page.getImageScources();

    await t
        .expect(initialWhoIs)
        .notEql(currentWhoIs);

    for (var i = 0; i < initialImages.length; i++) {
        await t
            .expect(initialImages[i])
            .notEql(currentImages[i], 'image ' + i + ' did not change');
    }

})

test('Verify name and correct answer name match', async t => {
    await page.waitForPageLoad();

    const initialWhoIs = await page.whois.textContent;
    const correctSelection = await page.getCorrectSelection();
    const correctPhotoName = await page.photo.nth(correctSelection).textContent;

    await t
        .expect(correctPhotoName)
        .contains(initialWhoIs);

})